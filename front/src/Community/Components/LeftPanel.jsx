import { Paper, TextField, Button } from '@mui/material'
import React, { Component } from 'react'
import './CreateGamePopupBody.css'
export class LeftPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      createGameInput: {
        name: '',
        description: ''
      }
    }
    this.popupCallback = props.popupCallback
  }
  createGame () {
    const apiUrl = this.baseApiUrl + 'games'

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game: {
          name: this.state.createGameInput.name,
          description: this.state.createGameInput.description
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

  handleCreateGameInput (event, key) {
    const newValue = event.target.value
    const newGame = {
      name: key === 'name' ? newValue : this.state.createGameInput.name,
      description:
        key === 'description'
          ? newValue
          : this.state.createGameInput.description
    }

    this.setState({ createGameInput: newGame })
  }

  handleCreateGameClick (event) {}

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
        <div onClick={this.popupCallback} className='button'>
          Create Game
        </div>
      </Paper>
    )
  }
}
