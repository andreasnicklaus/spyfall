const rooms = {};
const connections = {};

const locations = [
  "yacht", "wedding", "train-station", "supermarket", "strip-club",
  "restaurant", "jail", "hospital", "cruise-ship", "concert",
  "coffee-shop", "cemetery", "beach-house", "bar",
].map((name) => ({
  name,
  src: `/assets/img/${name}.jpg`,
}));

function roomFor(roomCode) {
  return roomCode && rooms[roomCode];
}

function connected(player) {
  return player && player.socket && player.socket.readyState === 1;
}

function broadcast(roomCode, data) {
  const room = roomFor(roomCode);
  if (!room) return;
  Object.values(room.players).forEach((player) => {
    if (connected(player)) player.socket.send(JSON.stringify(data));
  });
}

function playerList(room, recipientId) {
  return Object.values(room.players).map((player) => ({
    playerName: player.playerName,
    gameLeader: player.gameLeader,
    ready: player.ready,
    connected: player.connected,
    spy: player.playerId === recipientId ? player.spy : false,
  }));
}

function sendPlayerList(roomCode) {
  const room = roomFor(roomCode);
  if (!room) return;
  Object.values(room.players).forEach((player) => {
    if (connected(player)) {
      player.socket.send(JSON.stringify({ players: playerList(room, player.playerId) }));
    }
  });
}

function personalizedState(roomCode, playerId) {
  const room = rooms[roomCode];
  const player = room.players[playerId];
  const state = {
    type: "roomState",
    roomCode,
    minutes: room.minutes,
    gameInProgress: room.gameInProgress,
    roundEnded: room.roundEnded,
    startedAt: room.startedAt,
    endsAt: room.endsAt,
    players: playerList(room, playerId),
  };
  if (room.gameInProgress && !player.spy && room.location) state.location = room.location;
  return state;
}

function sendState(roomCode, playerId) {
  const room = roomFor(roomCode);
  const player = room && room.players[playerId];
  if (connected(player)) player.socket.send(JSON.stringify(personalizedState(roomCode, playerId)));
}

function clearRoundTimer(room) {
  if (room.roundTimer) clearTimeout(room.roundTimer);
  room.roundTimer = null;
}

function finishRound(roomCode) {
  const room = roomFor(roomCode);
  if (!room || !room.gameInProgress || room.roundEnded) return;
  room.roundEnded = true;
  room.roundTimer = null;
  broadcast(roomCode, { type: "gameEnded", endsAt: room.endsAt });
}

function stopGame(roomCode) {
  const room = roomFor(roomCode);
  if (!room) return;
  clearRoundTimer(room);
  room.gameInProgress = false;
  room.roundEnded = false;
  room.location = null;
  room.startedAt = null;
  room.endsAt = null;
  Object.values(room.players).forEach((player) => { player.spy = false; });
  broadcast(roomCode, { type: "gameStopped" });
  sendPlayerList(roomCode);
}

function leave(roomCode, playerId) {
  const room = roomFor(roomCode);
  if (!room || !room.players[playerId]) return;
  const wasLeader = room.players[playerId].gameLeader;
  delete room.players[playerId];
  delete connections[playerId];

  if (Object.keys(room.players).length === 0) {
    clearRoundTimer(room);
    delete rooms[roomCode];
    return;
  }

  if (wasLeader) {
    const nextLeader = Object.values(room.players).find((player) => player.connected)
      || Object.values(room.players)[0];
    if (nextLeader) nextLeader.gameLeader = true;
  }
  sendPlayerList(roomCode);
}

function createRoom(playerId, playerName, socket, minutes = 6) {
  let roomCode;
  do roomCode = Math.random().toString(36).substring(2, 6); while (rooms[roomCode]);
  rooms[roomCode] = {
    players: {}, minutes: Math.max(1, Math.min(8, Number(minutes) || 6)), gameInProgress: false, roundEnded: false,
    location: null, startedAt: null, endsAt: null, roundTimer: null,
  };
  rooms[roomCode].players[playerId] = {
    playerId, playerName, socket, connected: true,
    gameLeader: true, ready: false, spy: false,
  };
  connections[playerId] = { roomCode, socket };
  socket.send(JSON.stringify({ type: "RoomCreated", roomCode }));
  sendState(roomCode, playerId);
  sendPlayerList(roomCode);
}

