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

  selectCard (index) {
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
          </ul>
        </div>
      </Paper>
    )
  }
}
