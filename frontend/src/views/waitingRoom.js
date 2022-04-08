import {Component} from "react";

export class WaitingRoom extends Component {
    constructor(props) {
        super(props);
        console.log("props", props)
    }

    render() {
        return <h1>Waiting Room</h1>
    }
}