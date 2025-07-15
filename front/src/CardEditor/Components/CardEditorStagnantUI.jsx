import React, { useState, useEffect } from 'react'
import './CardEditorStagnantUI.css'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import {
  getCardsByGameWithPropertiesRequest,
  saveCardRequest
} from '../../Api/cardsRequest'

function loadCard (card, isCreate = false) {
  localStorage.setItem('currentEditedCard', JSON.stringify(card))
  console.log(card, card.id)
  localStorage.setItem('editIdPick', card.id)
  window.dispatchEvent(new Event('storage'))
  window.dispatchEvent(new Event('newCardCreated'))
}

function getCard (id = -1) {
  const gameSelected = localStorage.getItem('gameSelected')

  try {
    getCardsByGameWithPropertiesRequest(gameSelected).then(data => {
      if (!data) {
        return []
      }
      console.log(data)
      if (data.length > 0) {
        let index = 0 // Default to the first card
        if (id !== -1) {
          index = data.findIndex(card => card.id === id) // Find the index of the card with the specified id
          if (index === -1) {
            console.log(
              `Card with id ${id} not found, defaulting to the first card.`
            )
            index = 0
          }
          loadCard(data[index]) // Load the card at the found index
        } else {
          index = data.length - 1
          loadCard(data[index], true) // Load the last card if no id is specified
        }
      }
      return data
    })
  } catch (error) {
    console.log(error)
  }
}

function saveCard () {
  const card = localStorage.getItem('currentEditedCard')
  const gameId = localStorage.getItem('gameSelected')
  try {
    saveCardRequest(0, gameId, JSON.parse(card)).then(data => {
      getCard()
    })
  } catch (error) {
    console.log(error)
  }
}

function editCard () {
  const card = localStorage.getItem('currentEditedCard')
  const gameId = localStorage.getItem('gameSelected')
  const currentCard = JSON.parse(localStorage.getItem('currentEditedCard'))
  try {
    saveCardRequest(currentCard.id, gameId, JSON.parse(card)).then(data => {
      getCard(currentCard.id)
    })
  } catch (error) {
    console.log(error)
  }
}

const CardEditorStagnantUI = ({}) => {
  const [cardName, setCardName] = useState('')

  useEffect(() => {
    const updateCardName = () => {
      const currentCard = JSON.parse(localStorage.getItem('currentEditedCard'))
      setCardName(currentCard?.name || 'Unnamed Card')
    }

    // Initial load
    updateCardName()

    // Add event listener for storage changes
    window.addEventListener('storage', updateCardName)

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('storage', updateCardName)
    }
  }, [])

  return (
    <div className='cardEditorStagnantUIContainer'>
      <div className='cardEditorStagnantUI'>
        <h3 color='white'>{cardName}</h3>
        <div className='buttonGroup'>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<SaveIcon />}
            onClick={saveCard} // Pass function reference
          >
            New
          </Button>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<SaveIcon />}
            onClick={editCard} // Pass function reference
          >
            Edit
          </Button>
          <Button
            variant='contained'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={() => {}} // Keep as is for now
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CardEditorStagnantUI