function joinRoom(roomCode, playerId, playerName, socket) {
  const room = roomFor(roomCode);
  if (!room) {
    socket.send(JSON.stringify({ type: "NoRoomWithRoomCode", roomCode }));
    return;
  }

  const existing = room.players[playerId];
  if (existing) {
    existing.socket = socket;
    existing.connected = true;
    existing.playerName = playerName;
  } else {
    room.players[playerId] = {
      playerId, playerName, socket, connected: true,
      gameLeader: false, ready: false, spy: false,
    };
  }
  connections[playerId] = { roomCode, socket };
  sendState(roomCode, playerId);
  sendPlayerList(roomCode);
}

function startGame(roomCode, playerId) {
  const room = roomFor(roomCode);
  const leader = room && room.players[playerId];
  if (!leader || !leader.gameLeader || Object.keys(room.players).length === 0) return;
  clearRoundTimer(room);
  Object.values(room.players).forEach((player) => { player.spy = false; });
  const players = Object.values(room.players);
  players[Math.floor(Math.random() * players.length)].spy = true;
  room.location = locations[Math.floor(Math.random() * locations.length)];
  room.startedAt = Date.now();
  room.endsAt = room.startedAt + room.minutes * 60 * 1000;
  room.gameInProgress = true;
  room.roundEnded = false;
  room.roundTimer = setTimeout(() => finishRound(roomCode), room.minutes * 60 * 1000);

  players.forEach((player) => {
    if (connected(player)) {
      const state = personalizedState(roomCode, player.playerId);
      player.socket.send(JSON.stringify({ ...state, type: "gameStart" }));
    }
  });
  sendPlayerList(roomCode);
}

module.exports.handleMessage = function handleMessage(socket, connectionId, data) {
  const { meta, roomCode, playerId, playerName, ready, minutes } = data;

  if (meta === "create") {
    createRoom(playerId, playerName, socket, minutes);
    return;
  }
  if (meta === "join") {
    joinRoom(roomCode, playerId, playerName, socket);
    return;
  }

  const connection = connections[playerId] || Object.values(connections).find((item) => item.socket === socket);
  const actualRoomCode = connection?.roomCode || roomCode;
  const room = roomFor(actualRoomCode);
  const player = room && room.players[playerId];
  if (!room || !player) return;

  if (meta === "leave") {
    leave(actualRoomCode, playerId);
  } else if (meta === "readyUpdate") {
    player.ready = !!ready;
    sendPlayerList(actualRoomCode);
  } else if (meta === "playerKick" && player.gameLeader) {
    const target = Object.values(room.players).find((candidate) => candidate.playerName === data.playerName);
    if (target) {
      if (connected(target)) target.socket.send(JSON.stringify({ type: "kickedFromRoom" }));
      leave(actualRoomCode, target.playerId);
    }
  } else if (meta === "updateMinutes" && player.gameLeader && !room.gameInProgress) {
    room.minutes = Math.max(1, Math.min(8, Number(minutes) || 1));
    broadcast(actualRoomCode, { minutes: room.minutes });
  } else if (meta === "startGame") {
    startGame(actualRoomCode, playerId);
  } else if (meta === "stopGame" && player.gameLeader) {
    stopGame(actualRoomCode);
  }
};

module.exports.handleClose = function handleClose(connectionId, socket) {
  Object.entries(connections).forEach(([playerId, connection]) => {
    if (connection.socket !== socket) return;
    const room = roomFor(connection.roomCode);
    const player = room && room.players[playerId];
    if (player && player.socket === socket) {
      player.connected = false;
      player.socket = null;
      sendPlayerList(connection.roomCode);
    }
    delete connections[playerId];
  });
};
