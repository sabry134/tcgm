import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const BoardEditor = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [cards, setCards] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
  }, [selectedScene]);
  useEffect(() => {
    if (!selectedScene) return;
    sessionStorage.setItem(
      selectedScene,
      JSON.stringify({ cards, buttons, zones })
    );
  }, [cards, buttons, zones, selectedScene]);
  useEffect(() => {
    if (scenes.length) localStorage.setItem("scenes", JSON.stringify(scenes));
  }, [scenes]);
  useEffect(() => {
    document.title = "JCCE";
  }, []);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
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
  }, [selectedZoneId, selectedZone]);

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

  const updateSymmetric = (id, newProps) => {
    setZones((prev) => {
      const origin = prev.find((z) => z.id === id);
      if (!origin) return prev;
      const twin = prev.find(
        (z) => z.pairId === origin.pairId && z.id !== id
      );
      const rect =
        canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
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

      const updatedOrigin = {
        ...origin,
        x,
        y,
        width,
        height,
        borderRadius: br,
        name,
      };
      const updatedTwin = {
        ...twin,
        x,
        y: mirrorY,
        width,
        height,
        borderRadius: br,
        name: twin.name,
      };

      return prev.map((z) =>
        z.id === origin.id
          ? updatedOrigin
          : z.id === twin.id
          ? updatedTwin
          : z
      );
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedZoneId == null) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const origin = zones.find((z) => z.id === selectedZoneId);
    if (!origin) return;

    const rawX = e.clientX - rect.left - dragOffset.current.x;
    const rawY = e.clientY - rect.top - dragOffset.current.y;
    updateSymmetric(selectedZoneId, {
      x: clamp(rawX, 0, rect.width - origin.width - CANVAS_MARGIN),
      y: clamp(rawY, 0, rect.height - origin.height - CANVAS_MARGIN),
    });
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

  const addZone = () => {
    const rect =
      canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    const dx = clamp(rect.width / 2 - 50, 0, rect.width - 100 - CANVAS_MARGIN);
    const half = rect.height / 2;
    const offset = 50;
    const bottomY = clamp(
      half + offset,
      0,
      rect.height - 100 - CANVAS_MARGIN
    );
    const topY = clamp(
      half - offset - 100,
      0,
      rect.height - 100 - CANVAS_MARGIN
    );
    const pairId = Date.now();
    const idx = Math.floor(zones.length / 2) + 1;

    const bottom = {
      id: pairId,
      pairId,
      name: `Zone ${idx}`,
      x: dx,
      y: bottomY,
      width: 100,
      height: 100,
      borderRadius: 0,
    };
    const top = {
      id: pairId + 1,
      pairId,
      name: `[OPPONENT] Zone ${idx}`,
      x: dx,
      y: topY,
      width: 100,
      height: 100,
      borderRadius: 0,
    };

    setZones((z) => [...z, bottom, top]);
    setSelectedZoneId(bottom.id);
  };

  const deleteZone = () => {
    if (!selectedZoneId) return;
    const pairId = zones.find((z) => z.id === selectedZoneId)?.pairId;
    if (pairId == null) return;
    setZones((z) => z.filter((z) => z.pairId !== pairId));
    setSelectedZoneId(null);
  };

  const handleFieldChange = (field, raw) => {
    setInputs((i) => ({ ...i, [field]: raw }));
    if (!selectedZone) return;

    if (LIVE_FIELDS.includes(field)) {
      if (field === "name") {
        const name = raw.slice(0, MAX_NAME_LENGTH);
        updateSymmetric(selectedZoneId, { name });
      } else {
        const v = parseInt(raw, 10);
        if (isNaN(v)) return;
        updateSymmetric(selectedZoneId, { [field]: v });
      }
    }
  };

  const handleFieldBlur = (field) => {
    if (!selectedZone) return;
    if (LIVE_FIELDS.includes(field)) return;
    const rect =
      canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    let props = {};
    const v = parseInt(inputs[field], 10);
    if (isNaN(v)) {
      setInputs((i) => ({ ...i, [field]: String(selectedZone[field]) }));
      return;
    }
    if (field === "width") {
      props.width = clamp(
        v,
        100,
        rect.width - selectedZone.x - CANVAS_MARGIN
      );
    } else if (field === "height") {
      props.height = clamp(
        v,
        100,
        rect.height - selectedZone.y - CANVAS_MARGIN
      );
    }
    updateSymmetric(selectedZoneId, props);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" sx={{ userSelect: "none" }}>
      <Box sx={styles.navbar}>
        {["/", "/documentation", "/forum", "/community"].map((path, i) => (
          <Button key={i} onClick={() => navigate(path)} sx={styles.navButton}>
            <Typography sx={styles.navText}>
              {["🌟 Home", "📜 Documentation", "🖼️ Forum", "🌍 Community"][i]}
            </Typography>
          </Button>
        ))}
      </Box>

      <Box display="flex" flex={1}>
        <Box
          ref={canvasRef}
          sx={{ flex: 1, position: "relative", bgcolor: "#c4c4c4", touchAction: "none" }}
          onMouseDown={() => setSelectedZoneId(null)}
        >
          {zones.map((z) => (
            <Box
              key={z.id}
              onMouseDown={(e) => handleMouseDown(e, z)}
              sx={{
                position: "absolute",
                left: z.x,
                top: z.y,
                width: z.width,
                height: z.height,
                border: z.id === selectedZoneId ? "2px solid #ff5722" : "2px dashed #333",
                bgcolor: "rgba(255,255,255,0.3)",
                borderRadius: z.borderRadius,
                cursor: "move",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  userSelect: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: "100%",
                }}
              >
                {z.name}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: 300,
            bgcolor: "#5d3a00",
            color: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">Zones Editor</Typography>
          <Button variant="contained" onClick={addZone}>
            Add Zone Pair
          </Button>
          {selectedZone && (
            <Button variant="outlined" color="error" onClick={deleteZone}>
              Delete Zone Pair
            </Button>
          )}
          {selectedZone ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["name", "width", "height", "x", "y", "borderRadius"].map((field) => (
                <TextField
                  key={field}
                  label={field}
                  variant="filled"
                  size="small"
                  value={inputs[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  type={LIVE_FIELDS.includes(field) ? (field === "name" ? "text" : "number") : "number"}
                  inputProps={field === "name" ? { maxLength: MAX_NAME_LENGTH } : {}}
                  InputProps={{ style: { background: "#fff", userSelect: field === "name" ? "text" : "none" } }}
                />
              ))}
            </Box>
          ) : (
            <Typography>Select a zone to edit</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BoardEditor;
