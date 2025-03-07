import { Button, SvgIcon, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { buttonStyle } from "./Style";
import CancelIcon from '@mui/icons-material/Cancel';

export const GameSelectedAddOn = (noGameChosen) => {
  const navigate = useNavigate()

  const unselectGame = () => {
    localStorage.removeItem('gameSelected')
    noGameChosen = true
    navigate('/')
  }

  return (
    <>
      <Button
        onClick={() => navigate('/card-editor')}
        sx={ buttonStyle }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Card Editor
        </Typography>
      </Button>
      <Button
        onClick={() => navigate('/templates')}
        sx={ buttonStyle }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Templates
        </Typography>
      </Button>
      <Button
        onClick={() => console.log('game settings')}
        sx={ buttonStyle }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Game Settings
        </Typography>
      </Button>
      <Button
        onClick={ unselectGame }
        sx={ smallButtonStyle }
        title={ 'Unselect the game' }
      >
        <SvgIcon
          component={ CancelIcon }
          sx={{ color: '#c4c4c4' }}
        />
      </Button>
    </>
  )
}

const smallButtonStyle = {
  backgroundColor: '#5d3a00',
}