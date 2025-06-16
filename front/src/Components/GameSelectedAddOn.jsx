import React from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "./navbarButton";
import { ROUTES } from "../Routes/routes";

export const GameSelectedAddOn = ({ toggleDisplay }) => {
  const navigate = useNavigate()

  const unselectGame = () => {
    if (localStorage.getItem('gameSelected'))
      localStorage.setItem('gameSelected', false);
    navigate(ROUTES.HOME);
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
        event={() => console.log('templates')}
        altText={ 'Edit the templates' }
        buttonText={ "Templates" }
        disabled={ true }
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