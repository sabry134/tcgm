import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Socket } from "phoenix";
import LinkIcon from "@mui/icons-material/Link";

const Room = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([
    {
      card_name: "Ace of Spades",
      card_description: "The highest card in the deck.",
      card_image:
        "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
    },
    {
      card_name: "Queen of Hearts",
      card_description: "Represents love and compassion.",
      card_image:
        "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
    },
    {
      card_name: "Joker",
      card_description: "The wild card, unpredictable and fun.",
      card_image:
        "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
    },
  ]);
  const [roomId, setRoomId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  useEffect(() => {
    const room_id = localStorage.getItem("room_id");
    if (!room_id) {
      console.error("No room_id found in localStorage");
      navigate("/join");
      return;
    }
    setRoomId(room_id);

    let playerUsername = localStorage.getItem("playerUsername");
    if (!playerUsername) {
      const counter = parseInt(
        localStorage.getItem("playerCounter") || "1",
        10
      );
      playerUsername = `Player ${counter}`;
      localStorage.setItem("playerUsername", playerUsername);
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Connecting to room", roomId);
    const socket = new Socket("ws://79.137.11.227:4000/socket");
    socket.connect();

    const channel = socket.channel(`room:${roomId}`, {});

    channel
      .join()
      .receive("ok", (resp) => {
        console.log("WebSocket connection established", resp);
      })
      .receive("error", (resp) => {
        console.error("WebSocket connection failed", resp);
      });

    channel.on("game_update", (payload) => {
      console.log("Game update received", payload);
    });

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, [roomId]);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCopyButtonText("Copy");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopyButtonText("Copied");
        setTimeout(() => {
          setCopyButtonText("Copy");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy room id: ", err);
      });
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "room-id-popover" : undefined;

  return (
    <Box display="flex" flexDirection="column" height="100vh" position="relative">
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

      <Box sx={styles.linkIconBox}>
        <Button onClick={handleIconClick} sx={styles.linkIconButton}>
          <LinkIcon sx={{ color: "white" }} />
        </Button>
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              padding: "10px",
              backgroundColor: "#5d3a00",
              color: "white",
              maxWidth: "250px",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Room ID
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "8px" }}>
            This is the room ID. Share it with others to invite them.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={roomId}
              variant="standard"
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                style: { color: "white", fontWeight: 500 },
              }}
              sx={{ width: "auto", marginRight: 1 }}
            />
            <Button variant="text" onClick={handleCopy} sx={{ color: "white" }}>
              {copyButtonText}
            </Button>
          </Box>
        </Popover>
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
                  <Typography gutterBottom variant="h5">
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
    alignItems: "center",
    justifyContent: "space-around",
  },
  navButton: {
    borderRadius: 0,
    marginRight: "10px",
  },
  navText: {
    color: "white",
  },
  linkIconBox: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  linkIconButton: {
    minWidth: "auto",
    padding: 0,
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
