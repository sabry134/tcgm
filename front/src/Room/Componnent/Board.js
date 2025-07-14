import { useEffect, useState } from "react";
import CardZone from "./CardZone";
import "../Room.css";
import { Box } from "@mui/material";

const API_BASE = "https://localhost:4000";

const Board = () => {
  const [tableBackground, setTableBackground] = useState(null);
  const [board, setBoard] = useState(null);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchBoardWithZones = async () => {
      const boardId = localStorage.getItem("boardSelected");
      if (!boardId) return;

      try {
        const res = await fetch(`${API_BASE}/api/boards/with_zones/${boardId}`);
        if (!res.ok) throw new Error("Failed to fetch board with zones");

        const data = await res.json();

        const serverBg = data.board.background_image || null;
        const cachedBg = localStorage.getItem("boardBackgroundCache");
        const cachedBgURL = localStorage.getItem("boardBackgroundCacheURL");

        if (cachedBg && cachedBgURL === serverBg) {
          setTableBackground(cachedBg);
          setBoard(data.board);
        } else {
          setTableBackground(serverBg);
          setBoard(data.board);
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

  return (
    <Box
      className="board-container"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundImage: tableBackground ? `url(${tableBackground})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {zones.map((zone) => (
        <CardZone
          key={zone.id}
          boardLocation={zone.name}
          opponent={zone.opponent}
          cards={zone.cards || []}
          cssName="zone"
          style={{
            position: "absolute",
            top: typeof zone.top === "number" ? `${zone.top}px` : zone.top,
            left: typeof zone.left === "number" ? `${zone.left}px` : zone.left,
            width: typeof zone.width === "number" ? `${zone.width}px` : zone.width,
            height: typeof zone.height === "number" ? `${zone.height}px` : zone.height,
            borderRadius: `${zone.borderRadius}px`,
            border: "2px dashed #aaa",
          }}
          opponentStyle={{}} // Customize if needed
          hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          handleZoneClick={() => {}}
          handleCardClick={() => {}}
          selectedCard={null}
          cardBackImage={null}
          hidden={false}
          draggable={true}
          offsetXHandler={null}
          offsetYHandler={null}
          rotationHandler={null}
          stackZone={zone.stack_zone}
        />
      ))}
    </Box>
  );
};

export default Board;
