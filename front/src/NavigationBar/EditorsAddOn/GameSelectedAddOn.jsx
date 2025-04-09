import React from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "../Components/navbarButton";

export const GameSelectedAddOn = ({ toggleDisplay }) => {
  const navigate = useNavigate()

  const unselectGame = () => {
    if (localStorage.getItem('gameSelected'))
      localStorage.removeItem('gameSelected')
    navigate('/')
  }

  return (
    <>
      <NavbarSmallButton
        event={ unselectGame }
        altText={ "Unselect the game" }
        svgComponent={ Close }
      />
      <NavbarButton
        event={ toggleDisplay }
        altText={ 'Edit the cards' }
        buttonText={ "Editor" }
      >
      </NavbarButton>
      <NavbarButton
        event={() => navigate('/templates')}
        altText={ 'Edit the templates' }
        buttonText={ "Templates" }
      >
      </NavbarButton>
      <NavbarButton
        event={() => console.log('game settings')}
        altText={ 'Edit the game settings' }
        buttonText={ "Game Settings" }
        disabled={ true }
      >
      </NavbarButton>
    </>
  )
}