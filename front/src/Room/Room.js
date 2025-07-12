import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import CardInfo from "./Componnent/CardInfo";
import "./Room.css";
import { DndContext } from '@dnd-kit/core';
import { useChannel } from "../ChannelContext"; // Import the context hook
import CardZone from "./Componnent/CardZone";
import ContextMenu from "./Componnent/ContextMenu"; // Import the context menu component
import CardModal from "./Componnent/CardModal";

const Room = () => {
  const navigate = useNavigate();
  const { channel, gameState } = useChannel(); // Get channel from context
  const connectionRef = React.useRef({
    isMounted: false,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, card: null, cardName: null, zone: null });

  const cardBackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCards, setModalCards] = useState([]);

  const openModal = (cards) => {
    setModalCards(cards);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCards([]);
  };

  useEffect(() => {
    if (connectionRef.current.isMounted)
      return;
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
        connectionRef.current.isMounted = true;
      }
    };
  }, [channel, navigate]);

  const handlePiocheClick = () => {
    callDrawCard(channel, playerId, 1);
  };

  const handleCardClick = (event, index, location) => {
    event.preventDefault();
    setSelectedCard((prev) => (prev && prev[0] === index ? null : [index, location]));
  };

  const handleDragEnd = (event) => {
    if (!event.over || !event.active) {
      return;
    }
    const [source, id, opponent] = event.active.id.split("/", 3);
    const [dest, op] = event.over.id.split("/");
    const cardDraggedArray = Object.entries(gameState.players[playerId][source][id])[0];
    const cardDragged = { [cardDraggedArray[0]]: { ...cardDraggedArray[1] } };
    callMoveCard(channel, playerId, cardDragged, source, dest);
  };

  const checkOpponent = (player) => {
    if (!playerId) {
      return false;
    }
    return playerId !== player;
  };

  // Handle right-click to show context menu
  const handleContextMenu = (event, type, cardName, card, zone) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      type: type,
      cardName: cardName,
      card: card,
      zone: zone,
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, type: null });
  };

  useEffect(() => {
    // Close context menu on global click
    const handleClick = () => closeContextMenu();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        display="flex"
        height="100vh"
        position="relative"
        className="roomContainer"
        onContextMenu={(e) => handleContextMenu(e, "nothing")} // Right-click on empty space
      >
        <RoomNavigationBar roomId={gameState.id} />

        {Object.entries(gameState.players).map(([key, value], index) => {
          const playerHand = value.hand;
          const deck = value.deck;
          const discardPile = value.graveyard;
          const field = value.field;
          const caster = value.caster;
          const opponent = checkOpponent(key);
          return (
            <div
              key={index}
            >
              {/* Discard Pile */}
              <CardZone
                stackZone={true}
                opponent={opponent}
                cards={discardPile}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                boardLocation={"graveyard"}
                cssName={"discard"}
                hidden={false}
                draggable={!opponent}

                handleContextMenu={handleContextMenu} // Right-click on a card
              />
              {/* PlayArea */}
              <CardZone
                opponent={opponent}
                cards={field}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                boardLocation={"field"}
                cssName={"playArea"}
                hidden={false}
                draggable={!opponent}
                handleContextMenu={handleContextMenu}
              />
              {/* Deck Pile */}
              <CardZone
                stackZone={true}
                opponent={opponent}
                cards={deck}
                cardBackImage={cardBackImage}
                handleZoneClick={handlePiocheClick}
                selectedCard={selectedCard}
                boardLocation={"deck"}
                cssName={"deck"}
                hidden={true}
                draggable={false}
                handleContextMenu={handleContextMenu}
              />
              {/* CasterZone */}
              <CardZone
                stackZone={true}
                opponent={opponent}
                cards={caster}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                boardLocation={"caster"}
                cssName={"casterZone"}
                hidden={false}
                draggable={!opponent}
                handleContextMenu={handleContextMenu}
              />
              {/* PlayerHand */}
              <CardZone
                opponent={opponent}
                cards={playerHand}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                boardLocation={"hand"}
                cssName={"playerHand"}
                hidden={opponent}
                draggable={!opponent}
                offsetXHandler={(card, index, length) =>
                  -((index - (length - 1) / 2) * (180 / 3))
                }
                rotationHandler={(card, index, length) =>
                  (index - (length - 1) / 2) * 10
                }
                handleContextMenu={handleContextMenu}
              />
            </div>
          );
        })}
        <CardModal isOpen={isModalOpen} onClose={closeModal} cards={modalCards} handleContextMenu={handleContextMenu} />

        {/* Context Menu */}
        {contextMenu.visible && (
          <ContextMenu gameState={gameState} x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} onClose={closeContextMenu} cardName={contextMenu.cardName} card={contextMenu.card} zone={contextMenu.zone} channel={channel} playerId={playerId} openModal={openModal} />
        )}
      </div>
    </DndContext>
  );
};
export default Room;