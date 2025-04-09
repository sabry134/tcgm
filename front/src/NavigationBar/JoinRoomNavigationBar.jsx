import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "./Components/navbarButton";
import { Box } from "@mui/material";

export const JoinRoomNavigationBar = () => {
  const navigate = useNavigate()

  const returnHome = () => {
    navigate('/')
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
        event={ returnHome }
        altText={ "Return to home" }
        svgComponent={ Home }
      />
      <NavbarButton
        event={() => navigate('/join')}
        altText={ 'Join a game' }
        buttonText={ 'Join room' }
      />
    </Box>
  )
}