import "dotenv/config";
import {WebSocketServer} from "ws";
import {handleClose, handleMessage} from "./rooms.js";
import {v4 as uuidv4} from "uuid"

const PORT = process.env.PORT
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    const uuid = uuidv4();

    ws.on('message', data => {
        handleMessage(ws, uuid, JSON.parse(data));
    });

    ws.on('close', () => {
        handleClose(uuid)
    })
});

console.log(`Running on port ${PORT}...`)