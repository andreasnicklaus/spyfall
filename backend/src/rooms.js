const rooms = {}

function leave(roomCode, uuid) {
    if (!rooms[roomCode]) {
        console.warn(`Room ${roomCode} does not exist`)
        return;
    }

    if (!rooms[roomCode][uuid]) {
        console.warn(`User ${uuid} is not in room ${roomCode}`)
        return;
    }

    if (Object.keys(rooms[roomCode]).length === 1) {
        console.log(`Room ${roomCode} deleted.`)
        delete rooms[roomCode];
    } else {
        console.log(`User ${uuid} left room ${roomCode}`)
        delete rooms[roomCode][uuid]
    }
}

function broadCastMessage(roomCode, data) {
    Object.entries(rooms[roomCode]).forEach(([, {socket}]) => {
        socket.send(JSON.stringify(data))
    });
}

export function handleMessage(socket, uuid, data) {
    console.log("data", data)
    let {meta, message, roomCode, playerName} = data;

    if (meta === "join") {
        if (!rooms[roomCode]) {
            socket.send(JSON.stringify({meta: "NoRoomWithRoomCode", roomCode}));
            return
        }
        if (!rooms[roomCode][uuid]) rooms[roomCode][uuid] = {socket, playerName, gameLeader: false};
    } else if (meta === "leave") {
        leave(roomCode, uuid)
    } else if (meta === "create") {
        // Create a random room code
        while (!roomCode || rooms[roomCode]) roomCode = Math.random().toString(36).substring(0, 5)

        // Create a room
        rooms[roomCode] = {}

        // Add user to the new room
        rooms[roomCode][uuid] = {socket, playerName, gameLeader: true}
        console.log(`Room ${roomCode} created`)

        // Send confirmation with room code
        socket.send(JSON.stringify({meta: "RoomCreated", roomCode}))
    } else if (!meta) {
        if (!rooms[roomCode]) return
        console.log(`Sending back message: ${message}`)
        broadCastMessage(roomCode, {message})
    }

    if (!rooms[roomCode]) return
    broadCastMessage(roomCode, {
        players: Object.values(rooms[roomCode]).map(
            p => ({playerName: p.playerName, gameLeader: p.gameLeader})
        )
    })
}

export function handleClose(uuid) {
    console.log(`User ${uuid} closed the connection`)
    Object.keys(rooms).forEach(roomCode => {
        if (rooms[roomCode][uuid]) {
            leave(roomCode, uuid)
            if (rooms[roomCode]) {
                broadCastMessage(roomCode, {
                    players: Object.keys(rooms[roomCode]).map(
                        uuid => rooms[roomCode][uuid].playerName
                    )
                })
            }
        }
    })
}