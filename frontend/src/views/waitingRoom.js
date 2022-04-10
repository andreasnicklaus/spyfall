import {Component} from "react";
import game from "../services/spyfallGame";
import {Button, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Paper} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.state = {minutes, playerList, playerName, roomCode, startTime,
            anchorEl: null
        }
    }

    updateGame = (game) => {
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.setState({...this.state, minutes, playerList, playerName, roomCode, startTime})
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

    openMenu = (event) => {
        console.log(event)
        this.setState({...this.state, anchorEl: event.currentTarget})
        console.log(this.state)
    }

    closeMenu = () => {
        console.log("closeMenu called")
        this.setState({...this.state, anchorEl: null})
    }

    render() {
        return <div>
            <Paper>
                <nav aria-label="main mailbox folders">
                    <List>
                        {this.state.playerList.map(({playerName, gameLeader}) =>
                            <ListItem key={playerName}
                                      secondaryAction={
                                          (game.isGameLeader() && playerName !== game.playerName) ?
                                          <IconButton
                                              id="basic-button"
                                              edge="end" aria-label="menu"
                                              onClick={this.openMenu}
                                              aria-controls={this.state.anchorEl !== null ? 'basic-menu' : undefined}
                                              aria-haspopup="true"
                                              aria-expanded={this.state.anchorEl !== null ? 'true' : undefined}>
                                              <MoreVertIcon/>
                                          </IconButton> : null // TODO: add ready switch
                                      }>
                                <ListItemText primary={
                                    gameLeader? <b>{playerName}</b> : playerName
                                }/>
                                <Menu
                                    id="basic-menu"
                                    open={this.state.anchorEl !== null}
                                    anchorEl={this.state.anchorEl}
                                    onClose={this.closeMenu}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={this.closeMenu}>Profile</MenuItem>
                                    <MenuItem onClick={this.closeMenu}>My account</MenuItem>
                                    <MenuItem onClick={this.closeMenu}>Logout</MenuItem>
                                </Menu>
                            </ListItem>
                        )}
                    < /List>
                </nav>
            </Paper>
            <p>Players: {JSON.stringify(this.state.playerList)}</p>
            <p>playerName: {this.state.playerName}</p>
            <p>Minutes: {this.state.minutes}</p>
            <p>Room Code: {this.state.roomCode}</p>

            {/* TODO: Add Game Settings (minutes) */}

            {/* TODO: Add Button to game room. Requires: game.allPlayersReady() */}
            <Button onClick={this.leave}>Leave room</Button>
        </div>
    }
}