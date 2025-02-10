import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const fakeGames = [
  {
    game_image: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
    game_name: "Game 1",
    game_description: "Game 1",
  },
  {
    game_image: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
    game_name: "Game 2",
    game_description: "Game 2",
  },
  {
    game_image: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
    game_name: "Game 3",
    game_description: "Game 3",
  },
  {
    game_image: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
    game_name: "Game 4",
    game_description: "Game 4",
  },
  {
    game_image: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
    game_name: "Game 5",
    game_description: "Game 5",
  },
];

const Community = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames(fakeGames);
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box sx={styles.navbar}>
        <Button onClick={() => navigate("/scene")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌟 Scene
          </Typography>
        </Button>
        <Button onClick={() => navigate("/templates")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            📜 Templates
          </Typography>
        </Button>
        <Button onClick={() => navigate("/editor")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🖼️ Card Editor
          </Typography>
        </Button>
        <Button onClick={() => navigate("/community")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🌍 Community
          </Typography>
        </Button>
        <Button onClick={() => navigate("/join")} sx={styles.navButton}>
          <Typography variant="h6" sx={styles.navText}>
            🚪 Join Room
          </Typography>
        </Button>
      </Box>
      <Box sx={styles.container}>
        <Grid container spacing={2} justifyContent="center" sx={styles.gridContainer}>
          {games.map((game, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} sx={styles.gridItem}>
              <Card sx={styles.card}>
                <CardMedia component="img" height="140" image={game.game_image} alt={game.game_name} />
                <CardContent>
                  <Typography variant="h6">{game.game_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.game_description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={styles.button}
                    onClick={() => navigate(`/games/${game.game_name}`)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#5d3a00",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-around",
  },
  navButton: {
    borderRadius: 0,
  },
  navText: {
    color: "white",
  },
  container: {
    height: "100vh",
    backgroundColor: "#c4c4c4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
  },
  gridContainer: {
    maxWidth: "900px",
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: 300,
    boxShadow: 3,
    borderRadius: 2,
  },
  button: {
    mt: 2,
  },
};

export default Community;
