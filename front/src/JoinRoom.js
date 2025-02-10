import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Tabs, Tab, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (savedScenes.length > 0) {
      setScenes(savedScenes);
      setSelectedScene(savedScenes[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedScene) {
      const savedSceneData = JSON.parse(
        sessionStorage.getItem(selectedScene)
      ) || { cards: [], buttons: [] };
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
      const response = await fetch("http://localhost:4000/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to join room");

      const data = await response.json();
      localStorage.setItem("player_id", data.player_id);
      localStorage.setItem("room_id", data.room_id);

      navigate("/room");
    } catch (error) {
      console.error(error);
    }
  };

  const createRoom = async (navigate) => {
    try {
      const response = await fetch("http://localhost:4000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      localStorage.setItem("player_id", data.player_id);
      localStorage.setItem("room_id", data.room_id);

      navigate("/room");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box sx={styles.navbar}>
        <Button onClick={() => navigate("/scene")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌟 Scene
          </Typography>
        </Button>
        <Button onClick={() => navigate("/templates")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            📜 Templates
          </Typography>
        </Button>
        <Button onClick={() => navigate("/editor")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🖼️ Card Editor
          </Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌍 Community
          </Typography>
        </Button>
        <Button onClick={() => navigate("/join")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🚪 Join Room
          </Typography>
        </Button>
      </Box>
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
              <TextField
                fullWidth
                label="Enter room username"
                variant="outlined"
                sx={styles.textField}
              />
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
