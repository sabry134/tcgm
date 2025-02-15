import { Paper, TextField, Button } from "@mui/material";
import React, { Component } from "react";


export class LeftPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            createGameInput: {
                "name": "",
                "description": ""
            },
        }
    }
    createGame() {
        const apiUrl = this.baseApiUrl + 'games';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                game: {
                    "name": this.state.createGameInput.name,
                    "description": this.state.createGameInput.description
                }
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                };
            })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleCreateGameInput(event, key) {
        const newValue = event.target.value;
        const newGame = {
            "name": key === "name" ? newValue : this.state.createGameInput.name,
            "description": key === "description" ? newValue : this.state.createGameInput.description,
        }

        this.setState({ createGameInput: newGame });
    }

    render() {
        return (
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
                <TextField style={{ backgroundColor: 'white' }}
                    id="game-name"
                    variant="standard"
                    label="game name"
                    value={this.state.createGameInput.name}
                    onChange={(event) => this.handleCreateGameInput(event, "name")} />
                <TextField style={{ backgroundColor: 'white' }}
                    id="game-description"
                    variant="standard"
                    label="game description"
                    value={this.state.createGameInput.description}
                    onChange={(event) => this.handleCreateGameInput(event, "description")} />
                <Button onClick={(event) => this.createGame()} sx={{ color: "white", paddingBottom: 5 }} >
                    Create Game
                </Button>
            </Paper>
        )
    }
}