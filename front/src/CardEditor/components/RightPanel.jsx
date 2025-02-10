import {Paper} from "@mui/material";
import React, {Component} from "react";

export class RightPanel extends Component {
    render() {
        return (
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
        )
    }
}