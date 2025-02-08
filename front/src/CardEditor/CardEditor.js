import React, { useEffect } from "react";
import {
    Button,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TCGMCard } from "../TCGMCard";

const CardEditor = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        document.title = "JCCE";
    }, []);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Brown Banner with Menu */}
            <Box
                sx={{
                    backgroundColor: "#5d3a00",
                    color: "white",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <Button onClick={() => navigate("/")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🌟 Scene
                    </Typography>
                </Button>
                <Button onClick={() => navigate("/templates")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        📜 Templates
                    </Typography>
                </Button>
                <Button onClick={() => navigate("/card-editor")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🖼️ Card Editor
                    </Typography>
                </Button>
                <Button onClick={() => navigate("/community")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🌍 Community
                    </Typography>
                </Button>
            </Box>

            {/* Main Content Area */}
            <Box display="flex" flexGrow={1} bgcolor="#fff">
                <Paper
                    className="sidebar"
                    sx={{
                        width: 250,
                        p: 2,
                        bgcolor: "#5d3a00",
                        color: "white",
                        borderRadius: 0,
                    }}
                >
                </Paper>

                <Box
                    className="main-area"
                    flexGrow={1}
                    bgcolor="#c4c4c4"
                    position="relative"
                >
                    <TCGMCard />
                </Box>

                <Paper
                    className="settings"
                    sx={{
                        width: 250,
                        p: 2,
                        bgcolor: "#5d3a00",
                        color: "white",
                        borderRadius: 0,
                    }}
                >
                </Paper>
            </Box>
        </Box>
    );
};

export default CardEditor