import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTES } from "../Routes/routes";
import { BaseTopBar } from "../Components/TopBar/BaseTopBar.jsx";
import { TopBarButton } from "../Components/TopBar/TopBarButton.jsx";


const Login = () => {
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  let API_BASE = process.env.REACT_APP_API_URL;
  if (!API_BASE) API_BASE = 'http://localhost:4000/api/';

  const handleLogin = async () => {
    try {
      const response = await axios.post(API_BASE + "users/login", {
        user: { username, password },
      });
      console.log("Login success:", response.data);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      navigate(ROUTES.COMMUNITY);
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
        user: { username, email, password },
      });
      console.log("Register success:", response.data);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      navigate(ROUTES.COMMUNITY);
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.username?.[0] ||
        "Registration failed";
      setError(message);
    }
  };

  const submit = () => {
    setError("");
    tabIndex === 0 ? handleLogin() : handleRegister();
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: "#eee", display: "flex", flexDirection: "column" }}>
      <BaseTopBar>
        <TopBarButton
          text="Login"
          altText="Login Tab"
          event={() => {
            setTabIndex(0);
            setError("");
          }}
        />
        <TopBarButton
          text="Register"
          altText="Register Tab"
          event={() => {
            setTabIndex(1);
            setError("");
          }}
        />
      </BaseTopBar>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper elevation={6} sx={{ p: 4, bgcolor: "#fff", width: "320px" }}>
          <Typography variant="h6" align="center" gutterBottom>
            {tabIndex === 0 ? "Welcome Back" : "Create an Account"}
          </Typography>

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mt: 2 }}
          />

          {tabIndex === 1 && (
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />

          {tabIndex === 1 && (
            <TextField
              fullWidth
              label="Repeat Password"
              type="password"
              variant="outlined"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={submit}
          >
            {tabIndex === 0 ? "Login" : "Register"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
