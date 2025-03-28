import { Button, SvgIcon, Typography } from "@mui/material";
import { navbarButtonStyle } from "./navbarButtonStyle";
import React from "react";

export const NavbarButton = ({ event, altText, buttonText }) => {
  return (
    <Button
      onClick={ event }
      title={ altText }
      sx={{ ...navbarButtonStyle.navbarButton }}
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
      title={ altText }
      sx={{ ...navbarButtonStyle.navbarSmallButton }}
    >
      <SvgIcon
        component={ svgComponent }
        sx={{ color: '#c4c4c4' }}
      />
    </Button>
  )
}