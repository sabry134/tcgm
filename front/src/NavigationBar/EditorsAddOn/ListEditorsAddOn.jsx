import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from '../Components/navbarButton'

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
        event={() => navigate('/board-editor')}
        altText={'Edit boards'}
        buttonText={'Board Editor'}
      />
      <NavbarButton
        event={() => console.log('Gameplay Editor')}
        altText={'Edit gameplay'}
        buttonText={'Gameplay Editor'}
        disabled={true}
      />
      <NavbarButton
        event={() => navigate('/card-editor')}
        altText={'Edit cards and decks'}
        buttonText={'Card Editor'}
      />
      <NavbarButton
        event={() => navigate('/type-editor')}
        altText={'Edit type'}
        buttonText={'Type Editor'}
      />
    </>
  )
}
