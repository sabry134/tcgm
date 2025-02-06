import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField
} from "@mui/material";
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

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box
        sx={{
          backgroundColor: "#5d3a00",
          color: "white",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button onClick={() => navigate("/scene")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            🌟 Scene
          </Typography>
        </Button>
        <Button onClick={() => navigate("/templates")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            📜 Templates
          </Typography>
        </Button>
        <Button onClick={() => navigate("/")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            🖼️ Card Editor
          </Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            🌍 Community
          </Typography>
        </Button>
        <Button onClick={() => navigate("/join")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
          🚪 Join Room
          </Typography>
        </Button>
      </Box>
      <Box
      sx={{
        height: "100vh",
        backgroundColor: "#c4c4c4",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#5d3a00",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
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
          <Box sx={{ mt: 3, width: "300px", textAlign: "center" }}>
            <TextField
              fullWidth
              label="Enter room username"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }}>
              Join Room
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3, width: "300px", textAlign: "center" }}>
            <TextField
              fullWidth
              label="Room Name"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }}>
              Create Room
            </Button>
          </Box>
        )}
      </Box>
    </Box>

    </Box>
  );
};

export default JoinRoom;
