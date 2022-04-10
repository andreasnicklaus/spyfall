import {sendMessage, subscribe} from "./websocketService";
import {addSnack} from "./snackBarService";
import route from "./routerService";

class SpyfallGame {
    subscribers;
    roomCode;
    playerName;
    playerList;
    minutes;
    startTime; // TODO: Do I still need this
    constructor() {
        this.subscribers = [];
        this.playerList = [];
        this.minutes = 6;
        subscribe("SpyfallGame", {
            onMessageCallback: this.messageHandler,
            onErrorCallback: () => {this.resetGame(); addSnack("Unknown websocket error"); route("/Home")},
            onCloseCallback: () => {this.resetGame(); addSnack("Websocket closed"); route("/Home")}
        })
    }

    subscribe(callback) {
        this.subscribers.push(callback)
    }
    updateSubs() {
        this.subscribers.forEach( ({next}) => {
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
    resetGame() {
        this.playerList = [];
        this.minutes = 6;
        this.playerName = null;
        this.roomCode = null;
        this.startTime = null;
    }

    getGameLeader() {
        return this.playerList.filter((player) => player.gameLeader)[0].playerName
    }

    isGameLeader() {
        return this.getGameLeader() === this.playerName
    }
    messageHandler = (msg) => {
        const {meta, roomCode, players} = msg
        if (meta === "RoomCreated") {
            this.setRoomCode(roomCode)
        } else if (meta === "NoRoomWithRoomCode") {
            addSnack(`Error:  Room code ${roomCode} does not exist`)
            console.warn(`Error:  Room code ${roomCode} does not exist`)
            route("/")
            this.resetGame()
        }
        if (players) {
            this.setPlayerList(players)
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
        route("/")
    }
}

export default new SpyfallGame();