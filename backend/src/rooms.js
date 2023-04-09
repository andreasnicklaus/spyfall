const rooms = {}

function leave(roomCode, uuid) {
    if (!rooms[roomCode]) {
        console.warn(new Date().toLocaleString('de'), `Room ${roomCode} does not exist`)
        return;
    }

    if (!rooms[roomCode].players[uuid]) {
        console.warn(new Date().toLocaleString('de'), `User ${uuid} is not in room ${roomCode}`)
        return;
    }

    if (Object.keys(rooms[roomCode].players).length === 1) {
        console.log(new Date().toLocaleString('de'), `Room ${roomCode} deleted.`)
        delete rooms[roomCode];
    } else {
        console.log(new Date().toLocaleString('de'), `User ${uuid} left room ${roomCode}`)
        delete rooms[roomCode].players[uuid]
    }
}

function broadCastMessage(roomCode, data) {
    Object.entries(rooms[roomCode].players).forEach(([uuid, { socket }]) => {
        socket.send(JSON.stringify(data))
    });
}

function broadCastPlayerList(roomCode) {
    Object.entries(rooms[roomCode].players).forEach(([clientUUID, client]) => {
        client.socket.send(JSON.stringify({
            players: Object.values(rooms[roomCode].players).map(
                p => ({
                    playerName: p.playerName,
                    gameLeader: p.gameLeader,
                    ready: p.ready,
                    spy: rooms[roomCode].players[clientUUID].spy ? p.spy : false
                })
            )
        }))
    });
}

function broadCastOnlyNonSpyMessage(roomCode, data) {
    Object.entries(rooms[roomCode].players).forEach(([clientUUID, client]) => {
        if (!rooms[roomCode].players[clientUUID].spy) {
            client.socket.send(JSON.stringify(data))
        }
    });
}

function broadCastOnlySpyMessage(roomCode, data) {
    Object.entries(rooms[roomCode].players).forEach(([clientUUID, client]) => {
        if (rooms[roomCode].players[clientUUID].spy) {
            client.socket.send(JSON.stringify(data))
        }
    });
}

function broadCastLocation(roomCode) {
    broadCastOnlyNonSpyMessage(roomCode, { location: rooms[roomCode].location })
    console.log(new Date().toLocaleString('de'), 'Broadcasted location...')
}

export function handleMessage(socket, uuid, data) {
    // console.log("data", data)
    let { meta, roomCode, playerName, ready, location } = data;

    if (meta === "join") {
        if (!rooms[roomCode]) {
            socket.send(JSON.stringify({ type: "NoRoomWithRoomCode", roomCode }));
            return
        }
        if (!rooms[roomCode].players[uuid]) {
            rooms[roomCode].players[uuid] = { socket, playerName, gameLeader: false, ready: false, spy: false };
            broadCastLocation(roomCode)
            console.log(new Date().toLocaleString('de'), `Player ${playerName} (uuid: ${uuid}) joined game room ${roomCode}`)
        }
    } else if (meta === "leave") {
        leave(roomCode, uuid)
    } else if (meta === "create") {
        // Create a random room code
        while (!roomCode || rooms[roomCode]) roomCode = Math.random().toString(36).substring(2, 5)

        // Create a room
        rooms[roomCode] = { players: {} }

        // Add user to the new room
        rooms[roomCode].players[uuid] = { socket, playerName, gameLeader: true, ready: false, spy: false }
        console.log(new Date().toLocaleString('de'), `Room ${roomCode} created`)

        // Send confirmation with room code
        socket.send(JSON.stringify({ type: "RoomCreated", roomCode }))
    } else if (meta === "readyUpdate") {
        rooms[roomCode].players[uuid].ready = ready
        console.log(new Date().toLocaleString('de'), `Player ${rooms[roomCode].players[uuid].playerName || uuid} is ready`)
    } else if (meta === "playerKick") {
        if (rooms[roomCode].players[uuid].gameLeader) {
            Object.keys(rooms[roomCode].players).forEach((uuid) => {
                if (rooms[roomCode].players[uuid].playerName === playerName) {
                    rooms[roomCode].players[uuid].socket.send(JSON.stringify({
                        type: "kickedFromRoom"
                    }))
                    delete rooms[roomCode].players[uuid]
                }
            })
            console.log(new Date().toLocaleString('de'), `Player ${playerName} was kicked`)
        }
    } else if (meta === "chooseSpy") {
        if (rooms[roomCode].players[uuid].gameLeader) {
            // When the game is restarted, the spy status has to be reset
            Object.values(rooms[roomCode].players).forEach(p => p.spy = false)

            const uuids = Object.keys(rooms[roomCode].players)
            rooms[roomCode].players[uuids[Math.floor(Math.random() * uuids.length)]].spy = true

            // console.log("Chose spy. It is", Object.values(rooms[roomCode]).filter(p => p.spy)[0].playerName)
            // broadCastPlayerList(roomCode)
            // return
        }
    } else if (meta === "shareLocation") {
        if (rooms[roomCode].players[uuid].gameLeader) {
            rooms[roomCode].location = location
            broadCastLocation(roomCode)
        }
    } else if (!meta) {
        if (!rooms[roomCode]) return
        // console.log(`Sending back message: ${JSON.stringify(data)}`)
        broadCastMessage(roomCode, { ...data })
    }

    if (!rooms[roomCode]) return

    broadCastPlayerList(roomCode)
}

export function handleClose(uuid) {
    console.log(new Date().toLocaleString('de'), `User ${uuid} closed the connection`)
    Object.keys(rooms).forEach(roomCode => {
        if (rooms[roomCode].players[uuid]) {
            leave(roomCode, uuid)
            if (rooms[roomCode]) {
                broadCastMessage(roomCode, {
                    players: Object.keys(rooms[roomCode].players).map(
                        uuid => rooms[roomCode].players[uuid].playerName
                    )
                })
            }
        }
    })
}