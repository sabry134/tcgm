import { Paper } from '@mui/material'
import React, { Component } from 'react'
import JsonToForm from '../../CustomizationForm/JsonToForm'
import txt from '../Data/TestBackTypes.json'

export class RightPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCard:
        JSON.parse(localStorage.getItem('currentEditedCard')) || null
    }
  }

  componentDidMount () {
    window.addEventListener('storage', this.handleStorageChange)
  }

  componentWillUnmount () {
    window.removeEventListener('storage', this.handleStorageChange)
  }

  handleStorageChange = () => {
    const updatedCard = JSON.parse(localStorage.getItem('currentEditedCard'))
    this.setState({ selectedCard: updatedCard })
  }

  render () {
    return (
      <Paper
        className='settings'
        sx={{
          width: '30vw',
          bgcolor: '#5d3a00',
          color: 'white',
          height: '100%',
          borderRadius: 0
        }}
      >
        <JsonToForm data={txt}></JsonToForm>
      </Paper>
    )
  }
}
