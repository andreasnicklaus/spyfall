const ws = new WebSocket("ws://localhost:8080");

ws.onerror = (error) => {
    console.log("Socket error", error)
}

ws.onclose = () => {
    console.log("Websocket closed")
}

export function sendMessage(message) {
    ws.send(message)
}