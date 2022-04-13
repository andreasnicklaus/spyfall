import {Component} from "react";
import {CardActionArea, CardContent, CardMedia, Grid, Paper, Typography} from "@mui/material";

export class ClickableLocation extends Component{
    constructor(props) {
        super(props);
        this.state = {clicked: false}
    }

    handleClick = () => this.setState({clicked: !this.state.clicked})

    render() {
        return <Grid item xs={12} sm={6} lg={3}>
            <Paper sx={{WebkitFilter: this.state.clicked ? "brightness(40%)": ""}}>
                <CardActionArea onClick={this.handleClick}>
                    <CardMedia component="img" image={this.props.src} alt={this.props.name} height={"160"}
                               sx={{"-webkit-filter": this.state.clicked ? "grayscale(100%)": ""}}/>
                    <CardContent>
                        <Typography variant={"h5"} align={"center"}>
                            {this.props.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Paper>
        </Grid>
    }
}