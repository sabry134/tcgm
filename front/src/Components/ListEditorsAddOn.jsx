import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './RawComponents/navbarButton'
import { ROUTES } from '../Routes/routes'

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
        event={() => console.log('Board Editor')}
        altText={'Edit boards'}
        buttonText={'Board Editor'}
        disabled={true}
      />
      <NavbarButton
        event={() => console.log('Gameplay Editor')}
        altText={'Edit gameplay'}
        buttonText={'Gameplay Editor'}
        disabled={true}
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
    </>
  )
}
