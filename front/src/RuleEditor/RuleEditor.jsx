import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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

const RuleEditor = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState({
    starting_hand_size: 5,
    max_deck_size: 5,
    max_hand_size: 7,
    draw_per_turn: 1,
    player_properties: {
      health: 20,
    },
  });

  const handleChange = (field, value) => {
    if (field === "health") {
      setRules((prev) => ({
        ...prev,
        player_properties: {
          ...prev.player_properties,
          health: Number(value),
        },
      }));
    } else {
      setRules((prev) => ({
        ...prev,
        [field]: Number(value),
      }));
    }
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
        headers: {
          "Content-Type": "application/json",
        },
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
          display: "flex",
          height: "calc(100vh - 60px)",
          width: "100vw",
          backgroundColor: "#111",
          color: "#fff",
          overflow: "auto",
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            backgroundColor: "#222",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Game Rules
          </Typography>

          {[
            "starting_hand_size",
            "max_deck_size",
            "max_hand_size",
            "draw_per_turn",
          ].map((field) => (
            <TextField
              key={field}
              label={field.replace(/_/g, " ")}
              type="number"
              variant="outlined"
              fullWidth
              value={rules[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              margin="dense"
              InputLabelProps={{ style: { color: "#ccc" } }}
              inputProps={{ style: { color: "#fff" } }}
            />
          ))}

          <TextField
            label="Player Health"
            type="number"
            variant="outlined"
            fullWidth
            value={rules.player_properties.health}
            onChange={(e) => handleChange("health", e.target.value)}
            margin="dense"
            InputLabelProps={{ style: { color: "#ccc" } }}
            inputProps={{ style: { color: "#fff" } }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <Box
            sx={{
              width: 280,
              minHeight: 320,
              backgroundColor: "#222",
              borderRadius: 2,
              boxShadow: "0 0 12px cyan",
              p: 3,
              color: "cyan",
              fontWeight: "bold",
              fontSize: "1.2rem",
              userSelect: "none",
              border: "2px solid cyan",
            }}
          >
            <SportsEsportsIcon
              sx={{ fontSize: 60, mb: 1, color: "cyan" }}
              aria-hidden="true"
            />
            <Typography
              sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
              color="cyan"
            >
              Game Board
            </Typography>

            {[
              { label: "Starting Hand", value: rules.starting_hand_size },
              { label: "Max Deck", value: rules.max_deck_size },
              { label: "Max Hand", value: rules.max_hand_size },
              { label: "Draw / Turn", value: rules.draw_per_turn },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "cyan",
                    mr: 1,
                    flexShrink: 0,
                  }}
                  aria-label={`${label} value preview`}
                />
                <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
                  {label}
                </Typography>
                <Typography
                  sx={{
                    minWidth: 32,
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                  aria-live="polite"
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Card
            sx={{
              width: 200,
              height: 300,
              backgroundColor: "#222",
              boxShadow: "0 0 12px lime",
              border: "2px solid lime",
              userSelect: "none",
              color: "lime",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            aria-label="Card preview"
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "lime",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <CreditCardIcon sx={{ fontSize: 60 }} aria-hidden="true" />
              </Box>

              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
              >
                Player Card
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "lime",
                    mr: 1,
                    flexShrink: 0,
                  }}
                  aria-label="Health value preview"
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                  aria-live="polite"
                >
                  Health: {rules.player_properties.health}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default RuleEditor;
