import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createRoomRequest, joinRoomRequest } from "../Api/roomRequest";
import { JoinRoomNavigationBar } from "../Components/NavigationBar/JoinRoomNavigationBar";
import { useChannel } from "../ChannelContext";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { weakResetConnection } = useChannel();
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { setGameState } = useChannel()

  useEffect(() => {
    const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (savedScenes.length > 0) {
      setScenes(savedScenes);
      setSelectedScene(savedScenes[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedScene) {
      const savedSceneData =
        JSON.parse(sessionStorage.getItem(selectedScene)) || { cards: [], buttons: [] };
      setCards(savedSceneData.cards);
      setButtons(savedSceneData.buttons);
    }
  }, [selectedScene]);

  useEffect(() => {
    if (selectedScene) {
      sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }));
    }
  }, [cards, buttons, selectedScene]);

  useEffect(() => {
    if (scenes.length > 0) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }
  }, [scenes]);

  useEffect(() => {
    document.title = "JCCE";
  }, []);

  const joinRoom = async (navigate) => {
    try {
      weakResetConnection()
      const room_id = localStorage.getItem("room_id") ?? roomId
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
          console.log(roomId, username)
          const response = await joinRoomRequest(roomId, { player_id: username });
          setGameState(response)
          console.log("response to join room:", response);
          return response;
        } catch (error) {
          console.error("Error joining room:", error);
          throw error;
        }
      };

      try {

        const data = await joinRoomFetch(username, room_id);
        localStorage.setItem("room_id", room_id);
        localStorage.setItem("player_id", username);
        localStorage.setItem("playerUsername", username);
        navigate("/lobby");
      } catch (error) {
        console.error("Join room failed with username", username, error);
        const currentCounter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
        const newCounter = currentCounter + 1;
        const newUsername = `Player ${newCounter}`;
        localStorage.setItem("playerCounter", newCounter.toString());
        localStorage.setItem("playerUsername", newUsername);
        try {
          const data = await joinRoomFetch(newUsername, room_id);
          localStorage.setItem("player_id", data.player_id);
          localStorage.setItem("room_id", roomId);
          navigate("/lobby");
        } catch (err) {
          console.error("Retry join room failed with username", newUsername, err);
          throw err;
        }
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Room ID not found");
      setSnackbarOpen(true);
    }
  };


  const createRoom = async (navigate) => {
    try {
      const response = await createRoomRequest();
      console.log("response to create room:", response);
      localStorage.setItem("room_id", response.room_id);
      joinRoom(navigate)
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">

      <JoinRoomNavigationBar />

      <Box sx={styles.container}>
        <Box sx={styles.contentBox}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Join Room" />
            <Tab label="Create Room" />
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
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Enter player username (optional)"
                  variant="outlined"
                  sx={styles.textField}
                  value={playerUsername}
                  onChange={(e) => setPlayerUsername(e.target.value)}
                />
              </Stack>
              <Button
                fullWidth
                variant="contained"
                sx={styles.button}
                onClick={() => joinRoom(navigate)}
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
                onClick={() => createRoom(navigate)}
              >
                Create Room
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

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

export default JoinRoom;
