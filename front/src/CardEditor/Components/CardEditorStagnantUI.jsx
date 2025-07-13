import React, { useState, useEffect } from 'react'
import './CardEditorStagnantUI.css'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import {
  getCardsByGameWithPropertiesRequest,
  saveCardRequest
} from '../../Api/cardsRequest'

function saveCard () {
  console.log('TEST SAVE')

  const card = localStorage.getItem('currentEditedCard')
  const gameId = localStorage.getItem('gameSelected')
  try {
    saveCardRequest(0, gameId, JSON.parse(card)).then(data => {})
  } catch (error) {
    console.log(error)
  }
}

function editCard () {
  console.log('TEST EDIT')
  const card = localStorage.getItem('currentEditedCard')
  const gameId = localStorage.getItem('gameSelected')
  try {
    saveCardRequest(1, gameId, JSON.parse(card)).then(data => {})
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
