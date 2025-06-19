import React, { Component, createRef } from "react";
import { Typography } from "@mui/material";
import { GameListPicker } from "./GameListPicker/GameListPicker";
import { Popup } from "../Components/Popup/Popup";
import { createGameRequest } from "../Api/gamesRequest";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { BaseLayout } from "../Components/Layouts/BaseLayout";

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
    };
    this.spanRef = createRef();
  }

  openPopup = () => {
    this.setState((prevState) => ({
      anchor: prevState.anchor ? null : this.spanRef.current,
    }));
  };

  closePopup = () => {
    this.setState({ anchor: null });
  };

  onClickCreate = (data) => {
    createGameRequest({
      game: { name: data[0], description: data[1] },
    })
      .then((response) => {
        console.log("Game created successfully", response);
      })
      .catch((error) => {
        console.log("Error creating game", error);
      });
  };

  render() {
    const open = Boolean(this.state.anchor);
    const id = open ? "simple-popper" : undefined;

    return (
      <BaseLayout
        spanRef={this.spanRef}

        topBar={
          <Typography variant='h5' sx={{ color: 'primary.contrastText' }}>
            Game List
          </Typography>
        }

        leftPanel={
          <TCGMButton onClick={this.openPopup}>
            Create Game
          </TCGMButton>
        }

        centerPanel={
          <>
            <Popup
              id={id}
              open={open}
              anchorEl={this.state.anchor}
              closeCallback={this.closePopup}
              receivedCallback={(data) => this.onClickCreate(data)}
              title={"Create Game"}
              inputName={["Name", "Description"]}
            />

            <GameListPicker/>
          </>
        }
      />
    );
  }
}

export default GameList;