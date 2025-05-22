import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box } from '@mui/material'
import { useChannel } from '../../ChannelContext'

export const JoinRoomNavigationBar = () => {
  const navigate = useNavigate()
  const { resetConnection } = useChannel()

  const returnHome = () => {
    resetConnection()
    navigate('/')
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
        event={() => navigate('/join')}
        altText={'Join a game'}
        buttonText={'Join room'}
      />
      <NavbarButton
        event={() => navigate('/select-deck')}
        altText={'Edit your deck'}
        buttonText={'Edit deck'}
      />
    </Box>
  )
}
