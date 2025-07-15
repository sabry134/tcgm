import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { TCGMCard } from './Components/TCGMCard'
import { MainNavigationBar } from '../NavigationBar/MainNavigationBar'
import { LeftPanel } from './Components/LeftPanel'
import { RightPanel } from './Components/RightPanel'
import CardEditorStagnantUI from './Components/CardEditorStagnantUI'
import defaultData from './Data/TestBack.json'

const CardEditor = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('currentEditedCard')) {
      localStorage.setItem('currentEditedCard', JSON.stringify(defaultData))
    }
  }, [])

  const saveNewCard = () => {
    console.log('Save new card logic here')
  }

  const saveEditedCard = () => {
    console.log('Save edited card logic here')
  }

  const deleteCard = () => {
    console.log('Delete card logic here')
  }

  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <MainNavigationBar navigate={navigate} />

      <Box display='flex' flexGrow={1} bgcolor='#fff'>
        <LeftPanel />
        <Box
          className='main-area'
          flexGrow={1}
          bgcolor='#c4c4c4'
          position='relative'
        >
          <CardEditorStagnantUI
            saveNewCard={saveNewCard}
            saveEditedCard={saveEditedCard}
            deleteCard={deleteCard}
          />
          <TCGMCard />
        </Box>
        <RightPanel />
      </Box>
    </Box>
  )
}

export default CardEditor
