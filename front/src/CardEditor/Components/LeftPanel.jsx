import { Button, Paper, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import React, { Component } from 'react'
import { CardPicker } from './CardPicker'
import { createCardTypeRequest } from '../../Api/cardTypesRequest'
import {
  saveCardRequest,
  getCardsByGameRequest,
  getCardsByGameWithPropertiesRequest
} from '../../Api/cardsRequest'
import defaultData from '../Data/TestBack.json'

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
      cardList: [],
      selectedCard: 0 // Track the selected card
    }
  }

  componentDidMount () {
    this.getCard()

    // Add storage event listener
    this.storageListener = () => {
      this.getCard(false) // Reload cards when storage changes
    }
    window.addEventListener('newCardCreated', this.storageListener)
  }

  componentWillUnmount () {
    localStorage.removeItem('editIdPick')

    // Remove storage event listener
    window.removeEventListener('newCardCreated', this.storageListener)
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

  getCard (reloadPickedCard = true) {
    const gameSelected = localStorage.getItem('gameSelected')

    try {
      getCardsByGameWithPropertiesRequest(gameSelected).then(data => {
        if (!data) {
          return []
        }

        if (data.length > 0 && reloadPickedCard) {
          this.setState({ cardList: data })
          this.loadCard(data[0])
        }
        if (!reloadPickedCard) {
          this.setState({ cardList: data, selectedCard: data.length - 1 }) // Select the last card by default
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

  selectCard (index) {
    if (index === -1) {
      this.setState({ selectedCard: -1 })
      localStorage.removeItem('editIdPick')
      localStorage.setItem('currentEditedCard', JSON.stringify(defaultData))
      window.dispatchEvent(new Event('storage'))
      return
    }
    const selectedCard = this.state.cardList[index]
    localStorage.setItem('editIdPick', selectedCard.id)
    this.setState({ selectedCard: index })
    this.loadCard(selectedCard)
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
        <div style={{ marginTop: 20 }}>
          <div className='titleList'> Card List </div>{' '}
          {/* Add title for Card List */}
          <ul className='typeList'>
            {this.state.cardList.map((card, index) => (
              <div key={index} className='itemList'>
                <div
                  className={'selector'}
                  onClick={event => this.selectCard(index)}
                >
                  <Typography
                    color={
                      this.state.selectedCard === index ? '#FFF600' : 'white'
                    }
                  >
                    {card.name}
                  </Typography>
                  {this.state.selectedCard === index && (
                    <CheckIcon htmlColor='#FFF600' />
                  )}
                </div>
                <div className='separator'></div>
              </div>
            ))}
            <div className='itemList'>
              <div
                className={'selector'}
                onClick={event => this.selectCard(-1)}
              >
                <Typography
                  color={this.state.selectedCard === -1 ? '#FFF600' : 'white'}
                >
                  + Create New Card
                </Typography>
                {this.state.selectedCard === -1 && (
                  <CheckIcon htmlColor='#FFF600' />
                )}
              </div>
              <div className='separator'></div>
            </div>
          </ul>
        </div>
      </Paper>
    )
  }
}
