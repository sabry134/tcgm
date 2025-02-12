import { Button, Paper, TextField } from "@mui/material";
import React, { Component } from "react";


export class LeftPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createTypeInput: {
        "name": "",
        "properties": [""],
        "game_id": 1

      },
      createGameInput: {
        "name": "",
        "description": ""
      }
    };
  }


  createCardType() {
    const apiUrl = 'http://localhost:4000/api/cardTypes';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cardType: {
          "name": this.state.createTypeInput.name,
          "properties": this.state.createTypeInput.properties,
          "game_id": this.state.createTypeInput.game_id
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

  createGame(json) {
    const apiUrl = 'http://localhost:4000/api/games';

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

  saveCard(json) {
    const apiUrl = 'http://localhost:4000/api/cards';
    const card = localStorage.getItem("currentEditedCard")

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: card
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

  login(json) {
    const apiUrl = 'http://localhost:4000/api/users/login';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user": { "username": "zac" }
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

  register(json) {
    const apiUrl = 'http://localhost:4000/api/users';


    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user": { "username": "zac" }
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

  handleCreateTypeInput(event, key) {
    const newValue = event.target.value;
    const newType = {
      "name": key === "name" ? newValue : this.state.createTypeInput.name,
      "game_id": key === "game_id" ? newValue : this.state.createTypeInput.game_id,
      "properties": this.state.createTypeInput.properties
    }
    this.setState({ createTypeInput: newType });
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
        <Button onClick={this.saveCard}>
          Save Card
        </Button>
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
        <Button onClick={this.createGame} >
          Create Game
        </Button>
        <TextField style={{ backgroundColor: 'white' }}
          id="type-name"
          variant="standard"
          label="Type name"
          value={this.state.createTypeInput.name}
          onChange={(event) => this.handleCreateTypeInput(event, "name")} />
        <Button onClick={(event) => this.createCardType()} >
          Create Type
        </Button>
      </Paper>
    )
  }
}