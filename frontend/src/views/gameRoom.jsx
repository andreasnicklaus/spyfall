import { Component } from "react";
import { Box, Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemButton, ListItemText, Checkbox } from "@mui/material";
import game from "../services/spyfallGame";
import { NonClickableLocation } from "../elements/nonClickableLocation";
import questions from "../services/questions.json";
import locations from "../services/locations.json";

export class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: game.time,
            questionIndex: 0,
            locationsOpen: false,
            locationSearch: "",
            eliminatedLocations: []
        }
    }

    componentDidMount() {
        game.subscribe("GameRoom", { next: this.updateGame })
    }

    componentWillUnmount() {
        game.unsubscribe("GameRoom")
    }

    updateGame = (game) => {
        let { time } = game
        if (game.endsAt !== this.lastEndsAt) {
            this.lastEndsAt = game.endsAt;
            this.setState({ ...this.state, time, eliminatedLocations: [] });
        } else {
            this.setState({ ...this.state, time })
        }
    }

    updateQuestionIndex = () => {
        let newQuestionIndex = Math.floor(Math.random() * questions.length)
        while (newQuestionIndex === this.state.questionIndex) newQuestionIndex = Math.floor(Math.random() * questions.length)
        this.setState({ ...this.state, questionIndex: newQuestionIndex })
    }

    startGame = () => game.startGame()
    stopGame = () => game.stopGame()
    leave = () => game.leaveRoom()
    toggleLocation = (name) => this.setState({
        ...this.state,
        eliminatedLocations: this.state.eliminatedLocations.includes(name)
            ? this.state.eliminatedLocations.filter((location) => location !== name)
            : [...this.state.eliminatedLocations, name]
    })

    render() {
        return (
            <Box component="main" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                {/* Current location */}
                {!game.isSpy() && game.location ? (
                    <NonClickableLocation name={game.location.name} src={game.location.src} />
                ) : (
                    <NonClickableLocation name="You are the spy" src={`${process.env.PUBLIC_URL}/assets/img/spy.jpg`} />
                )}

                {/* Timer + controls */}
                <Paper sx={{ p: 3, textAlign: "center", minWidth: 240 }}>
                    <Typography variant="h2" sx={{ fontVariantNumeric: "tabular-nums", mb: 2 }}>
                        {this.state.time}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Button variant="outlined" disabled={!game.isGameLeader()} onClick={this.startGame}
                            sx={{ borderRadius: "var(--radius-stock)" }}>
                            Start a new round
                        </Button>
                        {game.isSpy() && (
                            <Button variant="outlined" onClick={() => this.setState({ ...this.state, locationsOpen: true })}
                                sx={{ borderRadius: "var(--radius-stock)" }}>
                                Possible locations
                            </Button>
                        )}
                        <Button color="error" onClick={this.leave} sx={{ borderRadius: "var(--radius-stock)" }}>
                            Leave
                        </Button>
                    </Stack>
                    <Button color="error" variant="contained" disabled={!game.isGameLeader()} onClick={this.stopGame}
                        sx={{ borderRadius: "var(--radius-stock)" }}>
                        Stop game
                    </Button>
                </Paper>

                {/* Question prompt */}
                <Paper sx={{ p: 3, width: "100%", maxWidth: 640 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>Possible question</Typography>
                    <Typography sx={{ mb: 2, color: "var(--color-muted)" }}>
                        {questions[this.state.questionIndex]}
                    </Typography>
                    <Button onClick={this.updateQuestionIndex} sx={{ borderRadius: "var(--radius-stock)" }}>
                        Next question
                    </Button>
                </Paper>

                <Typography sx={{ color: "var(--color-muted)", textAlign: "center", maxWidth: 640 }}>
                    If you are the spy, open Possible locations to check off places as you eliminate them.
                    If you are an agent, use it to adapt your answers.
                </Typography>

                <Dialog open={this.state.locationsOpen} onClose={() => this.setState({ ...this.state, locationsOpen: false })}
                    fullWidth maxWidth="sm" fullScreen={false}>
                    <DialogTitle>Possible locations</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus fullWidth size="small" label="Search locations" value={this.state.locationSearch}
                            onChange={(event) => this.setState({ ...this.state, locationSearch: event.target.value })}
                            sx={{ mb: 1 }} />
                        <List dense sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                            {locations.filter(({ name }) => name.toLowerCase().includes(this.state.locationSearch.toLowerCase())).map(({ name }) => (
                                <ListItem key={name} disablePadding>
                                    <ListItemButton onClick={() => this.toggleLocation(name)} dense>
                                        <Checkbox edge="start" checked={!this.state.eliminatedLocations.includes(name)} tabIndex={-1} disableRipple />
                                        <ListItemText primary={name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                </Dialog>
            </Box>
        );
    }
}
