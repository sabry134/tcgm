import { Button, SvgIcon, Typography } from "@mui/material";
import React from "react";

export const NavbarButton = ({ event, altText, buttonText, disabled = false }) => {
  return (
    <Button
      onClick={event}
      title={altText}
      sx={{ ...navbarButtonStyle.navbarButton(disabled) }}
      disabled={disabled}
    >
      <Typography variant='h6' sx={{ color: 'white' }}>
        {buttonText}
      </Typography>
    </Button>
  )
}

export const NavbarSmallButton = ({ event, altText, svgComponent }) => {
  return (
    <Button
      onClick={event}
      title={altText}
      sx={{ ...navbarButtonStyle.navbarSmallButton }}
    >
      <SvgIcon
        component={svgComponent}
        sx={{ color: '#c4c4c4' }}
      />
    </Button>
  )
}

const navbarButtonStyle = {
  navbarButton: (disabled) => ({
    backgroundColor: disabled ? '#c4c4c4' : '#5d3a00',
    padding: '10px 20px',
    flexGrow: 1,
    margin: '0 10px',
    '&:hover': {
      backgroundColor: '#7e4f00',
    }
  }),
  navbarSmallButton: {
    backgroundColor: '#5d3a00',
    '&:hover': {
      backgroundColor: '#7e4f00',
    },
    marginLeft: '10px',
  }
}