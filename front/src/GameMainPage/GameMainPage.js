import { Box } from "@mui/material";
import { MainNavigationBar } from "../NavigationBar/MainNavigationBar";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "./component/LeftPanel";
import { RightPanel } from "./component/RightPanel";

const GameMainPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <MainNavigationBar navigate={navigate} />

      <Box display="flex" flexGrow={1} bgcolor="#fff">

        <LeftPanel />

        <Box
          className="main-area"
          flexGrow={1}
          bgcolor="#c4c4c4"
          position="relative"
        >
        </Box>

        <RightPanel />

      </Box>
    </Box>
  );
}

export default GameMainPage;