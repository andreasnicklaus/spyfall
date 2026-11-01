import { Component } from "react";
import { Box, Paper, Typography } from "@mui/material";

export class NonClickableLocation extends Component {
    render() {
        return (
            <Paper sx={{ width: { xs: "100%", sm: 320 }, overflow: "hidden", boxShadow: "var(--shadow-paper)" }}>
                <Box sx={{ p: 2, borderBottom: "1px solid var(--color-rule)" }}>
                    <Typography variant="h4">Current location</Typography>
                    <Typography sx={{ color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>
                        Do not disclose this location.
                    </Typography>
                </Box>
                <Box component="img" src={this.props.src} alt={this.props.name}
                    sx={{ width: "100%", height: 200, objectFit: "cover", filter: "saturate(1.06) brightness(1.04)" }} />
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h3">{this.props.name}</Typography>
                </Box>
            </Paper>
        );
    }
}