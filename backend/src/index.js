// import "dotenv/config";
const http = require("http");
const path = require("path");
const express = require("express");
const { WebSocketServer } = require("ws");
const { handleClose, handleMessage } = require("./rooms.js");
const { v4: uuidv4 } = require("uuid");
const { isBot } = require("./botFilter");

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const STARTED_AT = new Date();

const app = express();

// Block bots on every HTTP route except robots.txt, which crawlers must be
// able to read so they honour the disallow rules.
app.use((req, res, next) => {
    if (req.path === "/robots.txt") return next();

    const userAgent = (req.headers && req.headers["user-agent"]) || "";
    if (isBot(userAgent)) {
        res.status(403).type("text/plain").send("Forbidden");
        return;
    }

    next();
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/", (req, res) => {
    res.type("text/plain").send(`Running since ${STARTED_AT.toISOString()}`);
});

// Serve everything in backend/public (robots.txt and future static assets).
app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
    res.status(404).type("text/plain").send("Not Found");
});

const server = http.createServer(app);

const wss = new WebSocketServer({
    server,
    verifyClient: (info, callback) => {
        const userAgent = (info.req.headers && info.req.headers["user-agent"]) || "";
        if (isBot(userAgent)) {
            callback(false, 403, "Forbidden");
            return;
        }
        callback(true);
    },
});

wss.on("connection", (ws, req) => {
    const uuid = uuidv4();
    console.log(new Date().toLocaleString("de"), `New connection (uuid: ${uuid})`);

    ws.pingTimout = setInterval(() => {
        ws.send(JSON.stringify({ type: "ping" }));
    }, 30 * 1000);

    ws.on("message", (data) => {
        if (JSON.parse(data).type === "pong") return;
        handleMessage(ws, uuid, JSON.parse(data));
    });

    ws.on("close", () => {
        clearInterval(ws.pingTimout);
        handleClose(uuid, ws);
    });
});

server.listen(PORT, () => {
    console.log(new Date().toLocaleString("de"), `Running on port ${PORT}...`);
});

module.exports = { app, server, wss, isBot };
module.exports.app = app;
module.exports.server = server;
module.exports.wss = wss;
module.exports.isBot = isBot;
