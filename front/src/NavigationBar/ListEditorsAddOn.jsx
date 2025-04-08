import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "./Components/navbarButton";

export const ListEditorsAddOn = ({ toggleDisplay }) => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarSmallButton
        event={ toggleDisplay }
        altText={ "Return" }
        svgComponent={ ArrowBack }
      />
      <NavbarButton
        event={() => console.log("Board Editor")}
        altText={ "Edit boards" }
        buttonText={ "Board Editor" }
        disabled={ true }
      />
      <NavbarButton
        event={() => console.log("Gameplay Editor")}
        altText={ "Edit gameplay" }
        buttonText={ "Gameplay Editor" }
        disabled={ true }
      />
      <NavbarButton
        event={() => navigate('/card-editor')}
        altText={ "Edit cards and decks" }
        buttonText={ "Card Editor" }
      />
      <NavbarButton
        event={() => console.log("Type Editor")}
        altText={ "Edit type" }
        buttonText={ "Type Editor" }
        disabled={ true }
      />
    </>
  )
}