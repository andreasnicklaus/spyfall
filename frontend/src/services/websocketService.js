let subscribers = {};

export function subscribe(id, callbacks) {
  subscribers[id] = callbacks;
}

export function unsubscribe(id) {
  delete subscribers[id];
}

const host = process.env.PRODUCTION
  ? "wss://spyfall.andreasnicklaus.de/ws"
  : `ws://${window.location.hostname}:8080/ws`;

const ws = new WebSocket(host);

ws.onerror = (error) => {
  console.log("Socket error", error);
  Object.values(subscribers).forEach(
    ({ onErrorCallback }) => onErrorCallback && onErrorCallback(error),
  );
};

ws.onclose = (event) => {
  console.warn("Websocket closed");
  Object.values(subscribers).forEach(
    ({ onCloseCallback }) => onCloseCallback && onCloseCallback(event),
  );
};

ws.onmessage = (messageEvent) => {
  const data = JSON.parse(messageEvent.data);
  if (data.type === "ping") {
    ws.send(JSON.stringify({ type: "pong" }));
  } else
    Object.values(subscribers).forEach(({ onMessageCallback }) => {
      onMessageCallback(data);
    });
};

export function sendMessage(message) {
  ws.send(JSON.stringify(message));
}
