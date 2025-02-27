import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

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
        sx={ buttonStyle }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Unselect Game
        </Typography>
      </Button>
    </>
  )
}

const buttonStyle = {
  padding: '10px 20px', // Add padding
  backgroundColor: '#5d3a00', // Add background color
  flexGrow: 1, // Fill the container
  margin: '0 10px' // Add margin
}