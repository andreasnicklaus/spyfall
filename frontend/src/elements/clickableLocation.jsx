import { Component } from "react";
import { Box, CardActionArea, Paper, Typography } from "@mui/material";

export class ClickableLocation extends Component {
    constructor(props) {
        super(props);
        this.state = { clicked: false }
    }

    handleClick = () => this.setState({ clicked: !this.state.clicked })

    render() {
        const { clicked } = this.state;
        return (
            <Paper sx={{
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
                transition: "filter var(--dur-micro) var(--ease-snap), transform var(--dur-micro) var(--ease-snap)",
                filter: clicked ? "brightness(40%) grayscale(100%)" : "none"
            }}>
                <CardActionArea onClick={this.handleClick} aria-pressed={clicked}>
                    <Box component="img" src={this.props.src} alt={this.props.name}
                        sx={{ width: "100%", height: 160, objectFit: "cover", filter: "saturate(1.06) brightness(1.04)" }} />
                    <Box sx={{ p: 1.5, textAlign: "center" }}>
                        <Typography variant="h5">{this.props.name}</Typography>
                    </Box>
                </CardActionArea>
            </Paper>
        );
    }
}