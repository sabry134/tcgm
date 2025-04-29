import { Component, React } from 'react'
import { Input, Box } from '@mui/material'
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
        {this.props.label}
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
