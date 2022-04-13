import {Component} from "react";
import {CardContent, CardHeader, CardMedia, Paper, Typography} from "@mui/material";

export class NonClickableLocation extends Component {
    render() {
        return <Paper sx={{width: 300, m: 2}}>
            <CardHeader title={"Current Location:"} subheader={"Don't disclose this location!"}/>
            <CardMedia component="img" image={this.props.src} alt={this.props.name} height={200}/>
            <CardContent>
                <Typography variant={"h5"} align={"center"}>
                    {this.props.name}
                </Typography>
            </CardContent>
        </Paper>
    }
}