import { Button, SvgIcon, Typography } from "@mui/material";
import './navbarButton.css';
import React from "react";

export const NavbarButton = ({ event, altText, buttonText }) => {
  return (
    <Button
      onClick={ event }
      className="navbarButton"
      title={ altText }
    >
      <Typography variant='h6' sx={{ color: 'white' }}>
        { buttonText }
      </Typography>
    </Button>
  )
}

export const NavbarSmallButton = ({ event, altText, svgComponent }) => {
  return (
    <Button
      onClick={ event }
      className="navbarSmallButton"
      title={ altText }
    >
      <SvgIcon
        component={ svgComponent }
        sx={{ color: '#c4c4c4' }}
      />
    </Button>
  )
}