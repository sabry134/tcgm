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
    userSelect: 'none',
  },
  navButton: {
    borderRadius: 0,
    userSelect: 'none',
  },
  navText: {
    color: "white",
    fontSize: '1.25rem',
    userSelect: 'none',
  },
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

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

  const bottomMargin = 10;
  const rightMargin = 10;

  useEffect(() => {
    const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (savedScenes.length) {
      setScenes(savedScenes);
      setSelectedScene(savedScenes[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedScene) {
      const saved = JSON.parse(sessionStorage.getItem(selectedScene)) || {};
      setCards(saved.cards || []);
      setButtons(saved.buttons || []);
      setZones(saved.zones || []);
    }
  }, [selectedScene]);

  useEffect(() => {
    if (selectedScene) {
      sessionStorage.setItem(
        selectedScene,
        JSON.stringify({ cards, buttons, zones })
      );
    }
  }, [cards, buttons, zones, selectedScene]);

  useEffect(() => {
    if (scenes.length) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }
  }, [scenes]);

  useEffect(() => {
    document.title = "JCCE";
  }, []);

  const handleMouseDown = (e, zone) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setSelectedZoneId(zone.id);
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - rect.left - zone.x,
      y: e.clientY - rect.top - zone.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedZoneId == null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    setZones(prev =>
      prev.map(z => {
        if (z.id !== selectedZoneId) return z;

        const relX = e.clientX - rect.left - dragOffset.current.x;
        const relY = e.clientY - rect.top - dragOffset.current.y;

        const x = clamp(relX, 0, rect.width - z.width - rightMargin);
        const y = clamp(relY, 0, rect.height - z.height - bottomMargin);

        return { ...z, x, y };
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, selectedZoneId]);

  const addZone = () => {
    const canvas = canvasRef.current;
    let defaultX = 50;
    let defaultY = 50;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      defaultX = clamp(rect.width / 2 - 50, 0, rect.width - 100 - rightMargin);
      defaultY = clamp(rect.height / 2 - 50, 0, rect.height - 100 - bottomMargin);
    }

    const newZone = {
      id: Date.now(),
      name: `Zone ${zones.length + 1}`,
      width: 100,
      height: 100,
      x: defaultX,
      y: defaultY,
      borderRadius: 0,
    };
    setZones([...zones, newZone]);
    setSelectedZoneId(newZone.id);
  };

  const updateSelectedZone = (field, value) => {
    setZones(prev =>
      prev.map(z =>
        z.id === selectedZoneId
          ? {
              ...z,
              [field]: ["width", "height", "x", "y", "borderRadius"].includes(field)
                ? parseInt(value, 10)
                : value,
            }
          : z
      )
    );
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  return (
    <Box display="flex" flexDirection="column" height="100vh" sx={{ userSelect: 'none' }}>
      <Box sx={styles.navbar}>
        <Button onClick={() => navigate("/")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>🌟 Home</Typography>
        </Button>
        <Button onClick={() => navigate("/documentation")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>📜 Documentation</Typography>
        </Button>
        <Button onClick={() => navigate("/forum")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>🖼️ Forum</Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>🌍 Community</Typography>
        </Button>
      </Box>

      <Box display="flex" flex={1}>
        <Box
          ref={canvasRef}
          sx={{ flex: 1, position: "relative", backgroundColor: "#c4c4c4", touchAction: 'none' }}
          onMouseDown={() => setSelectedZoneId(null)}
        >
          {zones.map(zone => (
            <Box
              key={zone.id}
              onMouseDown={e => handleMouseDown(e, zone)}
              sx={{
                position: "absolute",
                left: zone.x,
                top: zone.y,
                width: zone.width,
                height: zone.height,
                border: zone.id === selectedZoneId ? "2px solid #ff5722" : "2px dashed #333",
                bgcolor: "rgba(255,255,255,0.3)",
                borderRadius: zone.borderRadius,
                cursor: "move",
                userSelect: 'none',
              }}
            >
              <Typography variant="caption" sx={{ userSelect: 'none' }}>{zone.name}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{ width: 300, backgroundColor: "#5d3a00", color: "white", p: 2, display: "flex", flexDirection: "column", gap: 2, userSelect: 'none' }}
        >
          <Typography variant="h6">Zones Editor</Typography>
          <Button variant="contained" onClick={addZone}>Add Zone</Button>
          {selectedZone ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField label="Name" variant="filled" size="small" value={selectedZone.name}
                onChange={e => updateSelectedZone("name", e.target.value)} InputProps={{ style: { background: '#fff', userSelect: 'text' } }} />
              <TextField label="Width" variant="filled" size="small" type="number" value={selectedZone.width}
                onChange={e => updateSelectedZone("width", e.target.value)} InputProps={{ style: { background: '#fff' } }} />
              <TextField label="Height" variant="filled" size="small" type="number" value={selectedZone.height}
                onChange={e => updateSelectedZone("height", e.target.value)} InputProps={{ style: { background: '#fff' } }} />
              <TextField label="X" variant="filled" size="small" type="number" value={selectedZone.x}
                onChange={e => updateSelectedZone("x", e.target.value)} InputProps={{ style: { background: '#fff' } }} />
              <TextField label="Y" variant="filled" size="small" type="number" value={selectedZone.y}
                onChange={e => updateSelectedZone("y", e.target.value)} InputProps={{ style: { background: '#fff' } }} />
              <TextField label="Border Radius" variant="filled" size="small" type="number" value={selectedZone.borderRadius}
                onChange={e => updateSelectedZone("borderRadius", e.target.value)} InputProps={{ style: { background: '#fff' } }} />
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
