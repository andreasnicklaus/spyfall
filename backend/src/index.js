import "dotenv/config";
import { WebSocketServer } from "ws";
import { handleClose, handleMessage } from "./rooms.js";
import { v4 as uuidv4 } from "uuid"

const PORT = process.env.PORT || 8080
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', ws => {
    const uuid = uuidv4();
    console.log(new Date().toLocaleString('de'), `New connection (uuid: ${uuid})`)

    ws.pingTimout = setInterval(() => {
        ws.send(JSON.stringify({ type: "ping" }))
    }, 30 * 1000)

    ws.on('message', data => {
        if (JSON.parse(data).type === "pong") return
        handleMessage(ws, uuid, JSON.parse(data));
    });

    ws.on('close', () => {
        clearInterval(ws.pingTimout)
        handleClose(uuid)
    })
});

console.log(new Date().toLocaleString('de'), `Running on port ${PORT}...`)