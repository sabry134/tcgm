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

  const isSyncing = useRef(false);










  const handleSaveClick = async () => {
    try {
      const gameId = localStorage.getItem("gameSelected");
      if (!gameId) {
        alert("No gameSelected ID found");
        return;
      }

      const boardParams = {
        game_id: gameId,
        background_image: board.background_image || null,
      };

      const sanitizedZones = zones.map((zone) => ({
        id: zone.id,
        name: zone.name?.trim() || "Unnamed Zone",
        width: Number(zone.width) || 0,
        height: Number(zone.height) || 0,
        x: Number(zone.x) || 0,
        y: Number(zone.y) || 0,
        border_radius: Number(zone.borderRadius) || 0,
        background_image: zone.background_image || null,
      }));

      let boardId = localStorage.getItem("boardSelected");

      const postCacheKey = "boardPostDone";

      const postDone = localStorage.getItem(postCacheKey) === "done";

      let method, url;

      if (!boardId || !postDone) {
        method = "POST";
        url = `${API_BASE}/api/boards/with_zones`;
      } else {
        method = "PUT";
        url = `${API_BASE}/api/boards/with_zones/${boardId}`;
      }

      const payload = { board: boardParams, zones: sanitizedZones };

      console.log(`[SAVE-API][${method}] ${url}`);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (method === "POST") {
          localStorage.setItem(postCacheKey, "failed");
        }
        const errBody = await response.json().catch(() => ({}));
        alert(`Save failed: ${JSON.stringify(errBody)}`);
        console.error("Save error:", errBody);
        return;
      }

      const data = await response.json();
      console.log(`[SAVE-API] ${method} Response:`, data);

      if (method === "POST") {
        if (data.board?.id) {
          boardId = data.board.id;
          localStorage.setItem("boardSelected", boardId);
          localStorage.setItem(postCacheKey, "done");
          console.log("Stored new boardSelected:", boardId);
        } else {
          localStorage.setItem(postCacheKey, "failed");
          alert("POST succeeded but no board ID returned.");
          return;
        }
      }

      if (method === "PUT") {
        localStorage.setItem(postCacheKey, "done");
      }

      setBoard(data.board);
      setZones(
        (data.zones || []).map((zone) => ({
          ...zone,
          borderRadius: zone.border_radius || 0,
        }))
      );

      alert("Board saved successfully!");
    } catch (err) {
      console.error("Error saving board:", err);
      alert("Error saving board. See console for details.");
    }
  };






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




  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedZoneId, isDragging, isResizing, zones]);


  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !selectedZoneId) return;

    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    if (isDragging) {
      const originZone = zones.find((z) => z.id === selectedZoneId);
      if (!originZone) return;

      const x = clamp(
        e.clientX - rect.left - dragOffset.current.x,
        0,
        canvasWidth - originZone.width
      );
      const y = clamp(
        e.clientY - rect.top - dragOffset.current.y,
        0,
        canvasHeight - originZone.height
      );

      setZones((prevZones) => {
        const originZone = prevZones.find((z) => z.id === selectedZoneId);
        if (!originZone) return prevZones;

        const pairId = originZone.pairId;

        const symmetricZone = prevZones.find(
          (z) => z.pairId === pairId && z.id !== selectedZoneId
        );

        return prevZones.map((zone) => {
          if (zone.id === selectedZoneId) {
            return { ...zone, x, y };
          }
          if (symmetricZone && zone.id === symmetricZone.id) {
            const mirroredX = canvasWidth - x - originZone.width;
            const mirroredY = canvasHeight - y - originZone.height;
            return { ...zone, x: mirroredX, y: mirroredY };
          }
          return zone;
        });
      });
    }

    if (isResizing) {
      const originZone = zones.find((z) => z.id === selectedZoneId);
      if (!originZone) return;

      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;

      const newWidth = clamp(resizeStart.current.width + dx, 100, canvasWidth);
      const newHeight = clamp(resizeStart.current.height + dy, 100, canvasHeight);

      setZones((prevZones) => {
        const originZone = prevZones.find((z) => z.id === selectedZoneId);
        if (!originZone) return prevZones;

        const pairId = originZone.pairId;

        const symmetricZone = prevZones.find(
          (z) => z.pairId === pairId && z.id !== selectedZoneId
        );

        return prevZones.map((zone) => {
          if (zone.id === selectedZoneId) {
            return { ...zone, width: newWidth, height: newHeight };
          }
          if (symmetricZone && zone.id === symmetricZone.id) {
            const mirroredX = canvasWidth - originZone.x - newWidth;
            const mirroredY = canvasHeight - originZone.y - newHeight;
            return {
              ...zone,
              x: mirroredX,
              y: mirroredY,
              width: newWidth,
              height: newHeight,
            };
          }
          return zone;
        });
      });
    }
  };



  const updateSymmetric = (id, newProps) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setZones((prevZones) => {
      const targetZone = prevZones.find((z) => z.id === id);
      if (!targetZone) return prevZones;

      const pairId = targetZone.pairId;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      const updatedTarget = {
        ...targetZone,
        ...newProps,
      };

      return prevZones.map((zone) => {
        const isTarget = zone.id === id;
        const isPair = zone.pairId === pairId && !isTarget;

        if (isTarget) return updatedTarget;

        if (isPair) {
          const mirroredX = cw - updatedTarget.x - updatedTarget.width;
          const mirroredY = ch - updatedTarget.y - updatedTarget.height;

          let newName = zone.name;
          if (newProps.name !== undefined) {
            const baseName = newProps.name.replace(/_enemy$/, "");
            newName = `${baseName}_enemy`;
            newName = newName.slice(0, MAX_NAME_LENGTH);
          }

          return {
            ...zone,
            x: mirroredX,
            y: mirroredY,
            width: updatedTarget.width,
            height: updatedTarget.height,
            borderRadius: updatedTarget.borderRadius,
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
    const id1 = Date.now();
    const id2 = id1 + 1;
    const pairId = id1;

    const canvas = canvasRef.current;
    const cw = canvas?.clientWidth || 800;
    const ch = canvas?.clientHeight || 600;

    const width = 200;
    const height = 150;
    const borderRadius = 10;

    const existingNames = new Set(zones.map((z) => z.name.toLowerCase()));

    const findNextSuffix = (start) => {
      let suffix = start;
      while (existingNames.has(`unnamed zone${suffix === 1 ? '' : '_' + suffix}`)) {
        suffix++;
      }
      return suffix;
    };

    const suffix1 = findNextSuffix(1);
    const name1 = `Unnamed zone${suffix1 === 1 ? '' : '_' + suffix1}`;

    const suffix2 = findNextSuffix(suffix1 + 1);
    const name2 = `Unnamed zone_${suffix2}`;

    const zone1 = {
      id: id1,
      pairId,
      name: name1,
      x: cw / 4 - width / 2,
      y: ch / 2 - height / 2,
      width,
      height,
      borderRadius,
    };

    const zone2 = {
      id: id2,
      pairId,
      name: name2,
      x: cw - zone1.x - width,
      y: ch - zone1.y - height,
      width,
      height,
      borderRadius,
    };

    setZones((prev) => [...prev, zone1, zone2]);
    setSelectedZoneId(id1);
  };


  const handleDeleteZone = async (zoneId) => {
    if (!zoneId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this zone and its symmetric pair?");
    if (!confirmDelete) return;

    const zoneToDelete = zones.find((z) => z.id === zoneId);
    if (!zoneToDelete) return;

    const symmetricZone = zones.find((z) =>
      z.id !== zoneId &&
      z.width === zoneToDelete.width &&
      z.height === zoneToDelete.height &&
      z.y === zoneToDelete.y &&
      z.x === zoneToDelete.x * -1
    );

    const idsToDelete = [zoneId];
    if (symmetricZone) {
      idsToDelete.push(symmetricZone.id);
    }

    try {
      for (const id of idsToDelete) {
        const response = await fetch(`${API_BASE}/api/boards/zones/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete zone ${id}: ${errorText}`);
        }

      }

      setZones((prev) => prev.filter((z) => !idsToDelete.includes(z.id)));

      if (idsToDelete.includes(selectedZoneId)) {
        setSelectedZoneId(null);
      }

      alert(`Deleted zone${idsToDelete.length > 1 ? "s" : ""} successfully.`);
    } catch (err) {
      console.error("Error deleting zone(s):", err);
      alert("Failed to delete zone(s). See console for details.");
    }
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
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteZone(selectedZoneId)}
          disabled={!selectedZoneId}
        >
          Delete Zone
        </Button>

      </Box>

      <Box sx={{ height: "calc(100vh - 60px)", width: "100vw", display: "flex", overflow: "hidden" }}>
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

          <Button
            variant="outlined"
            component="label"
            fullWidth
            onClick={handleSaveClick}
            sx={{ mt: 2 }}
          >
            Save
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