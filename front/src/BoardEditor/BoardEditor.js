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
const CANVAS_MARGIN = 10;
const MAX_NAME_LENGTH = 30;
const LIVE_FIELDS = ["name", "x", "y", "borderRadius"];

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
  const [tableBackground, setTableBackground] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
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
        if (!boardData.id) {
          const response = await fetch(`${API_BASE}/api/boards/with_zones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: boardData, zones: zonesData }),
          });
          if (!response.ok) throw new Error("Failed to create board");
          const data = await response.json();
          setBoard(data.board);
          setZones(data.zones);
        } else {
          const response = await fetch(`${API_BASE}/api/boards/${boardData.id}/with_zones`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: boardData, zones: zonesData }),
          });
          if (!response.ok) throw new Error("Failed to update board");
          const data = await response.json();
          setBoard(data.board);
          setZones(data.zones);
        }
      } catch (err) {
        console.error("Error syncing board:", err);
      }
    }, 1000)
  );

  useEffect(() => {
    if (board) {
      syncToApi.current(board, zones);
    }
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
    if (scenes.length) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }
  }, [scenes]);

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
    }
  }, [selectedZone]);

  const handleMouseDown = (e, zone) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelectedZoneId(zone.id);
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - rect.left - zone.x,
      y: e.clientY - rect.top - zone.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedZoneId == null) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const origin = zones.find((z) => z.id === selectedZoneId);
    if (!origin) return;

    const rawX = e.clientX - rect.left - dragOffset.current.x;
    const rawY = e.clientY - rect.top - dragOffset.current.y;
    pendingRef.current = {
      x: clamp(rawX, 0, rect.width - origin.width - CANVAS_MARGIN),
      y: clamp(rawY, 0, rect.height - origin.height - CANVAS_MARGIN),
    };
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        updateSymmetric(selectedZoneId, pendingRef.current);
        frameRef.current = null;
      });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, selectedZoneId, zones]);

  const frameRef = useRef(null);
  const pendingRef = useRef({});

  const updateSymmetric = (id, newProps) => {
    setZones((prev) => {
      const origin = prev.find((z) => z.id === id);
      if (!origin) return prev;
      const twin = prev.find((z) => z.pairId === origin.pairId && z.id !== id);
      const rect = canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
      if (!twin) return prev;

      let x = clamp(
        newProps.x ?? origin.x,
        0,
        rect.width - (newProps.width ?? origin.width) - CANVAS_MARGIN
      );
      let y = clamp(
        newProps.y ?? origin.y,
        0,
        rect.height - (newProps.height ?? origin.height) - CANVAS_MARGIN
      );
      let width = clamp(
        newProps.width ?? origin.width,
        100,
        rect.width - x - CANVAS_MARGIN
      );
      let height = clamp(
        newProps.height ?? origin.height,
        100,
        rect.height - y - CANVAS_MARGIN
      );

      const br = newProps.borderRadius ?? origin.borderRadius;
      const name = newProps.name ?? origin.name;

      const half = rect.height / 2;
      const isBottom = origin.id < twin.id;
      if (isBottom) y = Math.max(y, half + 1);
      else y = Math.min(y, half - height - 1);

      const mirrorY = clamp(
        rect.height - y - height,
        0,
        rect.height - height - CANVAS_MARGIN
      );

      const updatedOrigin = { ...origin, x, y, width, height, borderRadius: br, name };
      const updatedTwin = {
        ...twin,
        x: rect.width - x - width,
        y: mirrorY,
        width,
        height,
        borderRadius: br,
        name: twin.name,
      };

      return prev.map((z) =>
        z.id === updatedOrigin.id ? updatedOrigin : z.id === updatedTwin.id ? updatedTwin : z
      );
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

    if (LIVE_FIELDS.includes(field)) {
      updateSymmetric(selectedZone.id, { [field]: newVal });
    }
  };

  const addZonePair = () => {
    setZones((prev) => {
      const id1 = Date.now() + Math.random();
      const id2 = id1 + 1;
      return [
        ...prev,
        {
          id: id1,
          pairId: id1,
          name: "",
          x: 100,
          y: 100,
          width: 400,
          height: 350,
          borderRadius: 0,
          background: null,
        },
        {
          id: id2,
          pairId: id1,
          name: "",
          x: 100,
          y: 350,
          width: 400,
          height: 350,
          borderRadius: 0,
          background: null,
        },
      ];
    });
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
            persist.current(selectedScene, { cards, buttons, zones, tableBackground, board });
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
          height: "calc(100vh - 110px)",
          width: "100vw",
          display: "flex",
          backgroundColor: "#222",
          gap: 2,
          padding: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            position: "relative",
            backgroundColor: "#333",
            borderRadius: 1,
            overflow: "hidden",
            backgroundImage: tableBackground ? `url(${tableBackground})` : "none",
            backgroundSize: "cover",
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
                border: zone.id === selectedZoneId ? "3px solid #0ff" : "1px solid #aaa",
                backgroundColor: "rgba(0,0,0,0.3)",
                cursor: "grab",
                userSelect: "none",
              }}
              onMouseDown={(e) => handleMouseDown(e, zone)}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {zone.name || "<no name>"}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button variant="outlined" component="label" fullWidth>
            Upload Table Background
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleBackgroundUpload}
            />
          </Button>

          <TextField
            label="Selected Zone Name"
            variant="outlined"
            size="small"
            value={inputs.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!selectedZoneId}
          />
          <TextField
            label="Width"
            variant="outlined"
            size="small"
            type="number"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            disabled={!selectedZoneId}
          />
          <TextField
            label="Height"
            variant="outlined"
            size="small"
            type="number"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            disabled={!selectedZoneId}
          />
          <TextField
            label="X"
            variant="outlined"
            size="small"
            type="number"
            value={inputs.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            disabled={!selectedZoneId}
          />
          <TextField
            label="Y"
            variant="outlined"
            size="small"
            type="number"
            value={inputs.y}
            onChange={(e) => handleInputChange("y", e.target.value)}
            disabled={!selectedZoneId}
          />
          <TextField
            label="Border Radius"
            variant="outlined"
            size="small"
            type="number"
            value={inputs.borderRadius}
            onChange={(e) => handleInputChange("borderRadius", e.target.value)}
            disabled={!selectedZoneId}
          />
        </Box>
      </Box>
    </>
  );
};

export default BoardEditor;
