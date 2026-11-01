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
    Snackbar, IconButton, Container,
    useScrollTrigger, Slide
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, Fragment } from "react";
import route, { initialize } from "./services/routerService";
import { subscribe, unsubscribe } from "./services/snackBarService";

const THEME = createTheme({
    typography: {
        fontFamily: "var(--font-display, Chillax, ui-rounded, sans-serif)",
        h1: { fontWeight: 600, letterSpacing: "-0.03em", fontSize: "var(--text-display)" },
        h2: { fontWeight: 600, letterSpacing: "-0.03em", fontSize: "var(--text-section)" },
        h3: { fontWeight: 600, letterSpacing: "-0.03em", fontSize: "var(--text-title)" },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 }
    },
    palette: {
        primary: { main: "#e2d95a", dark: "#c9b840", contrastText: "#1a1a2e" },
        secondary: { main: "#4a7fb5", contrastText: "#ffffff" },
        error: { main: "#c0392b" },
        success: { main: "#4a9b6f" }
    },
    shape: { borderRadius: 16 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "var(--radius-stock, 16px)",
                    minHeight: 44
                },
                text: { color: "var(--color-ink)" }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: "var(--radius-card, 24px)", backgroundImage: "none" }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: "var(--radius-card, 24px)",
                    background: "var(--color-card)",
                    backgroundImage: "none"
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "var(--color-ink-2)",
                    "&.Mui-focused": { color: "var(--color-focus)" }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    minHeight: 52,
                    background: "var(--color-card)",
                    borderRadius: "var(--radius-stock, 16px)",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-muted)",
                        borderWidth: 1
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-ink)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-focus)", borderWidth: 1 },
                    "&.Mui-focused .MuiInputLabel-root": { color: "var(--color-focus)" }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: { "& .MuiInputBase-root": { borderRadius: "var(--radius-input, 14px)" } }
            }
        }
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

    const trigger = useScrollTrigger();

    return (
        <ThemeProvider theme={THEME}>
            <Box className="app-shell" sx={{ flexGrow: 1 }}>
                <Slide appear={false} direction="down" in={!trigger}>
                    <AppBar position="sticky" elevation={0} sx={{
                        background: "var(--color-paper)",
                        color: "var(--color-ink)",
                        borderBottom: "1px solid var(--color-rule)",
                        backdropFilter: "none"
                    }}>
                        <Toolbar>
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                <FingerprintIcon sx={{ color: "var(--color-ink)" }} />
                                <Typography variant="h5" component="div"
                                    sx={{ cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}
                                    onClick={() => route("/")}>
                                    Spyfall
                                </Typography>
                            </Box>
                            <nav>
                                <MaterialLink variant="body1" component={Link} to="/instructions" color="inherit"
                                    sx={{ m: 1, fontFamily: "var(--font-body)", textDecoration: "none",
                                        "&:hover": { color: "var(--color-accent-2)" } }}>Instructions</MaterialLink>
                            </nav>
                        </Toolbar>
                    </AppBar>
                </Slide>

                <Container maxWidth={false} sx={{ flex: 1, py: { xs: 2, md: 4 }, maxWidth: "var(--container)", mx: "auto" }}>
                    <Routes>
                        <Route path="/" exact element={<Home />} />
                        <Route path="/instructions" exact element={<Instructions />} />
                        <Route path="/wait" exact element={<WaitingRoom />} />
                        <Route path="/game" exact element={<GameRoom />} />
                    </Routes>
                </Container>

                <Box component="footer" sx={{
                    borderTop: "1px solid var(--color-rule)",
                    py: 4, mt: { xs: 2, md: "var(--section-gap-s)" }, textAlign: "center"
                }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>Spyfall</Typography>
                    <Typography sx={{ color: "var(--color-muted)", mb: 2 }}>
                        A party game for 4 to 12 friends.
                    </Typography>
                    <nav>
                        <MaterialLink component={Link} to="/instructions" color="inherit"
                            sx={{ mx: 1, textDecoration: "none", "&:hover": { color: "var(--color-accent-2)" } }}>
                            Instructions
                        </MaterialLink>
                    </nav>
                </Box>

                <Snackbar
                    open={message !== ""}
                    autoHideDuration={5000}
                    onClose={closeSnackBar}
                    message={message}
                    action={action}
                    sx={{ "& .MuiSnackbarContent-root": { background: "var(--color-card)", color: "var(--color-ink)", borderRadius: "var(--radius-card)" } }}
                />
            </Box>
        </ThemeProvider>
    );
}

export default App;