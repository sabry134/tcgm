import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import CardInfo from "./Componnent/CardInfo";
import GameChat from "./Componnent/GameChat";
import "./Room.css"
import { DndContext } from '@dnd-kit/core';
import { useChannel } from "../ChannelContext"; // Import the context hook
import CardZone from "./Componnent/CardZone";

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
          const opponent = checkOpponent(key);
          return <div key={index}>
            {/* Discard Pile */}
            <CardZone stackZone={true} opponent={opponent} cards={discardPile} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"graveyard"} cssName={'discard'} hidden={false} draggable={!opponent} />
            {/* PlayArea */}
            <CardZone opponent={opponent} cards={field} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"field"} cssName={'playArea'} hidden={false} draggable={!opponent} />
            {/* Deck Pile */}
            <CardZone stackZone={true} opponent={opponent} cards={deck} cardBackImage={cardBackImage} handleZoneClick={handlePiocheClick} selectedCard={selectedCard} boardLocation={"deck"} cssName={'deck'} hidden={true} draggable={false} />
            {/* CasterZone */}
            <CardZone stackZone={true} opponent={opponent} cards={caster} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"caster"} cssName={'casterZone'} hidden={false} draggable={!opponent} />
            {/* InnateCardsContainer */}
            {/* <CardZone opponent={opponent} cards={ } handleCardClick={ } selectedCard={ } boardLocation={ } cssName={ } style={ } opponentStyle={ } hoverStyle={ } hidden={ } draggable={ } offsetXHandler={ } offsetYHandler={ } rotationHandler={ } /> */}
            {/* PlayerHand */}
            <CardZone opponent={opponent} cards={playerHand} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"hand"} cssName={'playerHand'} hidden={opponent} draggable={!opponent} offsetXHandler={(key, card, index, length) => (-((index - ((length - 1) / 2)) * (180 / 3)))} rotationHandler={(key, card, index, length) => ((index - ((length - 1) / 2)) * 10)} />
            {/* <GameChat playerId={playerId} /> */}
          </div>;
        })}
        {selectedCard && <CardInfo selectedCard={selectedCard[0]} cardList={gameState.players[playerId][selectedCard[1]]} />}
      </div>
    </DndContext>
  );
};

export default Room;