import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

const styles = {
  navbar: {
    backgroundColor: "#5d3a00",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-around",
    userSelect: "none",
  },
  navButton: { borderRadius: 0, userSelect: "none" },
  navText: { color: "white", fontSize: "1.25rem", userSelect: "none" },
};

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const MAX_NAME_LENGTH = 30;
const API_BASE = "http://localhost:4000";

const BoardEditor = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [cards, setCards] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [tableBackground, setTableBackground] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const canvasRef = useRef(null);

  const [inputs, setInputs] = useState({
    name: "",
    width: "",
    height: "",
    x: "",
    y: "",
    borderRadius: "",
  });

  const [board, setBoard] = useState({});

  const persist = useRef(
    debounce((sceneKey, data) => {
      sessionStorage.setItem(sceneKey, JSON.stringify(data));
    }, 500)
  );

const syncToApi = useRef(
  debounce(async (boardData, zonesData) => {
    try {
      const method = boardData.id ? "PUT" : "POST";
      const url = boardData.id
        ? `${API_BASE}/api/boards/${boardData.id}/with_zones`
        : `${API_BASE}/api/boards/with_zones`;

      const gameId = localStorage.getItem("room_id");

      const boardWithGameId = {
        ...boardData,
        game_id: gameId,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: boardWithGameId, zones: zonesData }),
      });

      if (!response.ok) throw new Error("Failed to sync board");
      const data = await response.json();
      setBoard(data.board);
      setZones(data.zones);
    } catch (err) {
      console.error("Error syncing board:", err);
    }
  }, 1000)
);


  useEffect(() => {
    if (board) syncToApi.current(board, zones);
  }, [zones, board]);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("scenes")) || [];
    if (s.length) {
      setScenes(s);
      setSelectedScene(s[0]);
    }
  }, []);

  useEffect(() => {
    if (!selectedScene) return;
    const saved = JSON.parse(sessionStorage.getItem(selectedScene)) || {};
    setCards(saved.cards || []);
    setButtons(saved.buttons || []);
    setZones(saved.zones || []);
    setTableBackground(saved.tableBackground || null);
    setBoard(saved.board || {});
  }, [selectedScene]);

  useEffect(() => {
    document.title = "JCCE";
  }, []);

  useEffect(() => {
    if (selectedZone) {
      setInputs({
        name: selectedZone.name,
        width: String(selectedZone.width),
        height: String(selectedZone.height),
        x: String(selectedZone.x),
        y: String(selectedZone.y),
        borderRadius: String(selectedZone.borderRadius),
      });
    } else {
      setInputs({
        name: "",
        width: "",
        height: "",
        x: "",
        y: "",
        borderRadius: "",
      });
    }
  }, [selectedZone]);

  const handleMouseDown = (e, zone) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const resizeThreshold = 15;
    const offsetX = e.clientX - rect.left - zone.x;
    const offsetY = e.clientY - rect.top - zone.y;
    const isResize =
      offsetX > zone.width - resizeThreshold && offsetY > zone.height - resizeThreshold;

    if (isResize) {
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: zone.width,
        height: zone.height,
      };
    } else {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - rect.left - zone.x,
        y: e.clientY - rect.top - zone.y,
      };
    }
    setSelectedZoneId(zone.id);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !selectedZoneId) return;

    if (isDragging) {
      const origin = zones.find((z) => z.id === selectedZoneId);
      if (!origin) return;

      const x = clamp(
        e.clientX - rect.left - dragOffset.current.x,
        0,
        rect.width - origin.width
      );
      const y = clamp(
        e.clientY - rect.top - dragOffset.current.y,
        0,
        rect.height - origin.height
      );

      updateSymmetric(selectedZoneId, { x, y });
    }

    if (isResizing) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      const newWidth = clamp(resizeStart.current.width + dx, 100, rect.width);
      const newHeight = clamp(resizeStart.current.height + dy, 100, rect.height);

      updateSymmetric(selectedZoneId, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedZoneId, isDragging, isResizing, zones]);

  const updateSymmetric = (id, newProps) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setZones((prevZones) => {
      const targetZone = prevZones.find((z) => z.id === id);
      if (!targetZone) return prevZones;

      const pairId = targetZone.pairId;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      return prevZones.map((zone) => {
        if (zone.id === id) {
          return { ...zone, ...newProps };
        }

        if (zone.pairId === pairId && zone.id !== id) {
          const newX =
            newProps.x !== undefined
              ? cw - newProps.x - (newProps.width ?? zone.width)
              : zone.x;

          const newY =
            newProps.y !== undefined
              ? ch - newProps.y - (newProps.height ?? zone.height)
              : zone.y;

          const newWidth = newProps.width !== undefined ? newProps.width : zone.width;
          const newHeight = newProps.height !== undefined ? newProps.height : zone.height;

          const newBorderRadius =
            newProps.borderRadius !== undefined ? newProps.borderRadius : zone.borderRadius;

          const newName = newProps.name !== undefined ? newProps.name : zone.name;

          return {
            ...zone,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            borderRadius: newBorderRadius,
            name: newName,
          };
        }

        return zone;
      });
    });
  };

  const handleInputChange = (field, value) => {
    if (!selectedZone) return;
    let newVal = value;

    if (["width", "height", "x", "y", "borderRadius"].includes(field)) {
      newVal = Number(value);
      if (isNaN(newVal)) return;
    }
    if (field === "name" && newVal.length > MAX_NAME_LENGTH) return;

    setInputs((prev) => ({ ...prev, [field]: value }));

    updateSymmetric(selectedZone.id, { [field]: newVal });
  };

  const addZonePair = () => {
    const id1 = Date.now() + Math.random();
    const pairId = id1;
    const id2 = id1 + 1;

    const canvas = canvasRef.current;
    const cw = canvas?.clientWidth || 800;
    const ch = canvas?.clientHeight || 600;

    const width = 200;
    const height = 150;
    const borderRadius = 10;

    const zone1 = {
      id: id1,
      pairId,
      name: "",
      x: cw / 4 - width / 2,
      y: ch / 2 - height / 2,
      width,
      height,
      borderRadius,
    };

    const zone2 = {
      id: id2,
      pairId,
      name: "",
      x: cw - zone1.x - width,
      y: ch - zone1.y - height,
      width,
      height,
      borderRadius,
    };

    setZones((prev) => [...prev, zone1, zone2]);
    setSelectedZoneId(id1);
  };

  const deleteSelectedZone = () => {
    if (!selectedZone) return;
    setZones((prev) => prev.filter((z) => z.pairId !== selectedZone.pairId));
    setSelectedZoneId(null);
  };

  const handleBackgroundUpload = (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setTableBackground(url);
    setBoard((b) => ({ ...b, background_image: url }));
  };

  return (
    <>
      <Box sx={styles.navbar}>
        <Button
          sx={styles.navButton}
          onClick={() => {
            persist.current(selectedScene, {
              cards,
              buttons,
              zones,
              tableBackground,
              board,
            });
            navigate("/");
          }}
        >
          Close
        </Button>
        <Typography sx={styles.navText}>Board Editor</Typography>
        <Button sx={styles.navButton} onClick={addZonePair}>
          Add Zone Pair
        </Button>
        <Button sx={styles.navButton} onClick={deleteSelectedZone} disabled={!selectedZoneId}>
          Delete Zone
        </Button>
      </Box>

      <Box
        sx={{
          height: "calc(100vh - 60px)",
          width: "100vw",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            position: "relative",
            backgroundColor: "#333",
            backgroundImage: tableBackground ? `url(${tableBackground})` : "none",
            backgroundSize: "cover",
            overflow: "hidden",
          }}
          ref={canvasRef}
          onClick={() => setSelectedZoneId(null)}
        >
          {zones.map((zone) => (
            <Box
              key={zone.id}
              sx={{
                position: "absolute",
                left: zone.x,
                top: zone.y,
                width: zone.width,
                height: zone.height,
                borderRadius: zone.borderRadius,
                border: zone.id === selectedZoneId ? "3px solid cyan" : "1px solid #aaa",
                backgroundColor: "rgba(0,0,0,0.3)",
                cursor: "move",
                userSelect: "none",
              }}
              onMouseDown={(e) => handleMouseDown(e, zone)}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedZoneId !== zone.id) {
                  setSelectedZoneId(zone.id);
                }
              }}
            >
              <Typography sx={{ color: "#fff", p: 1 }}>{zone.name || "<no name>"}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ width: 300, p: 2, backgroundColor: "#222", color: "#fff" }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Table Background
            <input type="file" accept="image/*" hidden onChange={handleBackgroundUpload} />
          </Button>

          {["name", "width", "height", "x", "y", "borderRadius"].map((field) => (
            <TextField
              key={field}
              label={field}
              variant="outlined"
              size="small"
              type={field === "name" ? "text" : "number"}
              value={inputs[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={!selectedZoneId}
              fullWidth
              margin="dense"
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default BoardEditor;
