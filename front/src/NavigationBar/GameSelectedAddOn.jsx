import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "./navbarButton";

export const GameSelectedAddOn = () => {
  const navigate = useNavigate()

  let showEditors = false
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
          svgComponent={ ArrowBack }
        />
        <NavbarButton
          event={() => navigate('/card-editor')}
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
        >
        </NavbarButton>
    </>
  )
}