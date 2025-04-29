import { TextField } from '@mui/material'
import { FormComponnent } from '../FormComponnent'
import './CustomizationList.css'

export class CustomInput extends FormComponnent {
  render () {
    return (
      <input
        className='customInput'
        id='standard-basic'
        variant='standard'
        value={this.state.inputValue}
        onChange={this.handleChange}
      />
    )
  }
}
