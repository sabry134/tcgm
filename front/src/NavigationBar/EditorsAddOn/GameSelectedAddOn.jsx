import React from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "../Components/navbarButton";
import { ROUTES } from "../../Routes/routes";

export const GameSelectedAddOn = ({ toggleDisplay }) => {
  const navigate = useNavigate()

  const unselectGame = () => {
    if (localStorage.getItem('gameSelected'))
      localStorage.removeItem('gameSelected')
    navigate(ROUTES.COMMUNITY);
  }

  return (
    <>
      <NavbarSmallButton
        event={unselectGame}
        altText={"Unselect the game"}
        svgComponent={Close}
      />
      <NavbarButton
        event={toggleDisplay}
        altText={'Edit the cards'}
        buttonText={"Editor"}
      >
      </NavbarButton>
    </>
  )
}