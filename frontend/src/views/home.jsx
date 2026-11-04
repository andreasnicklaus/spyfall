import { Component } from "react";
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
import { Link } from "react-router-dom";
import game from "../services/spyfallGame";
import locations from "../services/locations.json";

export class Home extends Component {
    constructor(props) {
        super(props);
        const saved = game.getSavedProfile();
        this.state = {
            joinDialogOpen: false,
            createDialogOpen: false,
            playerName: saved.playerName,
            roomCode: saved.roomCode,
            message: ""
        }
    }

    changePlayerName = (e) => {
        this.setState({ ...this.state, playerName: e.target.value })
    }

    changeRoomCode = (e) => {
        this.setState({ ...this.state, roomCode: e.target.value })
    }

    openJoinDialog = () => {
        this.setState({ ...this.state, joinDialogOpen: true })
    }

    closeJoinDialog = () => {
        this.setState({ ...this.state, joinDialogOpen: false })
    }

    openCreateDialog = () => {
        this.setState({ ...this.state, createDialogOpen: true })
    }

    closeCreateDialog = () => {
        this.setState({ ...this.state, createDialogOpen: false })
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

    primaryStockSx = {
        background: "var(--grain, none), var(--fibre, none), var(--color-accent)",
        color: "var(--color-accent-ink)",
        borderRadius: "var(--radius-stock)",
        minHeight: 52,
        boxShadow: "inset 0 0 0 1px var(--color-accent-deep), 0 5px 0 0 var(--color-accent-deep)",
        transition: "transform var(--dur-micro) var(--ease-spring), box-shadow var(--dur-micro) var(--ease-snap)",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "inset 0 0 0 1px var(--color-accent-deep), 0 7px 0 0 var(--color-accent-deep)" },
        "&:active": { transform: "translateY(4px)", boxShadow: "inset 0 0 0 1px var(--color-accent-deep), 0 1px 0 0 var(--color-accent-deep)" }
    }

