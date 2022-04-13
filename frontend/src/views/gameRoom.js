import {Component} from "react";
import {Box, Paper, Typography, Grid, Button, Stack} from "@mui/material";
import game from "../services/spyfallGame";
import {NonClickableLocation} from "../elements/nonClickableLocation";
import {ClickableLocation} from "../elements/clickableLocation";
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
        game.subscribe("GameRoom", {next: this.updateGame})
    }

    componentWillUnmount() {
        game.unsubscribe()
        game.leaveRoom()
    }

    updateGame = (game) => {
        let {time} = game
        this.setState({...this.state, time})
    }

    updateQuestionIndex = () => {
        let newQuestionIndex = Math.floor(Math.random() * questions.length)
        while (newQuestionIndex === this.state.questionIndex) newQuestionIndex = Math.floor(Math.random() * questions.length)
        this.setState({...this.state, questionIndex: newQuestionIndex})
    }

    startGame = () => game.startGame()
    leave = () => game.leaveRoom()

    render() {
        return <Box sx={{m: 1}} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            {!game.isSpy() && game.location ?
                <NonClickableLocation name={game.location.name} src={game.location.src}/> :
                <NonClickableLocation name={"You are the spy"} src={"/assets/img/spy.jpg"}/>
            }

            <Box display={"block"}>
                <Paper sx={{p: 2, m: 1}} align={"center"}>
                    <Typography variant={"h5"}>{game.time}</Typography>
                </Paper>
                <Stack direction={"row"} spacing={1}>
                    <Button variant={"outlined"} disabled={!game.isGameLeader()} onClick={this.startGame}>
                        Restart the game
                    </Button>
                    <Button color={"error"} onClick={this.leave}>
                        Leave
                    </Button>
                </Stack>
            </Box>

            <Paper sx={{p: 2, m: 1}}>
                <Typography variant={"h5"}>Possible question:</Typography>
                <Typography sx={{flexGrow: 1}}>{questions[this.state.questionIndex]}</Typography>
                <Button onClick={this.updateQuestionIndex}>Next question</Button>
            </Paper>

            <Typography>If you are the spy, you can use the list of locations below to check off possible
                locations.</Typography>
            <Typography>If you are an agent, you can use the list of locations below to adapt your answers.</Typography>

            <Grid container spacing={2} sx={{m: 1}}>
                {require("../services/locations.json").map(({name, src}) => {
                    return <ClickableLocation key={name} name={name} src={src}/>
                })}
            </Grid>
        </Box>
    }
}