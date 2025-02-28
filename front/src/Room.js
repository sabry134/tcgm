import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const cards_json = [
  {
    card_name: "Ace of Spades",
    card_description: "The highest card in the deck.",
    card_image: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
  },
  {
    card_name: "Queen of Hearts",
    card_description: "Represents love and compassion.",
    card_image: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
  },
  {
    card_name: "Joker",
    card_description: "The wild card, unpredictable and fun.",
    card_image: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
  },
];

const Room = () => {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [cards, setCards] = useState(cards_json);
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (savedScenes.length > 0) {
      setScenes(savedScenes);
      setSelectedScene(savedScenes[0]);
    }
  }, []);

  useEffect(() => {
    if (scenes.length > 0) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }
  }, [scenes]);

  useEffect(() => {
    document.title = "JCCE";
  }, []);

  useEffect(() => {
    const room_id = localStorage.getItem("room_id");
    if (!room_id) {
      console.error("No room_id found in localStorage");
      navigate("/join");
      return;
    }

    let playerUsername = localStorage.getItem("playerUsername");
    if (!playerUsername) {
      const counter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
      playerUsername = `Player ${counter}`;
      localStorage.setItem("playerUsername", playerUsername);
    }

    const joinRoomFetch = (username) => {
      return fetch(`http://79.137.11.227:4000/api/rooms/${room_id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id: username }),
      }).then((response) => {
        if (!response.ok) throw new Error("Failed to join room");
        return response.json();
      });
    };

    joinRoomFetch(playerUsername)
      .then((data) => {
        localStorage.setItem("player_id", data.player_id);
      })
      .catch((error) => {
        console.error("Join room failed with username", playerUsername, error);
        const currentCounter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
        const newCounter = currentCounter + 1;
        const newUsername = `Player ${newCounter}`;
        localStorage.setItem("playerCounter", newCounter.toString());
        localStorage.setItem("playerUsername", newUsername);

        joinRoomFetch(newUsername)
          .then((data) => {
            localStorage.setItem("player_id", data.player_id);
          })
          .catch((err) =>
            console.error("Retry join room failed with username", newUsername, err)
          );
      });
  }, [navigate]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/api/hello");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box sx={styles.navbar}>
        <Button onClick={() => navigate("/")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌟 Home
          </Typography>
        </Button>
        <Button onClick={() => navigate("/documentation")} sx={styles.navButton}>
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
        <Typography variant="h4" gutterBottom>
          Cards
        </Typography>
        <Grid container spacing={2}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={styles.card}>
                <CardMedia
                  component="img"
                  height="140"
                  image={card.card_image}
                  alt={card.card_name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.card_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.card_description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
    flexGrow: 1,
    backgroundColor: "#c4c4c4",
    color: "white",
    padding: "20px",
  },
  card: {
    maxWidth: 345,
    margin: "auto",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    borderRadius: "10px",
  },
};

export default Room;