    render() {
        return (
            <Box component="main" sx={{ py: { xs: 3, md: 6 } }}>
                {/* Hero, Stage */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
                    gap: { xs: 4, md: "var(--gap-columns)" },
                    alignItems: "center",
                    mb: { xs: 4, md: "var(--section-gap-s)" }
                }}>
                    <Box>
                        <Typography variant="h1" sx={{ mb: 2 }}>
                            Find the spy.
                        </Typography>
                        <Typography className="lead" sx={{ mb: 3, color: "var(--color-muted)", fontSize: "var(--text-lead)", lineHeight: 1.5 }}>
                            Everyone at the gathering knows the location. One of you does not.
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            <Button
                                onClick={this.openCreateDialog}
                                variant="contained"
                                color="primary"
                                className="btn-press"
                                sx={this.primaryStockSx}
                            >
                                Host a game
                            </Button>
                            <Button
                                onClick={this.openJoinDialog}
                                variant="outlined"
                                color="secondary"
                                className="btn-press"
                                sx={{
                                    borderRadius: "var(--radius-stock)",
                                    border: "2px solid var(--color-ink)",
                                    color: "var(--color-ink)",
                                    "&:hover": { background: "var(--color-paper-2)" }
                                }}
                            >
                                Join a game
                            </Button>
                            {this.state.roomCode && this.state.playerName && (
                                <Button onClick={this.joinRoom} variant="text"
                                    sx={{ color: "var(--color-accent-2)", textDecoration: "underline" }}>
                                    Rejoin last room
                                </Button>
                            )}
                            <Button component={Link} to="/instructions" variant="text"
                                sx={{ color: "var(--color-accent-2)", textDecoration: "underline" }}>
                                Read the rules
                            </Button>
                        </Box>
                    </Box>

                    {/* Signature: the location card, built live */}
                    <Box sx={{
                        background: "var(--color-card)",
                        borderRadius: "var(--radius-card)",
                        boxShadow: "var(--shadow-paper)",
                        overflow: "hidden",
                        position: "relative"
                    }}>
                        <Box className="torn-frame">
                            <Box component="img" className="torn"
                                src={`${process.env.PUBLIC_URL}/assets/img/coffee-shop.jpg`}
                                alt="A coffee shop, one of the game's locations"
                                sx={{ width: "100%", height: { xs: 320, md: 520 }, minHeight: 320, objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>Current location</Typography>
                            <Typography sx={{ color: "var(--color-muted)" }}>
                                Coffee shop. Everyone sees this except the spy.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Rail: how a round runs (ruled list) */}
                <Box sx={{ mb: { xs: 4, md: "var(--space-3xl)" } }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>A round, in three beats</Typography>
                    <Box sx={{ borderTop: "2px solid var(--color-ink)" }}>
                        {[
                            { t: "A location is chosen", d: "Same for everyone except the spy, who gets a blank card." },
                            { t: "Players ask questions", d: "Specific enough to prove you know, vague enough to hide it." },
                            { t: "Someone is indicted", d: "Unanimous vote, or the spy guesses the location." }
                        ].map((s, i) => (
                            <Box key={s.t} sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                gap: 3,
                                py: 3,
                                borderBottom: "1px solid var(--color-rule)",
                                alignItems: "baseline"
                            }}>
                                <Typography component="span" variant="h2" sx={{ color: "var(--color-accent-2)", lineHeight: 1 }}>
                                    {String(i + 1).padStart(2, "0")}
                                </Typography>
                                <Box>
                                    <Typography variant="h3" sx={{ mb: 0.5, fontSize: "var(--text-title)" }}>{s.t}</Typography>
                                    <Typography sx={{ color: "var(--color-muted)", maxWidth: "none" }}>{s.d}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Bento: location gallery + first-visit guidance */}
                <Box sx={{ mb: { xs: 3, md: "var(--section-gap)" } }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>Where you might be</Typography>
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 2
                    }}>
                        {locations.map(({ name, src }) => (
                            <Box key={name} sx={{
                                width: { xs: "calc(50% - 8px)", sm: "calc(33.333% - 11px)", md: "calc(16.666% - 14px)" },
                                maxWidth: { md: 220 },
                                borderRadius: "var(--radius-card)",
                                overflow: "hidden",
                                background: "var(--color-card)",
                                boxShadow: "var(--shadow-card)"
                            }}>
                                <Box component="img"
                                    src={src}
                                    alt={name}
                                    sx={{ width: "100%", height: 120, objectFit: "cover", filter: "saturate(1.06) brightness(1.04)" }} />
                                <Typography sx={{
                                    p: 1, fontSize: "var(--text-xs)", textAlign: "center",
                                    textTransform: "capitalize", color: "var(--color-ink-2)"
                                }}>
                                    {name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography sx={{ mt: 3, color: "var(--color-muted)", maxWidth: "none" }}>
                        Fourteen places in total. See <Link to="/instructions" style={{ color: "var(--color-accent-2)" }}>the rules</Link> for how to win.
                    </Typography>
                </Box>

                {/* Dialogs */}
                <Dialog open={this.state.joinDialogOpen} onClose={this.closeJoinDialog} disableScrollLock>
                    <DialogTitle>Join a room</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your name and the room code to join and play with your friends.
                        </DialogContentText>
                        <TextField autoFocus label="Name" type="text" fullWidth variant="outlined"
                            value={this.state.playerName} onChange={this.changePlayerName} sx={{ mt: 2 }} />
                        <TextField label="Room Code" type="text" fullWidth variant="outlined"
                            value={this.state.roomCode} onChange={this.changeRoomCode} sx={{ mt: 2 }} />
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={this.closeJoinDialog}>Cancel</Button>
                            <Button
                                onClick={this.joinRoom}
                                disabled={this.state.playerName === "" || this.state.roomCode === ""}
                                variant="contained"
                                color="primary"
                                sx={this.primaryStockSx}
                            >Join</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>

                <Dialog open={this.state.createDialogOpen} onClose={this.closeCreateDialog} disableScrollLock>
                    <DialogTitle>Create a room</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your name to create a room and play with your friends.
                        </DialogContentText>
                        <TextField autoFocus label="Name" type="text" fullWidth variant="outlined"
                            value={this.state.playerName} onChange={this.changePlayerName} sx={{ mt: 2 }} />
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={this.closeCreateDialog}>Cancel</Button>
                            <Button
                                onClick={this.createRoom}
                                disabled={this.state.playerName === ""}
                                variant="contained"
                                color="primary"
                                sx={this.primaryStockSx}
                            >Create</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </Box>
        );
    }
}
