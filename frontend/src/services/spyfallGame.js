import {sendMessage} from "./websocketService";
// import { Observable } from 'rxjs';


class SpyfallGame {
    subscribers = []

    subscribe(callback) {
        this.subscribers.push(callback)
    }
    updateSubs() {
        this.subscribers.forEach( next => {
            console.log("next", next)
            next(this);
        })
    }


    roomCode = null
    playerName = null;
    playerList = [];
    minutes = 6;
    startTime = null;

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

    join(callback) {
        this.subscribe(callback)
        sendMessage({
            meta: "join",
            roomCode: this.roomCode,
            playerName: this.playerName
        })
    }

    leave() {
        // TODO: unsubscribe?
        sendMessage({
            meta: "leave",
            roomCode: this.roomCode
        })
    }

    sendTestMessage() {
        sendMessage({
            roomCode: this.roomCode,
            message: "Test message"
        })
    }
}

let singletonGame = null;

export default function game() {
    if (singletonGame == null) {
        singletonGame = new SpyfallGame();
    }
    return singletonGame;
}