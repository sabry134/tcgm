import { TextField } from '@mui/material'
import { FormComponnent } from '../FormComponnent'
import './CustomizationList.css'

export class NumberInput extends FormComponnent {
  handleChange = event => {
    const value = event.target.value
    if (value === '' || /^\-?[0-9]*\.?[0-9]*$/.test(value)) {
      this.setState({ inputValue: value })
      if (value.slice(-1) !== '.') this.updateJsonFile(parseFloat(value))
      else this.updateJsonFile(value)
    }
  }

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
