import { Button, Paper } from "@mui/material";
import React, { Component } from "react";


export class LeftPanel extends Component {

  saveCard(json) {
    const apiUrl = 'http://localhost:4000/api/cards';
    const card = localStorage.getItem("currentEditedCard")


    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
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
          Save
        </Button>
        <Button >
          Load Card
        </Button>
      </Paper>
    )
  }
}