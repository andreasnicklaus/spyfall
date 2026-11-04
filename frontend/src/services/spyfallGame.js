import { sendMessage, subscribe } from "./websocketService";
import { addSnack } from "./snackBarService";
import route from "./routerService";

class SpyfallGame {
    subscribers;
    roomCode;
    playerName;
    playerList;
    minutes;
    timer;
    startTime;
    location;
    playerId;
    endsAt;
    roundEnded;

    constructor() {
        this.subscribers = {};
        this.playerList = [];
        this.minutes = 6;
        this.time = "00:00";
        this.playerId = this.loadProfile().playerId;
        this.endsAt = null;
        this.roundEnded = false;
        subscribe("SpyfallGame", {
            onMessageCallback: this.messageHandler,
            onErrorCallback: (error) => { route("/"); this.resetGame(); addSnack("Unknown websocket error"); console.error(new Date().toLocaleString('de'), error) },
            onCloseCallback: () => { route("/"); this.resetGame(); addSnack("Websocket closed"); console.warn(new Date().toLocaleString('de'), 'websocket closed due to close message from server') }
        })
    }

    subscribe(id, callback) {
        this.subscribers[id] = callback
    }
    unsubscribe(id) {
        delete this.subscribers[id]
    }
    updateSubs() {
        Object.values(this.subscribers).forEach(({ next }) => {
            next(this);
        })
    }
    setPlayerName(name) {
        this.playerName = name;
        this.saveProfile({ playerName: name });
        this.updateSubs();
    }
    setMinutes(min) {
        this.minutes = min;
        this.updateSubs();
    }
    setRoomCode(code) {
        this.roomCode = code;
        if (code) this.saveProfile({ roomCode: code });
        this.updateSubs()
    }
    setPlayerList(players) {
        this.playerList = players;
        this.updateSubs();
    }
    setTime(time) {
        this.time = time
        this.updateSubs()
    }
    setLocation(loc) {
        this.location = loc;
        this.updateSubs();
    }
    resetGame() {
        this.playerList = [];
        this.minutes = 6;
        this.playerName = null;
        this.roomCode = null;
        this.time = "00:00";
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.location = null;
        this.endsAt = null;
        this.roundEnded = false;
        this.updateSubs();
    }

