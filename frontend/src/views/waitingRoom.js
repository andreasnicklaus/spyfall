import {Component} from "react";
import game from "../services/spyfallGame";
import {Button} from "@mui/material";

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        let {minutes, playerList, playerName, roomCode, startTime} = game()
        this.state = {minutes, playerList, playerName, roomCode, startTime}
    }

    updateGame = (game) => {
        console.log("updateGame", game)
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.setState({minutes, playerList, playerName, roomCode, startTime})
    }


    join = () => game().join(
        () => {
            this.updateGame(game())
        }
    );

    leave = () => game().leave()

    test = () => game().sendTestMessage()

    render() {
        return <div>
            <p>Players: {this.props.game.playerList.join(', ')}</p>
            <p>Minutes: {game().minutes}</p>
            <p>Room Code: {game().roomCode}</p>

            <Button onClick={this.join}>Join room</Button>
            <Button onClick={this.leave}>Leave room</Button>
            <Button onClick={this.test}>Test message</Button>
        </div>
    }
}