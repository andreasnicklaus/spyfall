let subscribers = {}

export function subscribe(id, callbacks) {
    subscribers.id = callbacks
}

export function unsubscribe(id) {
    delete subscribers[id]
}

const ws = new WebSocket(`wss://${window.location.hostname}/ws`);
// const ws = new WebSocket(`ws://${window.location.hostname}:8080`);

ws.onerror = (error) => {
    console.log("Socket error", error)
    Object.values(subscribers).forEach(({ onErrorCallback }) => onErrorCallback(error))
}

ws.onclose = () => {
    console.warn("Websocket closed")
    Object.values(subscribers).forEach(({ onCloseCallback }) => onCloseCallback())
}

ws.onmessage = messageEvent => {
    const data = JSON.parse(messageEvent.data)
    if (data.type === "ping") { ws.send(JSON.stringify({ type: "pong" })) }
    else Object.values(subscribers).forEach(({ onMessageCallback }) => {
        onMessageCallback(data)
    })
}

export function sendMessage(message) {
    ws.send(JSON.stringify(message))
}