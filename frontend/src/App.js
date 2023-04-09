import {
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

import { Home } from "./views/home";
import { WaitingRoom } from "./views/waitingRoom";
import { Instructions } from "./views/instructions";
import { GameRoom } from "./views/gameRoom";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Link as MaterialLink,
    Snackbar, IconButton
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, Fragment } from "react";
import route, { initialize } from "./services/routerService";
import { subscribe, unsubscribe } from "./services/snackBarService";

const THEME = createTheme({
    typography: {
        fontFamily: [
            "Nunito",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif"
        ].join(",")
    }
})

function App() {
    let navigate = useNavigate()

    const [message, setMessage] = useState("")

    useEffect(() => {
        initialize(navigate)
        subscribe('App', { onMessageCallback: setMessage })
        return () => {
            unsubscribe('App')
        }
    }, [navigate])

    function closeSnackBar() {
        setMessage("")
    }

    const action = (
        <Fragment>
            {/*<Button color="secondary" size="small" onClick={closeSnackBar}>*/}
            {/*    CLOSE*/}
            {/*</Button>*/}
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackBar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <ThemeProvider theme={THEME}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                            <FingerprintIcon sx={{ m: 1 }} />
                            <Typography variant="h5" component="div" sx={{ '&:hover': { cursor: "pointer" } }} onClick={() => route("/")}>
                                Spyfall
                            </Typography>
                        </Box>
                        <nav>
                            <MaterialLink variant="body1" component={Link} to="/instructions" color="inherit"
                                sx={{ m: 1 }}>Instructions</MaterialLink>
                        </nav>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{ m: 1 }}>
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/instructions" exact element={<Instructions />} />
                    <Route path="/wait" exact element={<WaitingRoom />} />
                    <Route path="/game" exact element={<GameRoom />} />
                </Routes>
            </Box>

            <Snackbar
                open={message !== ""}
                autoHideDuration={5000}
                onClose={closeSnackBar}
                message={message}
                action={action}
            />
        </ThemeProvider>
    );
}

export default App;
