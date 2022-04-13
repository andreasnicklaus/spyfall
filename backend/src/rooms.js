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

function broadCastPlayerList(roomCode) {
    Object.entries(rooms[roomCode]).forEach(([clientUUID, client]) => {
        client.socket.send(JSON.stringify({
            players: Object.values(rooms[roomCode]).map(
                p => ({
                    playerName: p.playerName,
                    gameLeader: p.gameLeader,
                    ready: p.ready,
                    spy: rooms[roomCode][clientUUID].spy ? p.spy : false
                })
            )
        }))
    });
}

function broadCastLocation(roomCode, location) {
    Object.entries(rooms[roomCode]).forEach(([clientUUID, client]) => {
        if (!rooms[roomCode][clientUUID].spy) {
            client.socket.send(JSON.stringify({location}))
        }
    });
}

export function handleMessage(socket, uuid, data) {
    // console.log("data", data)
    let {meta, roomCode, playerName, ready, location} = data;

    if (meta === "join") {
        if (!rooms[roomCode]) {
            socket.send(JSON.stringify({type: "NoRoomWithRoomCode", roomCode}));
            return
        }
        if (!rooms[roomCode][uuid]) rooms[roomCode][uuid] = {socket, playerName, gameLeader: false, ready: false, spy: false};
    } else if (meta === "leave") {
        leave(roomCode, uuid)
    } else if (meta === "create") {
        // Create a random room code
        while (!roomCode || rooms[roomCode]) roomCode = Math.random().toString(36).substring(0, 5)

        // Create a room
        rooms[roomCode] = {}

        // Add user to the new room
        rooms[roomCode][uuid] = {socket, playerName, gameLeader: true, ready: false, spy: false}
        console.log(`Room ${roomCode} created`)

        // Send confirmation with room code
        socket.send(JSON.stringify({type: "RoomCreated", roomCode}))
    } else if (meta === "readyUpdate") {
        rooms[roomCode][uuid].ready = ready
    } else if (meta === "playerKick") {
        if (rooms[roomCode][uuid].gameLeader){
            Object.keys(rooms[roomCode]).forEach((uuid) => {
                if (rooms[roomCode][uuid].playerName === playerName) {
                    rooms[roomCode][uuid].socket.send(JSON.stringify({
                        type: "kickedFromRoom"
                    }))
                    delete rooms[roomCode][uuid]
                }
            })
        }
    } else if (meta === "chooseSpy") {
        if (rooms[roomCode][uuid].gameLeader){
            // When the game is restarted, the spy status has to be reset
            Object.values(rooms[roomCode]).forEach(p => p.spy = false)

            const uuids = Object.keys(rooms[roomCode])
            rooms[roomCode][uuids[Math.floor(Math.random() * uuids.length)]].spy = true

            // console.log("Chose spy. It is", Object.values(rooms[roomCode]).filter(p => p.spy)[0].playerName)
            // broadCastPlayerList(roomCode)
            // return
        }
    } else if (meta === "shareLocation") {
        if (rooms[roomCode][uuid].gameLeader){
            broadCastLocation(roomCode, location)
        }
    } else if (!meta) {
        if (!rooms[roomCode]) return
        // console.log(`Sending back message: ${JSON.stringify(data)}`)
        broadCastMessage(roomCode, {...data})
    }

    if (!rooms[roomCode]) return

    broadCastPlayerList(roomCode)
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