import React, { Component } from 'react'
import { Input, Box, Typography } from '@mui/material'

export class FormInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focused: false
    }
  }

  changeFocus = () => {
    this.setState({ focused: true })
  }
  closeFocus = () => {
    this.setState({ focused: false })
  }

  render () {
    return (
      <Box display={'flex'} flexDirection={'column'}>

        <Typography color={"primary.contrastText"} fontWeight={600}>
          {this.props.label}
        </Typography>

        <Input
          onFocus={this.changeFocus}
          onBlur={this.closeFocus}
          disableUnderline
          placeholder='...'
          sx={{
            backgroundColor: this.state.focused ? 'primary.main' : 'primary.dark',
            borderRadius: 2,
            p: 2,
            color: 'primary.contrastText'
          }}
        />

      </Box>
    )
  }
}
