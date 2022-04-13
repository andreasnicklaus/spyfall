import {Component} from "react";
import game from "../services/spyfallGame";
import {
    Button,
    Chip,
    IconButton,
    List,
    ListItem, ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper, Slider, Stack,
    Switch, Tooltip, Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        let {minutes, playerList, playerName, roomCode, startTime} = game
        this.state = {
            minutes, playerList, playerName, roomCode, startTime,
            anchorEl: null
        }
    }

    updateGame = (game) => {
        let {minutes, playerList, playerName, roomCode, time} = game
        this.setState({...this.state, minutes, playerList, playerName, roomCode, time})
    }

    componentDidMount() {
        game.subscribe("waitingRoom", {next: this.nextCallback, error: this.errorCallback, complete: this.completeCallback})
    }

    componentWillUnmount() {
        game.unsubscribe("waitingRoom")
    }

    nextCallback = newGame => this.updateGame(newGame)
    errorCallback = error => console.error(error)
    completeCallback = () => console.warn("completeCallback")
    leave = () => game.leaveRoom()
    openMenu = (event) => this.setState({...this.state, anchorEl: event.currentTarget});
    closeMenu = () => this.setState({...this.state, anchorEl: null});
    changeMinutes = (event, newValue) => game.updateMinutes(newValue);
    startGame = () => game.startGame()

    render() {
        return <div>
            {/* Player list */}
            <Paper sx={{m: 1, p: 1}}>
                <Typography variant="h4" sx={{m: 2}}>Players</Typography>
                <List>
                    {this.state.playerList.map(({playerName, gameLeader, ready}) =>
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
                                          </IconButton> :
                                          playerName === game.playerName ?
                                              <Switch
                                                  checked={ready}
                                                  onChange={(event) => game.changeReadyStatus(event.target.checked)}
                                                  inputProps={{'aria-label': 'controlled'}}
                                              /> : null
                                  }>
                            <ListItemText
                                primary={gameLeader ? <b>{playerName}</b> : playerName}
                                secondary={
                                    <Chip component={"span"} label={ready ? "ready" : "not ready"}
                                          color={ready ? "success" : "default"}/>
                                }
                            />
                            <Menu
                                id="basic-menu"
                                open={this.state.anchorEl !== null}
                                anchorEl={this.state.anchorEl}
                                onClose={this.closeMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => {
                                    game.kickPlayer(playerName);
                                    this.closeMenu();
                                }}>
                                    <ListItemIcon>
                                        <DeleteIcon/>
                                    </ListItemIcon>
                                    <ListItemText>Kick player</ListItemText>
                                </MenuItem>
                            </Menu>
                        </ListItem>
                    )}
                < /List>
            </Paper>

            {/* Game setting */}
            <Paper sx={{m: 1, p: 1}}>
                <Typography variant="h4" sx={{m: 1}}>Game settings</Typography>

                {/* Game minutes */}
                <Stack direction={"row"} spacing={2} sx={{m: 1}}>
                    <Typography variant="h5">Minutes:&nbsp;{this.state.minutes}</Typography>
                    <Slider
                        value={this.state.minutes}
                        onChange={this.changeMinutes}
                        min={1} max={8} step={1} marks
                        aria-label="Minutes" valueLabelDisplay="auto"
                        disabled={!game.isGameLeader()}/>
                </Stack>

                {/* Room code */}
                <Stack direction={"row"} spacing={2} sx={{m: 1}}>
                    <Typography variant={"h5"}>Room Code:</Typography>
                    <Tooltip title={"Copy to clipboard"}>
                        <Button
                            sx={{textTransform: 'none'}}
                            variant={"outlined"}
                            endIcon={<ContentCopyIcon/>}
                            onClick={() => {
                                navigator.clipboard.writeText(this.state.roomCode)
                            }}>
                            {this.state.roomCode}
                        </Button>
                    </Tooltip>
                </Stack>

                {/* Game buttons */}
                <Stack spacing={2} sx={{m: 1}}>
                    <Button
                        onClick={this.startGame}
                        variant={"contained"} color={"success"}
                        disabled={!game.isGameLeader() || !game.allPlayersReady()}
                        endIcon={<SendIcon/>}
                    >
                        Start
                    </Button>
                    <Button
                        onClick={this.leave}
                        color={"error"}
                        endIcon={<LogoutIcon/>}
                    >Leave room</Button>
                </Stack>
            </Paper>
        </div>
    }
}