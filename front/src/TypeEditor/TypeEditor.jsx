import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { LeftPanel } from './Components/LeftPanel'
import { RightPanel } from './Components/RightPanel'
import { Editor } from './Components/Editor'
import { useNavigate } from 'react-router-dom'
import { MainNavigationBar } from '../NavigationBar/MainNavigationBar'
import { Popup } from "../Components/Popup/Popup";
import { createCardTypeRequest } from "../Api/cardTypesRequest";

const TypeEditor = () => {
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(null)
  const [leftPanelKey, setLeftPanelKey] = useState(0) // Added key state

  const spanRef = useRef()

  const openPopup = () => {
    setAnchor(anchor ? null : spanRef)
  }

  const closePopup = () => {
    setAnchor(null)
    setLeftPanelKey(prevKey => prevKey + 1)
  }

  const onClickCreate = data => {
    createCardTypeRequest({
      cardType: {
        name: data[0],
        game_id: localStorage.getItem('gameSelected'),
        properties: []
      }
    }).then()
  }

  const open = Boolean(anchor)
  const id = open ? 'simple-popper' : undefined

  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <MainNavigationBar navigate={navigate} />

      <Box display='flex' flexGrow={1} bgcolor='#fff'>
        <LeftPanel key={leftPanelKey} popupCallback={openPopup} />
        <Box
          className='main-area'
          flexGrow={1}
          bgcolor='#c4c4c4'
          position='relative'
          ref={spanRef}
        >
          <Editor />
        </Box>
        <Popup
          id={id}
          open={open}
          anchorEl={anchor}
          closeCallback={closePopup}
          receivedCallback={(data) => onClickCreate(data)}
          title={'Create Type'}
          inputName={['Name']}
        />
        <RightPanel />
      </Box>
    </Box>
  )
}

export default TypeEditor