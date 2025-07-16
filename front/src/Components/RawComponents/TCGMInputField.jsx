import React, { Component } from 'react'
import { Input, Box, Typography } from '@mui/material'

/**
 * Input field component for TCGM.
 * It renders a label and an input field with focus handling.
 * Used with TCGMPopup for user input.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {Function} props.onChange - Callback function to handle input changes.
 * @return {JSX.Element} The rendered TCGMInputField component.
 *
 * @example
 * <TCGMInputField
 *  label="Enter your name"
 *  onChange={(e) => console.log(e.target.value)}
 * />
 */

export class TCGMInputField extends Component {
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
          onChange={this.props.onChange}
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
