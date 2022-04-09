import {Component} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import game from "../services/spyfallGame";


export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinDialogOpen: false,
            playerName: "",
            roomCode: ""
        }
    }

    changePlayerName = (e) => {
        this.setState({...this.state, playerName: e.target.value})
    }

    changeRoomCode = (e) => {
        this.setState({...this.state, roomCode: e.target.value})
    }

    openJoinDialog = () => {
        this.setState({...this.state, joinDialogOpen: true})
    }

    closeJoinDialog = () => {
        this.setState({...this.state, joinDialogOpen: false})
    }

    joinRoom = () => {
        game().setRoomCode(this.state.roomCode)
        game().setPlayerName(this.state.playerName)
        game().playerList = [...game().playerList, this.state.playerName]
        this.props.navigate("/wait")
    }

    render() {
        return <div>
            <Box height={"80vh"} display={"flex"} flexDirection={"column"} alignItems={"center"}
                 justifyContent={"center"}>
                <Typography sx={{m: 1}} variant={"h1"}>Spyfall</Typography>
                <Button sx={{m: 1}} component={Link} to={"/wait"} variant={"contained"}>Host a game!</Button>
                <Button sx={{m: 1}} onClick={this.openJoinDialog} variant={"outlined"}>Join a game!</Button>
                <Button sx={{m: 1}} component={Link} to={"/instructions"} variant={"text"}>Instructions</Button>
            </Box>
            <Dialog
                open={this.state.joinDialogOpen}
                onClose={this.closeJoinDialog}>
                <DialogTitle>Join a room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your name and the room code to join and play with your friends.
                    </DialogContentText>
                    <TextField autoFocus label={"Name"} type={"text"} fullWidth variant={"standard"}
                               value={this.state.playerName} onChange={this.changePlayerName}/>
                    <TextField label={"Room Code"} type={"text"} fullWidth variant={"standard"}
                               value={this.state.roomCode} onChange={this.changeRoomCode}/>

                    <p>{this.state.playerName}:{this.state.roomCode}</p>

                    <DialogActions sx={{m: 1}}>
                        <Button onClick={this.closeJoinDialog}>Cancel</Button>
                        <Button onClick={this.joinRoom}>Join</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    }
}