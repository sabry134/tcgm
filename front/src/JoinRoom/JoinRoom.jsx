import React, { Component } from "react";
import { Alert, Box, Button, Stack, Tab, Tabs, TextField, Snackbar } from "@mui/material";
import { createRoomRequest, joinRoomRequest } from "../Api/roomRequest";
import { withChannel } from "../Utility/hocChannel";
import { withRouterProps } from "../Utility/hocNavigation";
import { ROUTES } from "../Routes/routes";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { unselectGame } from "../Utility/navigate";
import { Home } from "@mui/icons-material";

class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      selectedScene: "",
      tabIndex: 0,
      cards: [],
      buttons: [],
      roomId: "",
      playerUsername: "",
      snackbarOpen: false,
      snackbarMessage: "",
    };
  }

  componentDidMount() {
    const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (savedScenes.length > 0) {
      this.setState({ scenes: savedScenes, selectedScene: savedScenes[0] });
    }
    document.title = "JCCE";
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedScene, cards, buttons, scenes } = this.state;

    if (selectedScene !== prevState.selectedScene) {
      const savedSceneData =
        JSON.parse(sessionStorage.getItem(selectedScene)) || { cards: [], buttons: [] };
      this.setState({ cards: savedSceneData.cards, buttons: savedSceneData.buttons });
    }

    if (selectedScene && (cards !== prevState.cards || buttons !== prevState.buttons)) {
      sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }));
    }

    if (scenes !== prevState.scenes) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }
  }

  joinRoom = async () => {
    const { weakResetConnection, setGameState } = this.props.channelContext;
    const { roomId, playerUsername } = this.state;

    try {
      weakResetConnection();
      const room_id = localStorage.getItem("room_id") ?? roomId;
      if (!room_id && !roomId.trim()) {
        throw new Error("Room ID is required");
      }

      let username = playerUsername.trim();
      if (!username) {
        const counter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
        username = `Player ${counter}`;
        localStorage.setItem("playerUsername", username);
      }

      const joinRoomFetch = async (username, roomId) => {
        try {
          const response = await joinRoomRequest(roomId, { player_id: username });
          setGameState(response);
          return response;
        } catch (error) {
          throw error;
        }
      };

      try {
        const data = await joinRoomFetch(username, room_id);

        if (!data || !data.room_id) {
          throw new Error("Failed to join room, no room_id returned");
        }
        localStorage.setItem("room_id", room_id);
        localStorage.setItem("player_id", username);
        localStorage.setItem("playerUsername", username);
        this.props.navigate(ROUTES.LOBBY);
      } catch (error) {
        console.error("Error joining room:", error);
        const currentCounter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
        const newCounter = currentCounter + 1;
        const newUsername = `Player ${newCounter}`;
        localStorage.setItem("playerCounter", newCounter.toString());
        localStorage.setItem("playerUsername", newUsername);
        try {
          console.log("Retrying with new username:", newUsername);
          const data = await joinRoomFetch(newUsername, room_id);
          console.log("Joined room successfully with new username:", data);
          localStorage.setItem("player_id", data.player_id);
          localStorage.setItem("room_id", roomId);
          this.props.navigate(ROUTES.LOBBY);
        } catch (err) {
          throw err;
        }
      }
    } catch (error) {
      this.setState({ snackbarMessage: "Room ID not found", snackbarOpen: true });
    }
  };

  createRoom = async () => {
    try {
      const response = await createRoomRequest();
      localStorage.setItem("room_id", response.room_id);
      await this.joinRoom();
    } catch (error) {
      console.error(error);
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { tabIndex, roomId, playerUsername, snackbarOpen, snackbarMessage } = this.state;

    return (
      <BaseLayout
        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => {
                unselectGame(this.props.navigate);
              }}
              svgComponent={Home}
              altText="Return to home"
            />
            <TopBarTextButton
              title={"Create/Join Room"}
              altText={"Create or join a game room"}
              event={() => this.props.navigate(ROUTES.JOIN)}
            />
            <TopBarTextButton
              title={"Select Deck"}
              altText={"Select a deck to play with"}
              event={() => this.props.navigate(ROUTES.SELECT_DECK)}
            />
          </TopBarButtonGroup>
        }

        centerPanel={
          <>
            <Box sx={styles.contentBox}>
              <Tabs
                value={tabIndex}
                onChange={(_, newIndex) => this.setState({ tabIndex: newIndex })}
                textColor="inherit"
                indicatorColor="secondary"
              >
                <Tab label="Join Room"/>
                <Tab label="Create Room"/>
              </Tabs>
              {tabIndex === 0 ? (
                <Box sx={styles.formBox}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Enter Room ID"
                      variant="outlined"
                      sx={styles.textField}
                      value={roomId}
                      onChange={(e) => this.setState({ roomId: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Enter player username (optional)"
                      variant="outlined"
                      sx={styles.textField}
                      value={playerUsername}
                      onChange={(e) => this.setState({ playerUsername: e.target.value })}
                    />
                  </Stack>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={styles.button}
                    onClick={this.joinRoom}
                  >
                    Join Room
                  </Button>
                </Box>
              ) : (
                <Box sx={styles.formBox}>
                  <TextField
                    fullWidth
                    label="Room Name"
                    variant="outlined"
                    sx={styles.textField}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={styles.button}
                    onClick={this.createRoom}
                  >
                    Create Room
                  </Button>
                </Box>
              )}
            </Box>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleSnackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={this.handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </>
        }
      />
    );
  }
}

const styles = {
  navbar: {
    backgroundColor: "#5d3a00",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-around",
  },
  navButton: {
    borderRadius: 0,
  },
  navText: {
    color: "white",
  },
  container: {
    height: "100vh",
    backgroundColor: "#c4c4c4",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentBox: {
    backgroundColor: "#5d3a00",
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: "center",
  },
  formBox: {
    mt: 3,
    width: "300px",
    textAlign: "center",
  },
  textField: {
    backgroundColor: "white",
    borderRadius: 1,
  },
  button: {
    mt: 2,
  },
};

export default withChannel(withRouterProps(JoinRoom));