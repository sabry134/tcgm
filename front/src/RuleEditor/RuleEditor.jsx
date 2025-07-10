import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes/routes";

const API_BASE = "http://localhost:4000";

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

const toTitleCase = (str) =>
  str
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const RuleEditor = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState({
    starting_hand_size: 0,
    max_deck_size: 0,
    max_hand_size: 0,
    draw_per_turn: 0,
    player_properties: {
      health: 0,
      power: 0,
    },
  });
  const [newProps, setNewProps] = useState([]);

  const handleChange = (field, value) => {
    setRules((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handlePropertyChange = (prop, value) => {
    setRules((prev) => ({
      ...prev,
      player_properties: {
        ...prev.player_properties,
        [prop]: Number(value),
      },
    }));
  };

  const deleteExistingProperty = (prop) => {
    setRules((prev) => {
      const updated = { ...prev.player_properties };
      delete updated[prop];
      return {
        ...prev,
        player_properties: updated,
      };
    });
  };

  const addCustomProperty = () => {
    setNewProps((prev) => [...prev, { key: "", value: 0 }]);
  };

  const updateNewProp = (index, field, value) => {
    const updated = [...newProps];
    updated[index][field] = value;
    setNewProps(updated);
  };

  const saveCustomProp = (index) => {
    const { key, value } = newProps[index];
    if (!key) return;
    handlePropertyChange(key, value);
    const updated = newProps.filter((_, i) => i !== index);
    setNewProps(updated);
  };

  const deleteCustomProp = (index) => {
    const updated = newProps.filter((_, i) => i !== index);
    setNewProps(updated);
  };

  const handleSaveClick = async () => {
    try {
      const gameId = localStorage.getItem("gameSelected");
      if (!gameId) {
        alert("No gameSelected ID found");
        return;
      }

      const response = await fetch(`${API_BASE}/api/rules/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rules),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Rules saved successfully!");
    } catch (err) {
      console.error("Error saving rules:", err);
      alert("Error saving rules. See console.");
    }
  };

  return (
    <>
      <Box sx={styles.navbar}>
        <Button sx={styles.navButton} onClick={() => navigate(ROUTES.HOME)}>
          Close
        </Button>
        <Typography sx={styles.navText}>Rule Editor</Typography>
        <Button sx={styles.navButton} onClick={handleSaveClick}>
          Save
        </Button>
      </Box>

      <Box
        sx={{
          p: 4,
          backgroundColor: "#111",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Card
          sx={{
            width: 400,
            backgroundColor: "#222",
            color: "#0f0",
            border: "1px solid #0f0",
            boxShadow: "0px 4px 20px rgba(0, 255, 0, 0.3)",
            p: 3,
          }}
        >

          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <SportsEsportsIcon sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Player Properties
            </Typography>

            {["starting_hand_size", "max_deck_size", "max_hand_size", "draw_per_turn"].map(
              (field) => (
                <TextField
                  key={field}
                  label={toTitleCase(field)}
                  type="number"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  value={rules[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  inputProps={{ style: { color: "#fff" } }}
                />
              )
            )}

            {Object.entries(rules.player_properties).map(([key, value]) => (
              <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TextField
                  label={toTitleCase(key)}
                  type="number"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  value={value}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  inputProps={{ style: { color: "#fff" } }}
                />
                <IconButton onClick={() => deleteExistingProperty(key)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {newProps.map((prop, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={prop.key}
                  onChange={(e) => updateNewProp(i, "key", e.target.value)}
                  sx={{ flex: 1 }}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  inputProps={{ style: { color: "#fff" } }}
                />
                <TextField
                  label="Value"
                  variant="outlined"
                  type="number"
                  value={prop.value}
                  onChange={(e) => updateNewProp(i, "value", e.target.value)}
                  sx={{ width: 80 }}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  inputProps={{ style: { color: "#fff" } }}
                />
                <Button variant="contained" onClick={() => saveCustomProp(i)}>
                  Save
                </Button>
                <IconButton onClick={() => deleteCustomProp(i)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <IconButton onClick={addCustomProperty} color="success">
                <AddIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1, color: "#0f0" }}>
                Add property
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RuleEditor;
