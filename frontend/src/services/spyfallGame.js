import {sendMessage, subscribe} from "./websocketService";
import {addSnack} from "./snackBarService";
import route from "./routerService";
import locations from "./locations.json"

class SpyfallGame {
    subscribers;
    roomCode;
    playerName;
    playerList;
    minutes;
    timer;
    startTime;
    location;
    constructor() {
        this.subscribers = {};
        this.playerList = [];
        this.minutes = 6;
        this.time = "00:00";
        subscribe("SpyfallGame", {
            onMessageCallback: this.messageHandler,
            onErrorCallback: () => {route("/"); this.resetGame(); addSnack("Unknown websocket error");},
            onCloseCallback: () => {route("/"); this.resetGame(); addSnack("Websocket closed");}
        })
    }

    subscribe(id, callback) {
        this.subscribers.id = callback
    }
    unsubscribe(id) {
        delete this.subscribers[id]
    }
    updateSubs() {
        Object.values(this.subscribers).forEach( ({next}) => {
            next(this);
        })
    }
    setPlayerName(name) {
        this.playerName = name;
        this.updateSubs();
    }
    setMinutes(min) {
        this.minutes = min;
        this.updateSubs();
    }
    setRoomCode(code) {
        this.roomCode = code;
        this.updateSubs()
    }
    setPlayerList(players){
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
        this.updateSubs();
    }
    getGameLeader() {
        return this.playerList.filter((player) => player.gameLeader)[0]?.playerName
    }
    isGameLeader() {
        return this.getGameLeader() === this.playerName
    }
    isSpy() {
        return this.playerList.some(({spy}) => spy)
    }
    messageHandler = (msg) => {
        const {type, roomCode, players, minutes, time, location} = msg

        if (minutes) this.setMinutes(minutes);
        if (players) this.setPlayerList(players);
        if (location) this.setLocation(location);

        if (type === "RoomCreated") {
            this.setRoomCode(roomCode)
        } else if (type === "NoRoomWithRoomCode") {
            addSnack(`Error:  Room code ${roomCode} does not exist`)
            console.warn(`Error:  Room code ${roomCode} does not exist`)
            route("/")
            this.resetGame()
        } else if (type === "kickedFromRoom") {
            route("/");
            this.resetGame();
            addSnack("You have been kicked from the game");
        } else if (type === "gameStart") {
            // this.startTimer();
            route("/game")
        } else if (type === "timeUpdate") {
            this.setTime(time)
        }
    }

    joinRoom() {
        sendMessage({
            meta: "join",
            roomCode: this.roomCode,
            playerName: this.playerName
        })
        route("/wait")
    }
    createRoom() {
        sendMessage({
            meta: "create",
            playerName: this.playerName
        })
        route("/wait")
    }
    leaveRoom() {
        if (this.roomCode) {
            sendMessage({
                meta: "leave",
                roomCode: this.roomCode
            })
        }
        this.resetGame()
        route("/")
    }
    changeReadyStatus(newStatus) {
        sendMessage({
            meta: "readyUpdate",
            roomCode: this.roomCode,
            ready: newStatus
        })
    }
    kickPlayer(playerName) {
        sendMessage({
            meta: "playerKick",
            roomCode: this.roomCode,
            playerName
        })
    }
    updateMinutes(newValue) {
        if (newValue !== this.minutes) {
            sendMessage({
                minutes: newValue,
                roomCode: this.roomCode
            })
        }
    }
    allPlayersReady() {
        return this.playerList.every(({ready}) => ready);
    }
    startGame() {
        this.chooseSpy()
        const location = locations[Math.floor(Math.random() * locations.length)]
        sendMessage({
            meta: "shareLocation",
            roomCode: this.roomCode,
            location: location
        })
        sendMessage({
            type: "gameStart",
            minutes: this.minutes,
            roomCode: this.roomCode,
        })
        this.startTimer()
    }
    startTimer() {
        this.startTime = new Date();
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            const now = new Date()
            const diff = now - this.startTime

            if (diff >= this.minutes * 60000) {
                this.stopTimer()
                addSnack("The game ended! Vote now!")
                return}

            const minutesDiff = Math.ceil(diff / 60000)
            const secondDiff = Math.floor(diff / 1000) % 60

            const timeMinutes = this.minutes - minutesDiff
            const timeSeconds = 59 - secondDiff
            if (this.isGameLeader()) this.sendTime(`${timeMinutes.toString().padStart(2, '0')}:${timeSeconds.toString().padStart(2, '0')}`)
        }, 1000)
    }
    stopTimer() {
        this.sendTime("00:00")
        clearInterval(this.timer)
    }
    sendTime(time) {
        sendMessage({
            type: "timeUpdate",
            time,
            roomCode: this.roomCode
        })
    }
    chooseSpy() {
        sendMessage({
            meta: "chooseSpy",
            roomCode: this.roomCode,
        })
    }
}

export default new SpyfallGame();