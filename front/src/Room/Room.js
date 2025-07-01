import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { callDrawCard, callMoveCard } from "../game_commands";
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
import "./Room.css";
import { DndContext } from "@dnd-kit/core";
import { useChannel } from "../ChannelContext";
import CardZone from "./Componnent/CardZone";

const API_BASE = "http://localhost:4000";

const Room = () => {
  const navigate = useNavigate();
  const { channel, gameState } = useChannel();
  const connectionRef = useRef({ isMounted: false });

  const [selectedCard, setSelectedCard] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [zones, setZones] = useState([]);
  const [tableBackground, setTableBackground] = useState(null);
  const roomId = localStorage.getItem("room_id");

  const cardBackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";

  useEffect(() => {
    if (connectionRef.current.isMounted) return;

    if (!roomId) {
      console.error("No Room found");
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
    connectionRef.current.isMounted = true;
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="roomContainer"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          backgroundImage: tableBackground ? `url(${tableBackground})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <RoomNavigationBar roomId={gameState.id} />

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
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default Room;


// LEGACY CODE (for Zacharie)

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { callSetDeck, callDrawCard, callInsertCard, callMoveCard } from "../game_commands";
// import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";
// import CardInfo from "./Componnent/CardInfo";
// import "./Room.css"
// import { DndContext } from '@dnd-kit/core';
// import { useChannel } from "../ChannelContext";
// import CardZone from "./Componnent/CardZone";

// const Room = () => {
//   const navigate = useNavigate();
//   const { channel, gameState } = useChannel();
//   const connectionRef = React.useRef({
//     isMounted: false,
//   });
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [playerId, setPlayerId] = useState("");
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const cardBackImage =
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png";

//   useEffect(() => {
//     if (connectionRef.current.isMounted)
//       return
//     if (!channel) {
//       console.error("No Channel Found");
//       navigate("/join");
//       return;
//     }

//     // Get playerId from localStorage
//     const storedPlayerId = localStorage.getItem("playerUsername");
//     if (!storedPlayerId) {
//       console.error("No player ID found");
//       navigate("/join");
//       return;
//     }
//     setPlayerId(storedPlayerId);


//     return () => {
//       if (!connectionRef.current.isMounted) {
//         connectionRef.current.isMounted = true
//       }
//     };
//   }, [channel, navigate]);

//   const handlePiocheClick = () => {
//     callDrawCard(channel, playerId, 1);
//   };

//   const handleCardClick = (event, index, location) => {
//     event.preventDefault();
//     setSelectedCard((prev) => (prev && prev[0] === index ? null : [index, location]));
//   };

//   // when making a new drag & drop the id of the droppable need to contain the source
//   const handleDragEnd = (event) => {
//     if (!event.over || !event.active) {
//       return;
//     }
//     const [source, id, opponent] = event.active.id.split("/", 3);
//     const [dest, op] = event.over.id.split("/");
//     const cardDraggedArray = Object.entries(gameState.players[playerId][source][id])[0];
//     console.log("cardDragged array = ", cardDraggedArray)
//     const cardDragged = { [cardDraggedArray[0]]: { ...cardDraggedArray[1] } };
//     callMoveCard(channel, playerId, cardDragged, source, dest);
//   };

//   const checkOpponent = (player) => {
//     if (!playerId) {
//       return false;
//     }
//     return playerId !== player;
//   };

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <div display="flex" height="100vh" position="relative" className="roomContainer">
//         <RoomNavigationBar roomId={gameState.id} />

//         {Object.entries(gameState.players).map(([key, value], index) => {
//           const playerHand = value.hand;
//           const deck = value.deck;
//           const discardPile = value.graveyard;
//           const field = value.field;
//           const caster = value.caster;
//           const opponent = checkOpponent(key);
//           return <div key={index}>
//             {/* Discard Pile */}
//             <CardZone stackZone={true} opponent={opponent} cards={discardPile} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"graveyard"} cssName={'discard'} hidden={false} draggable={!opponent} />
//             {/* PlayArea */}
//             <CardZone opponent={opponent} cards={field} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"field"} cssName={'playArea'} hidden={false} draggable={!opponent} />
//             {/* Deck Pile */}
//             <CardZone stackZone={true} opponent={opponent} cards={deck} cardBackImage={cardBackImage} handleZoneClick={handlePiocheClick} selectedCard={selectedCard} boardLocation={"deck"} cssName={'deck'} hidden={true} draggable={false} />
//             {/* CasterZone */}
//             <CardZone stackZone={true} opponent={opponent} cards={caster} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"caster"} cssName={'casterZone'} hidden={false} draggable={!opponent} />
//             {/* InnateCardsContainer */}
//             {/* <CardZone opponent={opponent} cards={ } handleCardClick={ } selectedCard={ } boardLocation={ } cssName={ } style={ } opponentStyle={ } hoverStyle={ } hidden={ } draggable={ } offsetXHandler={ } offsetYHandler={ } rotationHandler={ } /> */}
//             {/* PlayerHand */}
//             <CardZone opponent={opponent} cards={playerHand} handleCardClick={handleCardClick} selectedCard={selectedCard} boardLocation={"hand"} cssName={'playerHand'} hidden={opponent} draggable={!opponent} offsetXHandler={(card, index, length) => (-((index - ((length - 1) / 2)) * (180 / 3)))} rotationHandler={(card, index, length) => ((index - ((length - 1) / 2)) * 10)} />
//             {/* <GameChat playerId={playerId} /> */}
//           </div>;

//         })}
//       </div>
//     </DndContext>
//   );
// };

// export default Room;