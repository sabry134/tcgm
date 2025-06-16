import { Typography } from '@mui/material'
import React, { Component } from 'react'

export class GameListTopBar extends Component {
  render() {
    return (
      <Typography variant='h5' sx={{ color: 'primary.contrastText' }}>
        Game List
      </Typography>
    )
  }
}