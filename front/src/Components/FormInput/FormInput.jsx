import { Component, React } from 'react'
import { Input, Box, Typography } from '@mui/material'
import './FormInput.css'

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
      <Box marginTop={'15px'} display={'flex'} flexDirection={'column'}>

        <Typography
          color={"primary.contrastText"}
          fontWeight={600}
        >
          {this.props.label}
        </Typography>

        <Input
          onFocus={this.changeFocus}
          onBlur={this.closeFocus}
          disableUnderline
          placeholder='...'
          className={this.state.focused ? 'input focus' : 'input'}
          {...this.props}
        />

      </Box>
    )
  }
}
