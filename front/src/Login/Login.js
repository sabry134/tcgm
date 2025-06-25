import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Tabs, Tab, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
      <Box sx={styles.navbar}>
        <Button onClick={() => navigate("/")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌟 Home
          </Typography>
        </Button>
        <Button
          onClick={() => navigate("/documentation")}
          sx={styles.navButton}
        >
          <Typography variant="h6" sx={styles.navText}>
            📜 Documentation
          </Typography>
        </Button>
        <Button onClick={() => navigate("/forum")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🖼️ Forum
          </Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌍 Community
          </Typography>
        </Button>
      </Box>
      <Box sx={styles.container}>
        <Box sx={styles.formContainer}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={styles.tabs}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tabIndex === 0 ? (
            <Box sx={styles.formBox}>
              <TextField
                fullWidth
                label="Enter username"
                variant="outlined"
                sx={styles.input}
              />
              <TextField
                fullWidth
                label="Enter Password"
                variant="outlined"
                sx={styles.input}
              />
              <Button
                fullWidth
                variant="contained"
                sx={styles.button}
                onClick={() => navigate("/editor")}
              >
                Login
              </Button>
            </Box>
          ) : (
            <Box sx={styles.formBox}>
              <TextField
                fullWidth
                label="Enter Username"
                variant="outlined"
                sx={styles.input}
              />
              <TextField
                fullWidth
                label="Enter Password"
                variant="outlined"
                sx={styles.input}
              />
              <TextField
                fullWidth
                label="Repeat Password"
                variant="outlined"
                sx={styles.input}
              />
              <Button
                fullWidth
                variant="contained"
                sx={styles.button}
                onClick={() => navigate("/editor")}
              >
                Register
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

export default Login;