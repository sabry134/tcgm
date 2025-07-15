import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "JCCE";
  }, []);
  let API_BASE = process.env.REACT_APP_API_URL
  if (!API_BASE) {
    API_BASE = 'http://localhost:4000/api/'
  }
  const handleLogin = async () => {
    try {
      const response = await axios.post(API_BASE + "users/login", {
        user: {
          username,
          password,
        },
      });
      console.log("Login success:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(API_BASE + "users", {
        user: {
          username,
          email,
          password,
        },
      });
      console.log("Register success:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.username?.[0] ||
        "Registration failed";
      setError(message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
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

      <Box sx={styles.container}>
        <Box sx={styles.formContainer}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => {
              setTabIndex(newIndex);
              setError("");
            }}
            textColor="inherit"
            indicatorColor="secondary"
            sx={styles.tabs}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <Box sx={styles.formBox}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={styles.input}
            />

            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={styles.input}
              />
            )}

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.input}
            />

            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Repeat Password"
                type="password"
                variant="outlined"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                sx={styles.input}
              />
            )}

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={styles.button}
              onClick={tabIndex === 0 ? handleLogin : handleRegister}
            >
              {tabIndex === 0 ? "Login" : "Register"}
            </Button>
          </Box>
        </Box>
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
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "#5d3a00",
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  formBox: {
    mt: 3,
    width: "300px",
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 1,
    marginTop: "5%",
  },
  button: {
    mt: 2,
  },
};

export default Login;
