import React from "react";
import { useNavigate } from "react-router-dom";
import { Games } from "@mui/icons-material";
import { NavbarSmallButton } from "./Components/navbarButton";
import { Box } from "@mui/material";
import { ROUTES } from "../Routes/routes";

export const HelpGameNavigationBar = () => {
  const navigate = useNavigate()

  const backGame = () => {
    navigate(ROUTES.ROOM)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#C4C4C4',
        color: 'white',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around'
      }}
    >
      <NavbarSmallButton
        event={backGame}
        altText={"Back to game"}
        svgComponent={Games}
      />
    </Box>
  )
}