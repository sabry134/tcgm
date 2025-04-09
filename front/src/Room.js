import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Popover,
  Modal,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Socket } from "phoenix";
import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";

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

  const initialCards = [
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

  const [discardPile, setDiscardPile] = useState([]);
  const [deck, setDeck] = useState(initialCards);
  const [hand, setHand] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [channel, setChannel] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [openSetDeck, setOpenSetDeck] = useState(false);
  const [deckInput, setDeckInput] = useState("");
  const [openDrawCard, setOpenDrawCard] = useState(false);
  const [drawAmount, setDrawAmount] = useState(1);
  const [openInsertCard, setOpenInsertCard] = useState(false);
  const [insertCardInput, setInsertCardInput] = useState("");
  const [insertLocation, setInsertLocation] = useState("");

  const cardBackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";

  useEffect(() => {
    const room_id = localStorage.getItem("room_id");
    if (!room_id) {
      console.error("No room_id found in localStorage");
      navigate("/join");
      return;
    }
    setRoomId(room_id);

    let username = localStorage.getItem("playerUsername");
    if (!username) {
      const counter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
      username = `Player ${counter}`;
      localStorage.setItem("playerUsername", username);
    }
    setPlayerId(username);
  }, [navigate]);

  useEffect(() => {
    if (!roomId) return;
    const socket = new Socket("ws://79.137.11.227:4000/socket");
    socket.connect();

    const chan = socket.channel(`room:${roomId}`, {});
    chan
      .join()
      .receive("ok", (resp) => {
        console.log("WebSocket connection established", resp);
      })
      .receive("error", (resp) => {
        console.error("WebSocket connection failed", resp);
      });

    chan.on("game_update", (payload) => {
      console.log("Game update received", payload);
    });

    setChannel(chan);
    return () => {
      chan.leave();
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

  const handleOpenSetDeck = () => setOpenSetDeck(true);
  const handleCloseSetDeck = () => setOpenSetDeck(false);
  const handleSubmitSetDeck = () => {
    if (channel && playerId) {
      channel.push("set_deck", { player_id: playerId, deck: deckInput });
    }
    setOpenSetDeck(false);
    setDeckInput("");
  };

  const handleCloseDrawCard = () => setOpenDrawCard(false);
  const handleSubmitDrawCard = () => {
    if (channel && playerId) {
      channel
        .push("draw_card", { player_id: playerId, amount: drawAmount })
        .receive("ok", (response) => {
          console.log("Draw card response:", response);
        })
        .receive("error", (error) => {
          console.error("Error drawing card:", error);
        });
    }
    setOpenDrawCard(false);
    setDrawAmount(1);
  };

  const handleOpenInsertCard = () => setOpenInsertCard(true);
  const handleCloseInsertCard = () => setOpenInsertCard(false);
  const handleSubmitInsertCard = () => {
    if (channel && playerId) {
      const cardObj = { [insertCardInput]: insertCardInput };
      channel.push("insert_card", {
        player_id: playerId,
        card: cardObj,
        location: insertLocation,
      });
    }
    setOpenInsertCard(false);
    setInsertCardInput("");
    setInsertLocation("");
  };

  const handlePiocheClick = () => {
    if (deck.length > 0) {
      const drawnCard = deck[0];
      setDeck(deck.slice(1));
      setHand([...hand, drawnCard]);
    }
  };

  const handleDiscardTop = () => {
    if (hand.length > 0) {
      const cardToDiscard = hand[hand.length - 1];
      setHand(hand.slice(0, hand.length - 1));
      setDiscardPile([...discardPile, cardToDiscard]);
    }
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
  const handFanAngle = 10;
  const opponentHandFanAngle = -10;

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "room-id-popover" : undefined;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
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
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
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

      <Box sx={styles.selectedCardZone}>
        {selectedCard !== null && hand[selectedCard] && (
          <Box sx={styles.selectedCardDetails}>
            <Typography variant="h6">
              {hand[selectedCard].card_name}
            </Typography>
            <Typography variant="body1">
              {hand[selectedCard].card_description}
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: 2, display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={handleOpenSetDeck}>
            Set Deck
          </Button>
          <Button variant="contained" onClick={handleOpenInsertCard}>
            Insert Card
          </Button>
          <Button variant="contained" onClick={handleDiscardTop}>
            Discard Top
          </Button>
        </Box>
      </Box>

      <Box sx={styles.casterZoneContainer}>
      </Box>

      <Box sx={styles.innateCardsContainer}>
      </Box>

      <Box sx={styles.opponentHandContainer}>
        <Box sx={styles.opponentHandInner}>
          {[...Array(5)].map((_, index) => {
            const midIndex = (5 - 1) / 2;
            const rotation = (index - midIndex) * opponentHandFanAngle;
            const offsetX = (index - midIndex) * (cardWidth / 3);
            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: `${cardWidth}px`,
                  transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
                  transformOrigin: "top center",
                }}
              >
                <Card sx={styles.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={cardBackImage}
                    alt="Opponent hidden card"
                  />
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

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

      <Box sx={styles.yourHandContainer}>
        {hand.map((card, index) => {
          const midIndex = (hand.length - 1) / 2;
          const rotation = (index - midIndex) * handFanAngle;
          const offsetX = (index - midIndex) * (cardWidth / 3);
          const extraY = selectedCard === index ? -30 : 0;
          return (
            <Box
              key={index}
              onClick={() => handleCardClick(index)}
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                width: `${cardWidth}px`,
                transform: `translateX(${offsetX}px) translateY(${extraY}px) rotate(${rotation}deg)`,
                transformOrigin: "bottom center",
                transition: "transform 0.3s",
                cursor: "pointer",
                zIndex: selectedCard === index ? 10 : 1,
              }}
            >
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
                    {selectedCard === index
                      ? card.card_description
                      : card.card_description.substring(0, 30) + "..."}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Box sx={styles.deckDiscardContainer}>
        <Box sx={styles.deckContainer} onClick={handlePiocheClick}>
          {deck.length > 0 && (
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
          {discardPile.map((card, index) => {
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

      <Modal open={openSetDeck} onClose={handleCloseSetDeck}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Set Deck
          </Typography>
          <TextField
            fullWidth
            label="Deck (JSON or comma separated)"
            value={deckInput}
            onChange={(e) => setDeckInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseSetDeck}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitSetDeck}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openDrawCard} onClose={handleCloseDrawCard}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Draw Card
          </Typography>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={drawAmount}
            onChange={(e) => setDrawAmount(parseInt(e.target.value, 10))}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseDrawCard}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitDrawCard}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openInsertCard} onClose={handleCloseInsertCard}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Insert Card
          </Typography>
          <TextField
            fullWidth
            label="Card Identifier"
            value={insertCardInput}
            onChange={(e) => setInsertCardInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={insertLocation}
            onChange={(e) => setInsertLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseInsertCard}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitInsertCard}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
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
