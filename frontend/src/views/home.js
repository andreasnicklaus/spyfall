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
import {addSnack} from "../services/snackBarService";


export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinDialogOpen: false,
            createDialogOpen: false,
            playerName: "",
            roomCode: "",
            message: ""
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

    openCreateDialog = () => {
        this.setState({...this.state, createDialogOpen: true})
    }

    closeCreateDialog = () => {
        this.setState({...this.state, createDialogOpen: false})
    }

    joinRoom = () => {
        game.setRoomCode(this.state.roomCode)
        game.setPlayerName(this.state.playerName)
        game.joinRoom()
    }

    createRoom = () => {
        game.setPlayerName(this.state.playerName)
        game.setMinutes(5)
        game.createRoom()
    }

    render() {
        return <div>
            <p>{this.state.message}</p>
            <Box height={"80vh"} display={"flex"} flexDirection={"column"} alignItems={"center"}
                 justifyContent={"center"}>
                <Typography sx={{m: 1}} variant={"h1"}>Spyfall</Typography>
                <Button sx={{m: 1}} onClick={this.openCreateDialog} variant={"contained"}>Host a game!</Button>
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

            <Dialog
                open={this.state.createDialogOpen}
                onClose={this.closeCreateDialog}>
                <DialogTitle>Create a room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your name to create a room and play with your friends.
                    </DialogContentText>
                    <TextField autoFocus label={"Name"} type={"text"} fullWidth variant={"standard"}
                               value={this.state.playerName} onChange={this.changePlayerName}/>

                    <p>{this.state.playerName}</p>

                    <DialogActions sx={{m: 1}}>
                        <Button onClick={this.closeCreateDialog}>Cancel</Button>
                        <Button onClick={this.createRoom}>Create</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    }
}