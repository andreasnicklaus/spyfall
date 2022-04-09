let subscribers = []

export function subscribe(id, callbacks) {
    subscribers.id = callbacks
}

export function unsubscribe(id) {
    delete subscribers[id]
}

export function addSnack(message) {
    Object.values(subscribers).forEach(({onMessageCallback}) => {onMessageCallback(message)})
}