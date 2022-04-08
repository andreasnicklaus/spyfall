import {Component} from "react";
import {sendMessage} from "../services/websocketService";

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {message: ""}
    }

    sendCustomMessage = () => {
        sendMessage(this.state.message || "No message")
    }

    updateMessage = (e) => {
        this.setState({message: e.target.value})
    }

    render() {
        return <div>
            <h1>Home</h1>
            <input type="text" value={this.state.message} onChange={this.updateMessage}/>
            <p>{this.state.message || "No message"}</p>
            <button onClick={this.sendCustomMessage}>Send</button>
        </div>

    }
}