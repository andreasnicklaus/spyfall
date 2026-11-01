import { Component } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import game from "../services/spyfallGame";
import { NonClickableLocation } from "../elements/nonClickableLocation";
import { ClickableLocation } from "../elements/clickableLocation";
import questions from "../services/questions.json";

export class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: game.time,
            questionIndex: 0
        }
    }

    componentDidMount() {
        game.subscribe("GameRoom", { next: this.updateGame })
    }

    componentWillUnmount() {
        game.unsubscribe()
        game.leaveRoom()
    }

    updateGame = (game) => {
        let { time } = game
        this.setState({ ...this.state, time })
    }

    updateQuestionIndex = () => {
        let newQuestionIndex = Math.floor(Math.random() * questions.length)
        while (newQuestionIndex === this.state.questionIndex) newQuestionIndex = Math.floor(Math.random() * questions.length)
        this.setState({ ...this.state, questionIndex: newQuestionIndex })
    }

    startGame = () => game.startGame()
    leave = () => game.leaveRoom()

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
                            Restart
                        </Button>
                        <Button color="error" onClick={this.leave} sx={{ borderRadius: "var(--radius-stock)" }}>
                            Leave
                        </Button>
                    </Stack>
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
                    If you are the spy, use the list below to check off possible locations.
                    If you are an agent, use it to adapt your answers.
                </Typography>

                {/* Location checklist */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                    gap: 2,
                    width: "100%"
                }}>
                    {require("../services/locations.json").map(({ name, src }) => (
                        <ClickableLocation key={name} name={name} src={src} />
                    ))}
                </Box>
            </Box>
        );
    }
}