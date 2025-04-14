import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Socket } from "phoenix";
import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import defaultGameState from "./Data/GameState.json"
import PlayerHand from "./Componnent/PlayerHand";
import CardInfo from "./Componnent/CardInfo";
import GameChat from "./Componnent/GameChat";
import DiscardPile from "./Componnent/DiscardPile";
import DeckPile from "./Componnent/DeckPile";
import "./Room.css"


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

  const handleCardClick = (card) => {
    setSelectedCard((prev) => (prev === card ? null : card));
  };

  const cardWidth = 180;

  // const openPopover = Boolean(anchorEl);
  // const popoverId = openPopover ? "room-id-popover" : undefined;
  const playerHand = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].hand) : []
  const deck = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].deck) : []
  const discardPile = playerId && gameState.players[playerId] ? Object.entries(gameState.players[playerId].graveyard) : []
  return (
    <div display="flex" flexDirection="column" height="100vh" position="relative">

      <RoomNavigationBar roomId={gameState.id} />

      <div className={"casterZoneContainer"}>
      </div>

      <div className={"innateCardsContainer"}>
      </div>
      {Object.entries(gameState.players).map(([key, value], index) => {
        return <PlayerHand key={index} playerHand={Object.entries(value.hand)} cardWidth={cardWidth} handleCardClick={handleCardClick} selectedCard={selectedCard} rotatation={0} left={"35vw"} bottom={key === playerId ? 10 : null} top={key === playerId ? null : 10} />
      })}

      <CardInfo selectedCard={selectedCard} playerHand={playerHand} />

      <GameChat playerId={playerId} />
      <div className={"playAreaContainer"}>
      </div>


      <div className={"deckDiscardContainer"}>
        <DeckPile deck={deck} handlePiocheClick={handlePiocheClick} cardBackImage={cardBackImage} />
        <DiscardPile discardPile={discardPile} />
      </div>
    </div >
  );
};

export default Room;