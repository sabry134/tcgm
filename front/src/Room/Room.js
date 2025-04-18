import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import PlayerHand from "./Componnent/PlayerHand";
import CardInfo from "./Componnent/CardInfo";
import GameChat from "./Componnent/GameChat";
import DiscardPile from "./Componnent/DiscardPile";
import DeckPile from "./Componnent/DeckPile";
import "./Room.css"
import { DndContext } from '@dnd-kit/core';
import PlayArea from "./Componnent/PlayArea";
import InnateCardsContainer from "./Componnent/InnateCardContainer";
import CasterZone from "./Componnent/CasterZone";
import { useChannel } from "../ChannelContext"; // Import the context hook

const Room = () => {
  const navigate = useNavigate();
  const { channel, gameState, setGameState } = useChannel(); // Get channel from context
  const connectionRef = React.useRef({
    isMounted: false,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [playerId, setPlayerId] = useState("");

  const cardBackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";

  useEffect(() => {
    if (connectionRef.current.isMounted)
      return
    if (!channel) {
      console.error("No Channel Found");
      navigate("/join");
      return;
    }

    // Get playerId from localStorage
    const storedPlayerId = localStorage.getItem("playerUsername");
    if (!storedPlayerId) {
      console.error("No player ID found");
      navigate("/join");
      return;
    }
    setPlayerId(storedPlayerId);

    // Listen for game updates
    channel.on("game_update", (payload) => {
      console.log("Received game update:", payload);
      setGameState(payload.state);
    });

    return () => {
      if (!connectionRef.current.isMounted) {
        connectionRef.current.isMounted = true
      }
    };
  }, [channel, navigate]);

  const handlePiocheClick = () => {
    callDrawCard(channel, playerId, 1);
  };

  const handleCardClick = (event, card, location) => {
    event.preventDefault();
    setSelectedCard((prev) => (prev && prev[0] === card ? null : [card, location]));
  };

  // when making a new drag & drop the id of the droppable need to contain the source
  const handleDragEnd = (event) => {
    if (!event.over || !event.active) {
      return;
    }
    const [source, id, opponent] = event.active.id.split("/", 3);
    const [dest, op] = event.over.id.split("/");
    const cardDraggedArray = Object.entries(gameState.players[playerId][source])[id];
    const cardDragged = { [cardDraggedArray[0]]: { ...cardDraggedArray[1] } };
    callMoveCard(channel, playerId, cardDragged, source, dest);
  };

  const checkOpponent = (player) => {
    if (!playerId) {
      return false;
    }
    return playerId !== player;
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div display="flex" height="100vh" position="relative" className="roomContainer">
        <RoomNavigationBar roomId={gameState.id} />

        {Object.entries(gameState.players).map(([key, value], index) => {
          const playerHand = Object.entries(value.hand);
          const deck = Object.entries(value.deck);
          const discardPile = Object.entries(value.graveyard);
          const field = Object.entries(value.field);
          const caster = Object.entries(value.caster);

          return <div key={index}>
            <DiscardPile key={"discard" + index.toString()} discardPile={discardPile} handleCardClick={handleCardClick} selectedCard={selectedCard} opponent={checkOpponent(key)} />
            <PlayArea key={"playArea" + index.toString()} cards={field} handleCardClick={handleCardClick} selectedCard={selectedCard} opponent={checkOpponent(key)} />
            <DeckPile key={"deckPile" + index.toString()} deck={deck} handlePiocheClick={handlePiocheClick} cardBackImage={cardBackImage} opponent={checkOpponent(key)} />
            <CasterZone key={"casterZone" + index.toString()} cards={caster} handleCardClick={handleCardClick} selectedCard={selectedCard} opponent={checkOpponent(key)} />
            <InnateCardsContainer key={"innateCard" + index.toString()} opponent={checkOpponent(key)} />

            <PlayerHand opponent={checkOpponent(key)} key={"playerHand" + index.toString()} playerHand={playerHand} handleCardClick={handleCardClick} selectedCard={selectedCard} hidden={key !== playerId} cardBackside={cardBackImage} />
            {/* <GameChat playerId={playerId} /> */}
          </div>;
        })}
        {selectedCard && <CardInfo selectedCard={selectedCard[0]} cardList={gameState.players[playerId][selectedCard[1]]} />}
      </div>
    </DndContext>
  );
};

export default Room;