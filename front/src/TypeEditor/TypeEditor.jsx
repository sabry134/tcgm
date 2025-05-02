import { Box, Popper } from '@mui/material'
import { React, useRef, useState } from 'react'
import { LeftPanel } from './Components/LeftPanel'
import { RightPanel } from './Components/RightPanel'
import { Editor } from './Components/Editor'
import { useNavigate } from 'react-router-dom'
import { CreateTypePopup } from './Components/CreateTypePopup'
import { MainNavigationBar } from '../NavigationBar/MainNavigationBar'

const TypeEditor = () => {
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(null)
  const [leftPanelKey, setLeftPanelKey] = useState(0) // Added key state

  const spanRef = useRef()

  const openPopup = event => {
    setAnchor(anchor ? null : spanRef)
  }

  const closePopup = () => {
    setAnchor(null)
    setLeftPanelKey(prevKey => prevKey + 1)
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
        <Popper id={id} open={open} anchorEl={anchor}>
          <CreateTypePopup closeCallback={closePopup} />
        </Popper>
        <RightPanel />
      </Box>
    </Box>
  )
}

export default TypeEditor
