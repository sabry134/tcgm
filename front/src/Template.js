import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Template = () => {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
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
        <Button onClick={() => navigate("/editor")} sx={{ borderRadius: 0 }}>
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
      <Box sx={styles.container}></Box>
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
  formContainer: {
    backgroundColor: "#5d3a00",
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  formBox: {
    mt: 3,
    width: "300px",
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 1,
    marginTop: "5%",
  },
  button: {
    mt: 2,
  },
};

export default Template;
