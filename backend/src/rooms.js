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
    Object.entries(rooms[roomCode]).forEach(([userUuid, {socket}]) => {
        socket.send(JSON.stringify(data))
    });
}

export function handleMessage(socket, uuid, data) {
    console.log("data", data)
    const {meta, message, roomCode, playerName} = data;

    if (meta === "join") {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode][uuid]) rooms[roomCode][uuid] = {socket, playerName};
    } else if (meta === "leave") {
        leave(roomCode, uuid)
    } else if (!meta) {
        if (!rooms[roomCode]) return
        broadCastMessage(roomCode, {message})
    }

    if (!rooms[roomCode]) return
    broadCastMessage(roomCode, {
        players: Object.keys(rooms[roomCode]).map(
            k => rooms[roomCode][k].playerName
        )
    })
}

export function handleClose(uuid) {
    Object.keys(rooms).forEach(room => leave(room))
}