import { Typography } from '@mui/material'
import React, { Component } from 'react'
import { BaseTopBar } from "../RawComponents/BaseTopBar";

export class EmptyNavigationBar extends Component {
  render() {
    return (
      <BaseTopBar>

        <Typography variant='h5' sx={{ color: 'primary.contrastText' }}>
          Game List
        </Typography>

      </BaseTopBar>
    )
  }
}