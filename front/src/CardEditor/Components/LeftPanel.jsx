import { Button, Paper, TextField } from '@mui/material'
import React, { Component } from 'react'
import { CardPicker } from './CardPicker'
import { createCardTypeRequest } from '../../Api/cardTypesRequest'
import {
  saveCardRequest,
  getCardsByGameRequest,
  getCardsByGameWithPropertiesRequest
} from '../../Api/cardsRequest'

// TODO(): add new create card button
// TODO(): change right pannel to only accept mutable properties change and name of card

export class LeftPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      createTypeInput: {
        name: '',
        properties: [''],
        game_id: 1
      },
      createGameInput: {
        name: '',
        description: ''
      },
      cardList: []
    }
  }

  componentDidMount () {
    this.getCard()
  }

  componentWillUnmount () {
    localStorage.removeItem('editIdPick')
  }

  createCardType () {
    const gameSelected = localStorage.getItem('gameSelected')

    try {
      createCardTypeRequest({
        cardType: {
          name: this.state.createTypeInput.name,
          properties: this.state.createTypeInput.properties,
          game_id: gameSelected
        }
      }).then(data => {
        console.log(data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  saveCard () {
    const card = localStorage.getItem('currentEditedCard')
    const storedId = localStorage.getItem('editIdPick')
    const gameId = localStorage.getItem('gameSelected')
    try {
      saveCardRequest(storedId, gameId, JSON.parse(card)).then(data => {
        this.getCard()
      })
    } catch (error) {
      console.log(error)
    }
  }

  getCard () {
    const gameSelected = localStorage.getItem('gameSelected')

    try {
      getCardsByGameWithPropertiesRequest(gameSelected).then(data => {
        if (!data) {
          return []
        }
        this.setState({ cardList: data })
        if (data.length > 0) {
          this.loadCard(data[0])
        }
        return data
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleCreateTypeInput (event, key) {
    const newValue = event.target.value
    const newType = {
      name: key === 'name' ? newValue : this.state.createTypeInput.name,
      game_id:
        key === 'game_id' ? newValue : this.state.createTypeInput.game_id,
      properties: this.state.createTypeInput.properties
    }
    this.setState({ createTypeInput: newType })
  }

  loadCard (card) {
    localStorage.setItem('currentEditedCard', JSON.stringify(card))
    window.dispatchEvent(new Event('storage'))
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
        <CardPicker />
        <Button
          onClick={event => this.saveCard()}
          sx={{ color: 'white', paddingBottom: 5 }}
        >
          Save Card
        </Button>

        <div style={{ marginTop: 20 }}>
          <h3>Cards List:</h3>
          {this.state.cardList.length > 0 ? (
            this.state.cardList.map((card, index) => (
              <Button
                key={index}
                variant='contained'
                onClick={event => this.loadCard(card)}
                sx={{ bgcolor: 'white', color: '#5d3a00', margin: '5px 0' }}
              >
                {card.name}
              </Button>
            ))
          ) : (
            <p>No cards available.</p>
          )}
        </div>
      </Paper>
    )
  }
}
