import {Box, Button, Typography} from "@mui/material";
import React, {Component} from "react";

export class NavigationBar extends Component {
    render() {
        return (
            <Box
                sx={{
                    backgroundColor: "#5d3a00",
                    color: "white",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <Button onClick={() => this.props.navigate("/")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🌟 Scene
                    </Typography>
                </Button>
                <Button onClick={() => this.props.navigate("/templates")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        📜 Templates
                    </Typography>
                </Button>
                <Button onClick={() => this.props.navigate("/card-editor")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🖼️ Card Editor
                    </Typography>
                </Button>
                <Button onClick={() => this.props.navigate("/community")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🌍 Community
                    </Typography>
                </Button>
            </Box>
        )
    }
}