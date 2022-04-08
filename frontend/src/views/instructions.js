import {Component} from "react";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

export class Instructions extends Component {
    requirements = [
        {k: "Player count", v: "4-12 players"},
        {k: "Player location", v: "in the same room or zoom call"},
        {k: "Time", v: "6-10 minutes: the smaller the group, the shorter the time"}
    ]

    winOptions = [
        {k: "Spy", v: "Try to guess the round's location by the agents' questions and answers."},
        {k: "Agents", v: "Figure out who the spy is."}
    ]

    spyPoints = [
        {k: "2 points", v: "No one is successfully indicted."},
        {k: "4 points", v: "A non-spy player is successfully indicted."},
        {k: "4 points", v: "The spy guesses the location."},
    ]

    nonSpyPoints = [
        {k: "1 point", v: "The spy is indicted."},
    ]

    render() {
        return <div>
            <Typography sx={{m:1}} variant={"h2"}>Instructions</Typography>

            <Box sx={{m: 2}}>
                <p><b>Welcome, Agent!</b></p>

                <p>You're a detective, but someone in your department is an enemy
                    spy. Everyone is invited to a social gathering. Everyone but the spy has gotten
                    the invitation.</p>

                <p>Your job is it to discover which player is the spy and save the integrity of
                    you whole organisation.</p>

                <TableContainer sx={{m: 1}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}><b>What you will need</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.requirements.map((row) => (
                                <TableRow
                                    key={row.k}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.k}
                                    </TableCell>
                                    <TableCell align="right">{row.v}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TableContainer sx={{m: 1}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}><b>How to win</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.winOptions.map((row) => (
                                <TableRow
                                    key={row.k}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.k}
                                    </TableCell>
                                    <TableCell align="right">{row.v}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant={"h3"}>How to play</Typography>

                <ul>
                    <li><b>The location:</b> At the start of each round, a location of the gathering is chosen.
                        The location is the same for all players except for the spy. The spy is randomly selected
                        and given a blank "spy" card, so he/she won't know the round's location.
                    </li>
                    <li><b>Questioning:</b> The game leader (organizer or the spy of the previous round) start by
                        questioning another player about the location. Example: "Do you think I can bring my partner?"
                    </li>
                    <li><b>Answering:</b> The questioned player must answer. Follow-up questions are not allowed.
                        The answer should be specific enough to convince the other players that questioned player knows
                        the location, but vague enough so the spy cannot infer the location from the answer.
                        After the answer, the questioned player gets to ask another question.
                    </li>
                    <li><b>No retaliation:</b> It is not allowed to pose a question to a player who just interrogated
                        you! You must choose someone else.
                    </li>
                </ul>

                <Typography variant={"h4"}>The game ends...</Typography>

                <p>There are 3 ways the round can end:</p>

                <ol>
                    <li><b>No time left:</b> When the clock runs out, the spy remains undercover and wins the round.
                        He/She can now reveal himself/herself.
                    </li>
                    <li><b>Spy guess:</b> If at any point during the round the spy is certain to have found out the
                        round's
                        location, the spy can reveal his/her role and guess the location. If the spy is right, he/she
                        won
                        the round, otherwise the round is lost!
                    </li>
                    <li><b>Indictment:</b> The players can indict another player in a unanimous vote. If they cannot
                        come
                        to an agreement (all but one players vote for a suspected spy), the questioning goes on.
                        If they vote out a player, who is not the spy, the spy wins! An indicted spy loses.
                    </li>
                </ol>

                <p><b>Optional rule:</b> An indicted spy can still win if he/she has found out the location.</p>

                <Typography variant={"h4"}>Scoring</Typography>

                <Typography variant={"h5"}><i>Spy victory</i></Typography>
                <TableContainer sx={{m: 1}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Points</b></TableCell>
                                <TableCell><b>Condition</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.spyPoints.map((row) => (
                                <TableRow
                                    key={row.k}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.k}
                                    </TableCell>
                                    <TableCell >{row.v}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <p>... for the spy</p>

                <Typography variant={"h5"}><i>Non-spy victory</i></Typography>
                <TableContainer sx={{m: 1}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Points</b></TableCell>
                                <TableCell><b>Condition</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.nonSpyPoints.map((row) => (
                                <TableRow
                                    key={row.k}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.k}
                                    </TableCell>
                                    <TableCell >{row.v}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <p>... for each non-spy player.</p>

                <Typography variant={"h5"}>Total score</Typography>

                <p>You can play as many rounds as you want. The player with the most points wins the overall game.</p>
            </Box>
        </div>
    }
}