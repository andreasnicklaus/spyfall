import {Component} from "react";
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export class Home extends Component {

    render() {
        return <Box height={"80vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Typography sx={{m: 1}} variant={"h1"}>Spyfall</Typography>
            <Button sx={{m: 1}} component={Link} to={"/wait"} variant={"contained"}>Host a game!</Button>
            <Button sx={{m: 1}} variant={"outlined"}>Join a game!</Button>
            <Button sx={{m: 1}} component={Link} to={"/instructions"} variant={"text"}>Instructions</Button>
        </Box>

    }
}