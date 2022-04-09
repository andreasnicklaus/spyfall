import {Component} from "react";
import game from "../services/spyfallGame";
import {Button} from "@mui/material";

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.state = {minutes, playerList, playerName, roomCode, startTime}
    }

    updateGame = (game) => {
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.setState({minutes, playerList, playerName, roomCode, startTime})
    }

    componentDidMount() {
        game.subscribe({next: this.nextCallback, error: this.errorCallback, complete: this.completeCallback})
    }

    nextCallback = newGame => this.updateGame(newGame)
    errorCallback = error => console.error(error)
    completeCallback = () => console.warn("completeCallback")

    leave = () => game.leaveRoom()

    componentWillUnmount() {
        this.leave()
    }

    render() {
        return <div>
            <p>Players: {this.state.playerList.join(', ')}</p>
            <p>playerName: {this.state.playerName}</p>
            <p>Minutes: {this.state.minutes}</p>
            <p>Room Code: {this.state.roomCode}</p>

            {/* TODO: Add Button to game room */}
            <Button onClick={this.leave}>Leave room</Button>
        </div>
    }
}