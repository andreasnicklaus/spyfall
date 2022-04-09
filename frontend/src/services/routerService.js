import {addSnack} from "./snackBarService";

let navigate = null

export default function route(path) {
    if (navigate) navigate(path)
    else {
        addSnack("Tried routing without initialized router")
        console.warn("Tried routing without initialized router")
    }
}

export function initialize(nav) {
    navigate = nav
}