import {
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

import {Home} from "./views/home";
import {WaitingRoom} from "./views/waitingRoom";
import {Instructions} from "./views/instructions";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Link as MaterialLink,
    ThemeProvider,
    createTheme,
    Snackbar, Button, IconButton
} from "@mui/material";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useState, Fragment} from "react";
import {initialize} from "./services/routerService";
import {subscribe, unsubscribe} from "./services/snackBarService";

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
        subscribe('App', {onMessageCallback: setMessage})
        return () => {
            unsubscribe('App')
        }
    }, [navigate])

    function closeSnackBar() {
        setMessage("")
    }

    const action = (
        <Fragment>
            <Button color="secondary" size="small" onClick={closeSnackBar}>
                CLOSE
            </Button>
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
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <FingerprintIcon sx={{m: 1}}/>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Spyfall
                        </Typography>
                        <nav>
                            {/*<MaterialLink component={Link} to="/" color="inherit" sx={{m: 1}}>Home</MaterialLink>*/}
                            {/*<MaterialLink component={Link} to="/wait" color="inherit" sx={{m: 1}}>Waiting*/}
                            {/*    Room</MaterialLink>*/}
                            <MaterialLink component={Link} to="/instructions" color="inherit"
                                          sx={{m: 1}}>Instructions</MaterialLink>
                        </nav>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{m: 1}}>
                <Routes>
                    <Route path="/" exact element={<Home/>}/>
                    <Route path="/instructions" exact element={<Instructions/>}/>
                    <Route path="/wait" exact element={<WaitingRoom/>}/>
                {/*  TODO: Add Game Room  */}
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
