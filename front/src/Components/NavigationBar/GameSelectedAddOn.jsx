import { Button, SvgIcon, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { ArrowBack } from "@mui/icons-material";

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
        onClick={ unselectGame }
        className="navbarSmallButton"
        title={ 'Unselect the game' }
      >
        <SvgIcon
          component={ ArrowBack }
          sx={{ color: '#c4c4c4' }}
        />
      </Button>
      <Button
        onClick={() => navigate('/card-editor')}
        className="navbarButton"
        title={ 'Edit the cards' }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Editor
        </Typography>
      </Button>
      <Button
        onClick={() => navigate('/templates')}
        className="navbarButton"
        title={ 'Edit the templates' }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Templates
        </Typography>
      </Button>
      <Button
        onClick={() => console.log('game settings')}
        className="navbarButton"
        title={ 'Edit the game settings' }
      >
        <Typography variant='h6' sx={{ color: 'white' }}>
          Game Settings
        </Typography>
      </Button>

    </>
  )
}