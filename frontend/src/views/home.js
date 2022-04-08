import {Component} from "react";
import {sendMessage} from "../services/websocketService";
import {Button, Divider, Snackbar, TextField} from "@mui/material";

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {message: "", open: false}
    }

    sendCustomMessage = () => {
        sendMessage(this.state.message || "No message")
    }

    updateMessage = (e) => {
        this.setState({...this.state, message: e.target.value})
    }

    handleSnackBar = () => {
        this.setState({...this.state, open: !this.state.open})
    }

    render() {
        return <div>
            <h1>Home</h1>

            <TextField variant={"standard"} label="Message" value={this.state.message} onChange={this.updateMessage}/>
            <Button variant={this.state.message ? "outlined" : "disabled"}
                    onClick={this.sendCustomMessage}>Send</Button>

            <Divider sx={{m: 2}}/>

            <Button variant="contained" onClick={this.handleSnackBar}>Send Snack</Button>
            <Snackbar
                message={"Hi there"}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleSnackBar}
            />
        </div>

    }
}