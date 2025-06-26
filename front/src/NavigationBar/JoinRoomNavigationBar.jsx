import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box } from '@mui/material'
import { useChannel } from '../ChannelContext'
import { ROUTES } from "../Routes/routes";

export const JoinRoomNavigationBar = () => {
  const navigate = useNavigate()
  const { resetConnection } = useChannel()

  const returnHome = () => {
    resetConnection()
    navigate(ROUTES.HOME)
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
        event={returnHome}
        altText={'Return to home'}
        svgComponent={Home}
      />
      <NavbarButton
        event={() => navigate(ROUTES.JOIN)}
        altText={'Join a game'}
        buttonText={'Join room'}
      />
      <NavbarButton
        event={() => navigate(ROUTES.SELECT_DECK)}
        altText={'Edit your deck'}
        buttonText={'Edit deck'}
      />
    </Box>
  )
}