    loadProfile() {
        let profile = {};
        try { profile = JSON.parse(localStorage.getItem("spyfall.profile") || "{}"); } catch (e) { /* use defaults */ }
        const playerId = profile.playerId || (window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
        const result = { ...profile, playerId };
        try { localStorage.setItem("spyfall.profile", JSON.stringify(result)); } catch (e) { /* storage may be unavailable */ }
        this.playerName = profile.playerName || null;
        this.roomCode = profile.roomCode || null;
        return result;
    }

    saveProfile(values = {}) {
        try {
            const current = JSON.parse(localStorage.getItem("spyfall.profile") || "{}");
            localStorage.setItem("spyfall.profile", JSON.stringify({
                version: 1, ...current, playerId: this.playerId,
                playerName: this.playerName, roomCode: this.roomCode, ...values,
            }));
        } catch (e) { /* storage may be unavailable */ }
    }

    clearSavedRoom() {
        this.saveProfile({ roomCode: "" });
    }

    getSavedProfile() {
        try {
            const profile = JSON.parse(localStorage.getItem("spyfall.profile") || "{}");
            return {
                playerId: this.playerId,
                playerName: profile.playerName || this.playerName || "",
                roomCode: profile.roomCode || this.roomCode || "",
            };
        } catch (e) {
            return { playerId: this.playerId, playerName: this.playerName || "", roomCode: this.roomCode || "" };
        }
    }
    getGameLeader() {
        return this.playerList.filter((player) => player.gameLeader)[0]?.playerName
    }
    isGameLeader() {
        return this.getGameLeader() === this.playerName
    }
    isSpy() {
        return this.playerList.some(({ spy }) => spy)
    }
    messageHandler = (msg) => {
        const { type, roomCode, players, minutes, time, location, endsAt, startedAt, gameInProgress, roundEnded } = msg

        if (typeof minutes === "number") this.setMinutes(minutes);
        if (players) this.setPlayerList(players);
        if (roomCode) this.setRoomCode(roomCode);
        if (Object.prototype.hasOwnProperty.call(msg, "location")) this.setLocation(location || null);
        else if (type === "roomState" || type === "gameStart") this.setLocation(null);
        if (Object.prototype.hasOwnProperty.call(msg, "endsAt")) this.setEndsAt(endsAt, startedAt, roundEnded);

        if (type === "RoomCreated") {
            this.setRoomCode(roomCode)
        } else if (type === "NoRoomWithRoomCode") {
            addSnack(`Error:  Room code ${roomCode} does not exist`)
            console.warn(`Error:  Room code ${roomCode} does not exist`)
            this.clearSavedRoom();
            route("/")
            this.resetGame()
        } else if (type === "kickedFromRoom") {
            this.clearSavedRoom();
            route("/");
            this.resetGame();
            addSnack("You have been kicked from the game");
        } else if (type === "gameStart") {
            this.setEndsAt(endsAt, startedAt, false);
            route("/game")
        } else if (type === "roomState") {
            this.roundEnded = !!roundEnded;
            if (gameInProgress) route("/game");
            else route("/wait");
        } else if (type === "gameStopped") {
            this.stopLocalRound();
            route("/wait");
        } else if (type === "gameEnded") {
            this.roundEnded = true;
            this.setTime("00:00");
        } else if (type === "timeUpdate") {
            this.setTime(time)
            if (window.location.pathname !== '/game') route("/game")
        }
    }

    setEndsAt(endsAt, startedAt, roundEnded = false) {
        this.endsAt = endsAt || null;
        this.roundEnded = !!roundEnded;
        if (this.timer) clearInterval(this.timer);
        if (!this.endsAt || this.roundEnded) {
            if (this.endsAt && this.roundEnded) this.setTime("00:00");
            return;
        }
        this.updateRemainingTime();
        this.timer = setInterval(this.updateRemainingTime, 1000);
    }

    updateRemainingTime = () => {
        if (!this.endsAt) return;
        const remaining = Math.max(0, this.endsAt - Date.now());
        const totalSeconds = Math.ceil(remaining / 1000);
        this.setTime(`${Math.floor(totalSeconds / 60).toString().padStart(2, "0")}:${(totalSeconds % 60).toString().padStart(2, "0")}`);
        if (remaining <= 0) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    stopLocalRound() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.endsAt = null;
        this.roundEnded = false;
        this.location = null;
        this.time = "00:00";
        this.updateSubs();
    }

    joinRoom() {
        sendMessage({
            meta: "join",
            roomCode: this.roomCode,
            playerId: this.playerId,
            playerName: this.playerName
        })
        route("/wait")
    }
    createRoom() {
        sendMessage({
            meta: "create",
            playerId: this.playerId,
            playerName: this.playerName,
            minutes: this.minutes
        })
        route("/wait")
    }
    leaveRoom() {
        if (this.roomCode) {
            sendMessage({
                meta: "leave",
                roomCode: this.roomCode,
                playerId: this.playerId
            })
        }
        this.resetGame()
        route("/")
    }
    changeReadyStatus(newStatus) {
        sendMessage({
            meta: "readyUpdate",
            roomCode: this.roomCode,
            playerId: this.playerId,
            ready: newStatus
        })
    }
    kickPlayer(playerName) {
        sendMessage({
            meta: "playerKick",
            roomCode: this.roomCode,
            playerId: this.playerId,
            playerName
        })
    }
    updateMinutes(newValue) {
        if (newValue !== this.minutes) {
                sendMessage({
                meta: "updateMinutes",
                minutes: newValue,
                roomCode: this.roomCode,
                playerId: this.playerId
            })
        }
    }
    allPlayersReady() {
        return this.playerList.every(({ ready }) => ready);
    }
    startGame() {
        sendMessage({ meta: "startGame", roomCode: this.roomCode, playerId: this.playerId });
    }
    stopGame() {
        sendMessage({ meta: "stopGame", roomCode: this.roomCode, playerId: this.playerId });
    }
}

const spyfallGame = new SpyfallGame();

export default spyfallGame;
