import {
    Routes,
    Route,
    Link
} from "react-router-dom";

import {Home} from "./views/home";
import {WaitingRoom} from "./views/waitingRoom";
import {AppBar, Box, Toolbar, Typography, Link as MaterialLink, ThemeProvider, createTheme} from "@mui/material";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import {Instructions} from "./views/instructions";

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
                            <MaterialLink component={Link} to="/" color="inherit" sx={{m: 1}}>Home</MaterialLink>
                            <MaterialLink component={Link} to="/wait" color="inherit" sx={{m: 1}}>Waiting
                                Room</MaterialLink>
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
                </Routes>
            </Box>
        </ThemeProvider>
    );
}

export default App;
