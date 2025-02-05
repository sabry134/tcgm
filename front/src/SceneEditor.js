import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Paper,
  Card,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SceneEditor = () => {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [trueFalseProperty, setTrueFalseProperty] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
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

  const addScene = () => {
    const newScene = `Scene ${scenes.length + 1}`;
    setScenes([...scenes, newScene]);
    setSelectedScene(newScene);
  };

  const deleteScene = () => {
    const updatedScenes = scenes.filter((scene) => scene !== selectedScene);
    setScenes(updatedScenes);
    setSelectedScene(updatedScenes[0] || "");
  };

  const addCard = () => {
    const newCard = { id: Date.now(), x: 100, y: 100, height: 400 };
    setCards([...cards, newCard]);
  };

  const addButton = () => {
    const newButton = {
      id: Date.now(),
      label: `Button ${buttons.length + 1}`,
      x: 100,
      y: 200,
    };
    setButtons([...buttons, newButton]);
  };

  const handleCardMouseDown = (event, id) => {
    const card = cards.find((c) => c.id === id);
    const offsetX = event.clientX - card.x;
    const offsetY = event.clientY - card.y;

    const mainArea = document.querySelector(".main-area");
    const mainAreaRect = mainArea.getBoundingClientRect();

    const handleMouseMove = (moveEvent) => {
      let newX = moveEvent.clientX - offsetX;
      let newY = moveEvent.clientY - offsetY;

      newX = Math.max(0, Math.min(newX, mainAreaRect.width - 150));
      newY = Math.max(0, Math.min(newY, mainAreaRect.height - card.height));

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, x: newX, y: newY } : card
        )
      );
    };

    const handleMouseUp = () => {
      sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }));
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleButtonMouseDown = (event, id) => {
    const button = buttons.find((b) => b.id === id);
    const offsetX = event.clientX - button.x;
    const offsetY = event.clientY - button.y;

    const mainArea = document.querySelector(".main-area");
    const mainAreaRect = mainArea.getBoundingClientRect();

    const handleMouseMove = (moveEvent) => {
      let newX = moveEvent.clientX - offsetX;
      let newY = moveEvent.clientY - offsetY;

      newX = Math.max(0, Math.min(newX, mainAreaRect.width - 150));
      newY = Math.max(0, Math.min(newY, mainAreaRect.height - 50));

      const updatedButtons = buttons.map((button) =>
        button.id === id ? { ...button, x: newX, y: newY } : button
      );

      setButtons(updatedButtons);
      sessionStorage.setItem(
        selectedScene,
        JSON.stringify({ cards, buttons: updatedButtons })
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const deleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const deleteButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };

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
        <Button onClick={() => navigate("/card-editor")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            🖼️ Card Editor
          </Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={{ borderRadius: 0 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            🌍 Community
          </Typography>
        </Button>
      </Box>

      <Box display="flex" flexGrow={1} bgcolor="#fff">
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
          <Typography variant="h6">🔍 Scene Inspector</Typography>
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={addScene}
            sx={{ mt: 1, mb: 2, borderRadius: 0 }}
          >
            Add Scene
          </Button>
          <List>
            {scenes.map((scene) => (
              <ListItem key={scene} disablePadding>
                <ListItemButton
                  selected={scene === selectedScene}
                  onClick={() => setSelectedScene(scene)}
                  sx={{ borderRadius: 0 }}
                >
                  <ListItemText
                    primary={scene}
                    sx={{
                      color: scene === selectedScene ? "yellow" : "white",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box
          className="main-area"
          flexGrow={1}
          bgcolor="#c4c4c4"
          position="relative"
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              sx={{
                width: 150,
                height: card.height,
                position: "absolute",
                left: card.x,
                top: card.y,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "grab",
                p: 2,
                bgcolor: "white",
                borderRadius: 0,
              }}
              onMouseDown={(e) => handleCardMouseDown(e, card.id)}
            >
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteCard(card.id)}
                sx={{ mt: 2, borderRadius: 0 }}
              >
                Delete Card
              </Button>
            </Card>
          ))}

          {buttons.map((button) => (
            <Box
              key={button.id}
              sx={{
                position: "absolute",
                left: button.x,
                top: button.y,
                borderRadius: 0,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  marginBottom: 2,
                  borderRadius: 0,
                }}
                onMouseDown={(e) => handleButtonMouseDown(e, button.id)}
              >
                {button.label}
              </Button>
              <IconButton
                onClick={() => deleteButton(button.id)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  borderRadius: 0,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

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
          <Typography variant="h6">{selectedScene}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={trueFalseProperty}
                onChange={() => setTrueFalseProperty(!trueFalseProperty)}
                color="default"
              />
            }
            label="True false properties"
          />
          <Slider
            value={sliderValue}
            min={0}
            max={100}
            onChange={(e, newValue) => setSliderValue(newValue)}
            sx={{ color: "yellow" }}
          />
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={deleteScene}
            sx={{ mt: 2, borderRadius: 0 }}
          >
            Delete Scene
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={addCard}
            sx={{ mt: 2, borderRadius: 0 }}
          >
            Generate Card
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={addButton}
            sx={{ mt: 2, borderRadius: 0 }}
          >
            Generate Button
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default SceneEditor;
