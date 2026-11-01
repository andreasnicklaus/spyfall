import { Component } from "react";
import game from "../services/spyfallGame";
import {
    Box,
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Slider,
    Stack,
    Switch,
    Tooltip,
    Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        let { minutes, playerList, playerName, roomCode } = game
        this.state = {
            minutes, playerList, playerName, roomCode,
            anchorEl: null,
            menuPlayer: null,
            loading: false
        }
    }

    updateGame = (game) => {
        let { minutes, playerList, playerName, roomCode } = game
        this.setState({ ...this.state, minutes, playerList, playerName, roomCode })
    }

    componentDidMount() {
        game.subscribe("waitingRoom", { next: this.nextCallback, error: this.errorCallback, complete: this.completeCallback })
    }

    componentWillUnmount() {
        game.unsubscribe("waitingRoom")
    }

    nextCallback = newGame => this.updateGame(newGame)
    errorCallback = error => console.error(error)
    completeCallback = () => console.warn("completeCallback")
    leave = () => game.leaveRoom()
    openMenu = (event, playerName) => this.setState({ ...this.state, anchorEl: event.currentTarget, menuPlayer: playerName });
    closeMenu = () => this.setState({ ...this.state, anchorEl: null, menuPlayer: null });
    changeMinutes = (event, newValue) => game.updateMinutes(newValue);
    startGame = () => game.startGame()
    copyCode = () => { navigator.clipboard.writeText(this.state.roomCode) }

    render() {
        const { playerList, minutes, roomCode } = this.state;
        const isEmpty = !playerList || playerList.length === 0;

        return (
            <Box component="main" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Top bar */}
                <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography variant="h3">Waiting room</Typography>
                        <Typography sx={{ color: "var(--color-muted)" }}>Room code: {roomCode}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="Copy to clipboard">
                            <Button variant="outlined" size="small" startIcon={<ContentCopyIcon />}
                                onClick={this.copyCode} sx={{ borderRadius: "var(--radius-stock)" }}>
                                {roomCode}
                            </Button>
                        </Tooltip>
                        <Button color="error" size="small" startIcon={<LogoutIcon />} onClick={this.leave}>
                            Leave
                        </Button>
                    </Stack>
                </Paper>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
                    {/* Players */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>Players</Typography>
                        {isEmpty ? (
                            <Box sx={{ py: 4, textAlign: "center", color: "var(--color-muted)" }}>
                                <Typography>No players yet. Share the room code to invite friends.</Typography>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {playerList.map(({ playerName, gameLeader, ready }) => (
                                    <ListItem key={playerName} divider
                                        secondaryAction={
                                            (game.isGameLeader() && playerName !== game.playerName) ? (
                                                <IconButton edge="end" aria-label={`menu for ${playerName}`}
                                                    onClick={(e) => this.openMenu(e, playerName)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            ) : playerName === game.playerName ? (
                                                <Switch checked={ready}
                                                    onChange={(event) => game.changeReadyStatus(event.target.checked)}
                                                    inputProps={{ 'aria-label': 'ready' }} />
                                            ) : null
                                        }>
                                        <ListItemText
                                            primary={gameLeader ? <b>{playerName} (leader)</b> : playerName}
                                            secondary={
                                                <Chip size="small" label={ready ? "ready" : "not ready"}
                                                    color={ready ? "success" : "default"} sx={{ mt: 0.5 }} />
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        <Menu id="basic-menu" open={this.state.anchorEl !== null}
                            anchorEl={this.state.anchorEl} onClose={this.closeMenu}>
                            <MenuItem onClick={() => { game.kickPlayer(this.state.menuPlayer); this.closeMenu(); }}>
                                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                Kick player
                            </MenuItem>
                        </Menu>
                    </Paper>

                    {/* Settings */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>Game settings</Typography>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h5">Minutes: {minutes}</Typography>
                                <Slider value={minutes} onChange={this.changeMinutes}
                                    min={1} max={8} step={1} marks aria-label="Minutes"
                                    valueLabelDisplay="auto" disabled={!game.isGameLeader()} />
                            </Box>
                            <Stack spacing={1}>
                                <Button onClick={this.startGame} variant="contained" color="success"
                                    disabled={!game.isGameLeader() || !game.allPlayersReady()}
                                    startIcon={<SendIcon />} sx={{ borderRadius: "var(--radius-stock)" }}>
                                    Start game
                                </Button>
                                <Typography variant="caption" sx={{ color: "var(--color-muted)" }}>
                                    All players must be ready. Only the leader can start.
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        );
    }
}