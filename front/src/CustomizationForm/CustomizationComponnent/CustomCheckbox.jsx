import { FormComponnent } from '../FormComponnent'
import './CustomizationList.css'
import CheckIcon from '@mui/icons-material/Check'

export class CustomCheckbox extends FormComponnent {
  handleChange = event => {
    const newValue = this.state.inputValue ? !this.state.inputValue : true
    this.setState({ inputValue: newValue })

    // Send update to backend (or localStorage for temporary saving)
    this.updateJsonFile(newValue)
  }

  render () {
    return (
      <div onClick={this.handleChange} className='custom-checkbox-container'>
        <div
          className={
            'custom-checkbox ' + (this.state.inputValue ? 'checked' : '')
          }
        >
          {this.state.inputValue && (
            <CheckIcon sx={{ width: '100%', height: '100%' }} />
          )}
        </div>
      </div>
    )
  }
}
