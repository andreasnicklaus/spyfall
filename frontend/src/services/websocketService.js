import game from "./spyfallGame";

const ws = new WebSocket("ws://localhost:8080");

ws.onerror = (error) => {
    console.log("Socket error", error)
}

ws.onclose = () => {
    console.warn("Websocket closed")
}

ws.onmessage = messageEvent => {
    console.log("Received new message", messageEvent.data)
    const data = JSON.parse(messageEvent.data)
    let {players} = data
    console.log(typeof players, players)
    game().setPlayerList(players)
}

export function sendMessage(message) {
    ws.send(JSON.stringify(message))
}