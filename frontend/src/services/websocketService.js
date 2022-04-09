let subscribers = {}

export function subscribe(id, callbacks) {
    subscribers.id = callbacks
}

export function unsubscribe(id) {
    delete subscribers[id]
}

const ws = new WebSocket("ws://localhost:8080");

ws.onerror = (error) => {
    console.log("Socket error", error)
    Object.values(subscribers).forEach(({onErrorCallback}) => onErrorCallback())
}

ws.onclose = () => {
    console.warn("Websocket closed")
    Object.values(subscribers).forEach(({onCloseCallback}) => onCloseCallback())
}

ws.onmessage = messageEvent => {
    const data = JSON.parse(messageEvent.data)
    Object.values(subscribers).forEach(({onMessageCallback}) => {
        onMessageCallback(data)
    })
}

export function sendMessage(message) {
    ws.send(JSON.stringify(message))
}