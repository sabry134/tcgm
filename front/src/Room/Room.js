import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { callDrawCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import CardInfo from "./Componnent/CardInfo";
import "./Room.css";
import { DndContext } from '@dnd-kit/core';
import { useChannel } from "../ChannelContext"; // Import the context hook
import CardZone from "./Componnent/CardZone";
import ContextMenu from "./Componnent/ContextMenu"; // Import the context menu component
import CardModal from "./Componnent/CardModal";

const API_BASE = "http://79.137.11.227:4000";

const Room = () => {
  const navigate = useNavigate();
  const { channel, gameState } = useChannel();
  const connectionRef = useRef({ isMounted: false });

  const [selectedCard, setSelectedCard] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [zones, setZones] = useState([]);
  const [tableBackground, setTableBackground] = useState(null);
  const roomId = localStorage.getItem("room_id");

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

  useEffect(() => {
    const fetchBoardWithZones = async () => {
      const boardId = localStorage.getItem("boardSelected");
      if (!boardId) return;

      try {
        const res = await fetch(`${API_BASE}/api/boards/with_zones/${boardId}`);
        if (!res.ok) throw new Error("Failed to fetch board with zones");

        const data = await res.json();
        console.log("Fetched board with zones:", data);

        const serverBg = data.board.background_image || null;
        const cachedBg = localStorage.getItem("boardBackgroundCache");
        const cachedBgURL = localStorage.getItem("boardBackgroundCacheURL");

        if (cachedBg && cachedBgURL === serverBg) {
          setTableBackground(cachedBg);
        } else {
          setTableBackground(serverBg);
          localStorage.setItem("boardBackgroundCacheURL", serverBg || "");
          localStorage.removeItem("boardBackgroundCache");
        }

        setZones(
          (data.zones || []).map((zone) => ({
            ...zone,
            borderRadius: zone.border_radius || 0,
          }))
        );
      } catch (err) {
        console.error("Error loading board with zones:", err);
      }
    };

    fetchBoardWithZones();
  }, []);

  const handleCardClick = (event, index, location) => {
    event.preventDefault();
    setSelectedCard((prev) => (prev && prev[0] === index ? null : [index, location]));
  };

  const handlePiocheClick = () => {
    callDrawCard(channel, playerId, 1);
  };

  const handleDragEnd = (event) => {
    if (!event.over || !event.active) return;

    const [source, id] = event.active.id.split("/", 3);
    const [dest] = event.over.id.split("/");
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
              {/* <CardZone
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
              {/* <CardZone
                opponent={opponent}
                cards={field}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                boardLocation={"field"}
                cssName={"playArea"}
                hidden={false}
                draggable={!opponent}
                handleContextMenu={handleContextMenu}
              /> */}
              {/* Deck Pile */}
              {/* <CardZone
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
              /> */}
              {/* CasterZone */}
              {/* <CardZone
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
              /> */}
              {/* PlayerHand */}
              {/* <CardZone
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
              /> */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  style={{
                    position: "absolute",
                    left: zone.x,
                    top: zone.y,
                    width: zone.width,
                    height: zone.height,
                    borderRadius: zone.borderRadius,
                    backgroundColor: "rgba(0,0,0,0.25)",
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  <CardZone
                    stackZone={true}
                    opponent={false}
                    cards={[]}
                    boardLocation={`zone_${zone.id}`}
                    handleCardClick={handleCardClick}
                    selectedCard={selectedCard}
                    cssName={`zone-${zone.id}`}
                    draggable={true}
                    style={{ pointerEvents: "auto" }}
                    handleContextMenu={handleContextMenu}
                  />
                </div>
              ))}
            </div>
          );
        })}
        <CardModal isOpen={isModalOpen} onClose={closeModal} cards={modalCards} handleContextMenu={handleContextMenu} />

        {/* Context Menu */}
        {contextMenu.visible && (
          <ContextMenu gameState={gameState} x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} onClose={closeContextMenu} cardName={contextMenu.cardName} card={contextMenu.card} zone={contextMenu.zone} channel={channel} playerId={playerId} openModal={openModal} />
        )}
      </div>
      <CardModal isOpen={isModalOpen} onClose={closeModal} cards={modalCards} handleContextMenu={handleContextMenu} />

      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu gameState={gameState} x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} onClose={closeContextMenu} cardName={contextMenu.cardName} card={contextMenu.card} zone={contextMenu.zone} channel={channel} playerId={playerId} openModal={openModal} />
      )}
    </DndContext>
  );
};
export default Room;
