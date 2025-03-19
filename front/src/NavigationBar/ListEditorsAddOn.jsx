import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { NavbarButton, NavbarSmallButton } from "./Components/navbarButton";

export const ListEditorsAddOn = ({ toggleDisplay }) => {

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
      />
      <NavbarButton
        event={() => console.log("Gameplay Editor")}
        altText={ "Edit gameplay" }
        buttonText={ "Gameplay Editor" }
      />
      <NavbarButton
        event={() => console.log("Card Editor")}
        altText={ "Edit cards and decks" }
        buttonText={ "Card Editor" }
      />
      <NavbarButton
        event={() => console.log("Type Editor")}
        altText={ "Edit type" }
        buttonText={ "Type Editor" }
      />
    </>
  )
}