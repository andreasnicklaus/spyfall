import { Component } from "react";
import { Box, Typography } from "@mui/material";

export class Instructions extends Component {
    requirements = [
        { k: "Player count", v: "4-12 players" },
        { k: "Player location", v: "in the same room or on a call" },
        { k: "Time", v: "6-10 minutes: the smaller the group, the shorter" }
    ]

    winOptions = [
        { k: "Spy", v: "Guess the round's location from the agents' questions and answers." },
        { k: "Agents", v: "Figure out who the spy is." }
    ]

    spyPoints = [
        { k: "2 points", v: "No one is successfully indicted." },
        { k: "4 points", v: "A non-spy player is successfully indicted." },
        { k: "4 points", v: "The spy guesses the location." },
    ]

    nonSpyPoints = [
        { k: "1 point", v: "The spy is indicted." },
    ]

    RuledTable = ({ rows, head }) => (
        <Box sx={{ mb: 3 }}>
            {head && (
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", borderBottom: "2px solid var(--color-ink)", pb: 1, mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{head[0]}</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{head[1]}</Typography>
                </Box>
            )}
            {rows.map((row, i) => (
                <Box key={row.k + (row.v || i)} sx={{
                    display: "grid", gridTemplateColumns: "1fr 2fr",
                    py: 1.5, borderBottom: "1px solid var(--color-rule)",
                    "&:last-child": { borderBottom: "none" }
                }}>
                    <Typography sx={{ fontWeight: 500 }}>{row.k}</Typography>
                    <Typography sx={{ color: "var(--color-muted)" }}>{row.v}</Typography>
                </Box>
            ))}
        </Box>
    )

    render() {
        const T = this.RuledTable;
        return (
            <Box component="main" sx={{ maxWidth: 760, mx: "auto" }}>
                <Typography variant="h1" sx={{ mb: 2 }}>Instructions</Typography>

                <Typography sx={{ mb: 2 }}>
                    <b>Welcome, Agent.</b> You are a detective, but someone in your department is an enemy
                    spy. Everyone is invited to a social gathering. Everyone but the spy has gotten
                    the invitation.
                </Typography>
                <Typography sx={{ mb: 4 }}>
                    Your job is to discover which player is the spy and save the integrity of your
                    organisation.
                </Typography>

                <Typography variant="h2" sx={{ mb: 2 }}>What you will need</Typography>
                <T rows={this.requirements} head={["Need", "Value"]} />

                <Typography variant="h2" sx={{ mb: 2 }}>How to win</Typography>
                <T rows={this.winOptions} head={["Role", "Goal"]} />

                <Typography variant="h2" sx={{ mb: 2 }}>How to play</Typography>
                <Box component="ol" sx={{ pl: 3, mb: 4, "& li": { mb: 1.5 } }}>
                    <li><Typography><b>The location.</b> At the start of each round a location is chosen. It is the same for all players except the spy, who gets a blank card.</Typography></li>
                    <li><Typography><b>Questioning.</b> The game leader starts by questioning another player about the location. Example: “Do you think I can bring my partner?”</Typography></li>
                    <li><Typography><b>Answering.</b> The questioned player must answer. Follow-up questions are not allowed. The answer should be specific enough to convince others you know the location, but vague enough that the spy cannot infer it. Then the questioned player asks the next question.</Typography></li>
                    <li><Typography><b>No retaliation.</b> You cannot question the player who just questioned you. Choose someone else.</Typography></li>
                </Box>

                <Typography variant="h2" sx={{ mb: 2 }}>The game ends when</Typography>
                <Box component="ol" sx={{ pl: 3, mb: 4, "& li": { mb: 1.5 } }}>
                    <li><Typography><b>No time left.</b> The spy remains undercover and wins. They may reveal themselves.</Typography></li>
                    <li><Typography><b>Spy guess.</b> The spy reveals their role and guesses the location. Right wins, wrong loses.</Typography></li>
                    <li><Typography><b>Indictment.</b> Players indict unanimously. Indicting a non-spy wins the round for the spy; indicting the spy loses it for them.</Typography></li>
                </Box>
                <Typography sx={{ mb: 4 }}><b>Optional rule:</b> an indicted spy can still win if they have found the location.</Typography>

                <Typography variant="h2" sx={{ mb: 2 }}>Scoring</Typography>
                <Typography variant="h3" sx={{ mb: 1 }}>Spy victory</Typography>
                <T rows={this.spyPoints} />
                <Typography sx={{ mb: 3, color: "var(--color-muted)" }}>…for the spy.</Typography>

                <Typography variant="h3" sx={{ mb: 1 }}>Non-spy victory</Typography>
                <T rows={this.nonSpyPoints} />
                <Typography sx={{ mb: 3, color: "var(--color-muted)" }}>…for each non-spy player.</Typography>

                <Typography variant="h3" sx={{ mb: 1 }}>Total score</Typography>
                <Typography>Play as many rounds as you want. The player with the most points wins the overall game.</Typography>
            </Box>
        );
    }
}