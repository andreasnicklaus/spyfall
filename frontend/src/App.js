import {
    Routes,
    Route,
    Link
} from "react-router-dom";

import {Home} from "./views/home";
import {WaitingRoom} from "./views/waitingRoom";
import {AppBar, Box, Toolbar, Typography, Link as MaterialLink} from "@mui/material";
import FingerprintIcon from '@mui/icons-material/Fingerprint';

function App() {
    return (
        <div>
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
                            <MaterialLink component={Link} to="/users" color="inherit" sx={{m: 1}}>Users</MaterialLink>
                        </nav>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{m: 1}}>
                <Routes>

                    <Route path="/" exact element={<Home/>}/>
                    <Route path="/users" exact element={<Users/>}/>
                    <Route path="/wait" exact element={<WaitingRoom/>}/>
                </Routes>
            </Box>
        </div>
    );
}

function Users() {
    return <h1>Users</h1>;
}

export default App;
