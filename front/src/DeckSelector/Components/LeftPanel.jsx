import { Paper } from '@mui/material'
import React, { Component } from 'react'
import './LeftPanel.css'
import { TCGMButton } from '../../Components/RawComponents/TCGMButton/TCGMButton'
export class LeftPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      createDeckInput: {
        name: '',
        description: ''
      }
    }
    this.popupCallback = props.popupCallback
  }
  createGame () {
    const apiUrl = this.baseApiUrl + 'card_collections'
    console.log(apiUrl, "Api URL when creating deck")

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        card_cpllection: {
          name: this.state.createDeckInput.name,
          quantity: 0,
          game_id: localStorage.getItem("gameSelected"),
          user_id: localStorage.getItem("userId"),
          type: 'deck'
        }
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleCreateDeckInput (event, key) {
    const newValue = event.target.value
    const newDeck = {
      name: key === 'name' ? newValue : this.state.createDeckInput.name,
      description:
        key === 'description'
          ? newValue
          : this.state.createDeckInput.description
    }

    this.setState({ createDeckInput: newDeck })
  }

  handleCreateDeckClick (event) {}

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
        <TCGMButton onClick={this.popupCallback}>Create Deck</TCGMButton>
      </Paper>
    )
  }
}
