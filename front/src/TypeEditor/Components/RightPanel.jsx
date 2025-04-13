import { Paper } from '@mui/material'
import { Component, React } from 'react'
import txt from '../Data/Property.json'
import JsonToForm from '../../CustomizationForm/JsonToForm'

export class RightPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: false
    }
  }

  componentDidMount () {
    window.addEventListener('ComponnentSelected', this.handleSelected)
  }
  componentWillUnmount () {
    window.removeEventListener('ComponnentSelected', this.handleSelected)
  }

  handleSelected = () => {
    if (localStorage.getItem('propertySelected')) {
      this.setState({ selected: true })
    } else {
      this.setState({ selected: false })
    }
  }

  render () {
    return (
      <Paper
        className='sidebar'
        sx={{
          width: 250,
          p: 2,
          bgcolor: '#5d3a00',
          color: 'white',
          borderRadius: 0
        }}
      >
        {this.state.selected ? (
          <JsonToForm data={txt} localStorageName='propertySelected' />
        ) : null}
      </Paper>
    )
  }
}
