import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Socket } from "phoenix";
import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";
import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import defaultGameState from "./Data/GameState.json"
import PlayerHand from "./Componnent/PlayerHand";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


const Room = () => {
  const navigate = useNavigate();


  const testDeck = {
    "Card X": {
      "name": "king",
      "properties": {
        "attack": 15,
        "defense": 10
      }
    },
    "Card Y": {
      "name": "queen",
      "properties": {
        "attack": 12,
        "defense": 8
      }
    },
    "Card Z": {
      "name": "jack",
      "properties": {
        "attack": 10,
        "defense": 5
      }
    },
    "Card A": {
      "name": "jack",
      "properties": {
        "attack": 10,
        "defense": 5
      }
    },
    "Card B": {
      "name": "jack",
      "properties": {
        "attack": 10,
        "defense": 5
      }
    },
    "Card C": {
      "name": "jack",
      "properties": {
        "attack": 10,
        "defense": 5
      }
    },
    "Card D": {
      "name": "jack",
      "properties": {
        "attack": 10,
        "defense": 5
      }
    }
  };


  const [gameState, setGameState] = useState(defaultGameState);
  const [selectedCard, setSelectedCard] = useState(null);

  const [playerId, setPlayerId] = useState("");
  const [channel, setChannel] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const cardBackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";
  const hasEffectRun = React.useRef(false);
  const connectionRef = React.useRef({
    socket: null,
    channel: null
  });

  useEffect(() => {
    // Early return if the effect has already run
    if (hasEffectRun.current) return;

    let username = localStorage.getItem("playerUsername");
    const roomId = localStorage.getItem("room_id");

    if (!roomId) {
      console.error("No room_id found in localStorage");
      navigate("/join");
      return;
    }

    if (!username) {
      const counter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
      username = `Player ${counter}`;
      localStorage.setItem("playerUsername", username);
    }
    setPlayerId(username);

    let socketURL = process.env.REACT_WS_URL;
    if (!socketURL) {
      socketURL = "ws://localhost:4000/socket";
    }

    // Store socket and channel in refs rather than component state
    connectionRef.current.socket = new Socket(socketURL);
    connectionRef.current.socket.connect();

    connectionRef.current.channel = connectionRef.current.socket.channel(`room:${roomId}`, {});
    connectionRef.current.channel
      .join()
      .receive("ok", (resp) => {
        console.log("WebSocket connection established", resp);
      })
      .receive("error", (resp) => {
        console.error("WebSocket connection failed", resp);
      });

    connectionRef.current.channel.on("game_update", (payload) => {
      console.log("Received game update:", payload);
      setGameState(payload.state);
    });

    // Set channel state for component to use
    setChannel(connectionRef.current.channel);
    console.log("About to set deck", connectionRef.current.channel, username, testDeck);
    callSetDeck(connectionRef.current.channel, username, testDeck);

    // Mark that the effect has run
    hasEffectRun.current = true;

    // This cleanup should only run on true component unmount
    // by using window.addEventListener, we ensure this only runs when the page is actually unloaded
    const handleUnload = () => {
      if (connectionRef.current.channel) {
        localStorage.removeItem("playerUsername");
        localStorage.removeItem("room_id");
        connectionRef.current.channel.leave();
        connectionRef.current.socket.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      // This cleanup won't do the socket cleanup on StrictMode remounts
      window.removeEventListener('beforeunload', handleUnload);

      // We can check if this is a true unmount (navigation away) vs a StrictMode remount
      // by not cleaning up connections in the useEffect cleanup 
    };
  }, []);

  // Add a separate useEffect for component unmount that runs on true unmount using a ref
  useEffect(() => {
    return () => {
      // This will only run when the component is truly unmounted (navigating away from page)
      // and not during React StrictMode's development checks
      if (!hasEffectRun.current) return;

      // Check if we're truly unmounting and not just in a development mode remount
      const isDevModeRemount = process.env.NODE_ENV === 'development' && document.hidden === false;

      if (!isDevModeRemount && connectionRef.current.channel) {
        console.log("True component unmount - cleaning up connections");
        localStorage.removeItem("playerUsername");
        localStorage.removeItem("room_id");
        connectionRef.current.channel.leave();
        connectionRef.current.socket.disconnect();
      }
    };
  }, []);

  const handlePiocheClick = () => {
    callDrawCard(channel, playerId, 1)
  };

  const handleDiscardTop = () => {

  };

  const handleCardClick = (index) => {
    setSelectedCard((prev) => (prev === index ? null : index));
  };

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, { sender: playerId, text: chatInput }]);
      setChatInput("");
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const cardWidth = 180;

  // const openPopover = Boolean(anchorEl);
  // const popoverId = openPopover ? "room-id-popover" : undefined;
  const playerHand = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].hand) : []
  const deck = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].deck) : []
  const discardPile = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].graveyard) : []
  return (
    <Box display="flex" flexDirection="column" height="100vh" position="relative">

      <RoomNavigationBar roomId={gameState.id} />

      <Box sx={styles.selectedCardZone}>
        {selectedCard !== null && playerHand && playerHand[selectedCard] && (
          <Box sx={styles.selectedCardDetails}>
            <Typography variant="h6">
              {playerHand[selectedCard][1].name}
            </Typography>
          </Box>
        )}
      </Box >

      <Box sx={styles.casterZoneContainer}>
      </Box>

      <Box sx={styles.innateCardsContainer}>
      </Box>
      {Object.entries(gameState.players).map(([key, value], index) => {
        return <PlayerHand key={index} playerHand={Object.entries(value.hand)} cardWidth={cardWidth} handleCardClick={handleCardClick} selectedCard={selectedCard} rotatation={0} left={"35vw"} bottom={key === playerId ? 10 : null} top={key === playerId ? null : 10} />
      })}


      <Box sx={styles.chatContainer}>
        <Box sx={{ height: "70%", overflowY: "auto", padding: "8px" }}>
          {chatMessages.map((msg, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="caption" color="textSecondary">
                {msg.sender}:
              </Typography>
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #ccc",
            padding: "4px 8px",
            marginTop: "auto",
          }}
        >
          <TextField
            fullWidth
            placeholder="Enter your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKeyDown}
            size="small"
            variant="outlined"
          />
          <IconButton onClick={handleSendMessage} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={styles.playAreaContainer}>
      </Box>


      <Box sx={styles.deckDiscardContainer}>
        <Box sx={styles.deckContainer} onClick={handlePiocheClick}>
          {deck && (deck).length > 0 && (
            <Card sx={{ ...styles.card, width: `${cardWidth}px` }}>
              <CardMedia
                component="img"
                height="140"
                image={cardBackImage}
                alt="Card Back"
              />
            </Card>
          )}
        </Box>
        <Box sx={styles.discardContainer}>
          {discardPile && discardPile.map(([key, card], index) => {
            const offset = index * 2;
            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  top: `${offset}px`,
                  left: `${offset}px`,
                }}
              >
                <Card sx={{ ...styles.card, width: 100 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.card_image}
                    alt="Discarded card"
                  />
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box >
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
  selectedCardZone: {
    position: "absolute",
    top: 70,
    left: 10,
    width: 300,
    padding: "8px",
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  casterZoneContainer: {
    position: "absolute",
    marginTop: "15%",
    left: 10,
    height: 200,
    width: 150,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  innateCardsContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 150,
    height: 200,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  opponentHandContainer: {
    position: "absolute",
    top: 70,
    left: "50%",
    transform: "translateX(-50%)",
    width: 380,
    height: 120,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  opponentHandInner: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  chatContainer: {
    position: "absolute",
    top: 70,
    right: 10,
    width: 300,
    height: 500,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  playAreaContainer: {
    position: "absolute",
    top: 200,
    left: "25%",
    width: "50%",
    height: 400,
    border: "2px dashed #999",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  yourHandContainer: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    width: 800,
    height: 180,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
    overflow: "visible",
  },
  deckDiscardContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 200,
    height: 200,
    border: "1px solid gray",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  deckContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 180,
    height: 140,
    cursor: "pointer",
  },
  discardContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 120,
    height: 120,
  },
  card: {
    maxWidth: 345,
    margin: "auto",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    borderRadius: "10px",
  },
};

export default Room;


//TODO: When gamestate change / is sent by back enven when not triggered we need to update it