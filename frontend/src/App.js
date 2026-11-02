import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation
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
    Snackbar, IconButton, Container, Alert,
    useScrollTrigger, Slide
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, Fragment } from "react";
import route, { initialize } from "./services/routerService";
import { Seo } from "./components/Seo";
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
    const location = useLocation()

    const seoByPath = {
        "/": {
            title: "Spyfall - Online Party Game for Friends",
            description: "Spyfall is a free online party game for 4 to 12 friends. Everyone knows the secret location except the spy.",
            noindex: false
        },
        "/instructions": {
            title: "Instructions | Spyfall",
            description: "How to play Spyfall: rules, scoring, and winning conditions for the online party game.",
            noindex: false
        },
        "/wait": {
            title: "Waiting Room | Spyfall",
            description: "Waiting room for a Spyfall game session.",
            noindex: true
        },
        "/game": {
            title: "Game Room | Spyfall",
            description: "Active Spyfall game session.",
            noindex: true
        }
    };
    const seo = seoByPath[location.pathname] || { title: "Spyfall", noindex: true };

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
                <Seo title={seo.title} description={seo.description} noindex={seo.noindex} />
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
                    autoHideDuration={6000}
                    onClose={closeSnackBar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    sx={{ width: "100%", maxWidth: "100%", left: 0, right: 0, bottom: 0 }}
                >
                    <Alert
                        severity={message.toLowerCase().includes("closed") || message.toLowerCase().includes("error") || message.toLowerCase().includes("kicked") || message.toLowerCase().includes("does not exist") ? "error" : message.toLowerCase().includes("ended") ? "success" : "info"}
                        variant="filled"
                        onClose={closeSnackBar}
                        sx={{ width: "100%", borderRadius: 0 }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default App;