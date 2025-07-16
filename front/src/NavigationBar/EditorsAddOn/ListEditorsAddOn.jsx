import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from '../Components/navbarButton'
import { ROUTES } from "../../Routes/routes";

export const ListEditorsAddOn = ({ toggleDisplay }) => {
  const navigate = useNavigate()

  return (
    <>
      <NavbarSmallButton
        event={toggleDisplay}
        altText={'Return'}
        svgComponent={ArrowBack}
      />
      <NavbarButton
        event={() => navigate(ROUTES.BOARD_EDITOR)}
        altText={'Edit boards'}
        buttonText={'Board Editor'}
      />
      <NavbarButton
        event={() => navigate(ROUTES.CARD_EDITOR)}
        altText={'Edit cards and decks'}
        buttonText={'Card Editor'}
      />
      <NavbarButton
        event={() => navigate(ROUTES.TYPE_EDITOR)}
        altText={'Edit type'}
        buttonText={'Type Editor'}
      />
      <NavbarButton
        event={() => navigate(ROUTES.CARD_COLLECTION_EDITOR)}
        altText={'Edit collections'}
        buttonText={'Collection Editor'}
      />
    </>
  )
}
