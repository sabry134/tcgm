import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Chat as ChatIcon } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import GameChat from '../Room/Componnent/GameChat'
import { ROUTES } from "../Routes/routes";

export const RoomNavigationBar = ({ roomId }) => {
  const navigate = useNavigate()

  const username = localStorage.getItem('playerUsername') || 'Unknown'

  // Store roomId in localStorage when component mounts or roomId changes
  useEffect(() => {
    if (roomId) {
      localStorage.setItem('room_id', roomId)
    }
  }, [roomId])

  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const popoverId = open ? 'room-id-popover' : undefined

  const [chatAnchorEl, setChatAnchorEl] = useState(null)
  const openChat = Boolean(chatAnchorEl)
  const chatPopoverId = openChat ? 'chat-popover' : undefined

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleChatClick = event => {
    setChatAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCopyButtonText('Copy')
  }

  const handleChatClose = () => {
    setChatAnchorEl(null)
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopyButtonText('Copied')
        setTimeout(() => setCopyButtonText('Copy'), 2000)
      })
      .catch(err => console.error('Failed to copy room id: ', err))
  }

  const returnHome = () => {
    localStorage.removeItem('room_id')
    navigate('/')
  }

  const handleSendMessage = () => {
    if (message.trim() === '') return
    setMessages([...messages, message])
    setMessage('')
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#C4C4C4',
          color: 'white',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <NavbarSmallButton
          event={returnHome}
          altText={'Return to home'}
          svgComponent={Home}
        />
        <NavbarButton
          event={() => navigate(ROUTES.HELP_GAME)}
          altText={'Help game'}
          buttonText={'Help'}
        />
        <NavbarSmallButton
          event={handleIconClick}
          altText={'Room ID'}
          svgComponent={LinkIcon}
        />
        <NavbarSmallButton
          event={handleChatClick}
          altText={'Toggle Chat'}
          svgComponent={ChatIcon}
        />

        <Box sx={styles.linkIconBox}>
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '& .MuiPopover-paper': {
                backgroundColor: '#5d3a00',
                color: 'white',
                padding: '10px',
                maxWidth: '250px'
              }
            }}
          >
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
              Room ID
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: '8px' }}>
              Share this Room ID to invite others.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={roomId}
                variant='standard'
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-input': { color: 'white', fontWeight: 500 }
                }}
              />
              <Button
                variant='text'
                onClick={handleCopy}
                sx={{ color: 'white' }}
              >
                {copyButtonText}
              </Button>
            </Box>
          </Popover>
        </Box>
      </Box>

      <Popover
        id={chatPopoverId}
        open={openChat}
        anchorEl={chatAnchorEl}
        onClose={handleChatClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: '#5d3a00',
            color: 'white',
            padding: '10px',
            maxWidth: '300px',
            minWidth: '300px',
            height: '400px',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1
          }}
        >
          <Typography variant='subtitle1'>Game Chat</Typography>
          <Button
            onClick={handleChatClose}
            size='small'
            sx={{ color: 'white', minWidth: '30px' }}
          >
            ✕
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{ color: 'white', marginBottom: '8px' }}
            >
              {username}: {msg}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <TextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            variant='standard'
            sx={{
              flexGrow: 1,
              '& .MuiInputBase-input': { color: 'white', fontWeight: 500 }
            }}
            placeholder='Type a message'
          />

          <Button
            onClick={handleSendMessage}
            sx={{ color: 'white', marginLeft: '8px' }}
          >
            Send
          </Button>
        </Box>
      </Popover>
    </>
  )
}

const styles = {
  linkIconBox: {
    position: 'absolute',
    top: 10,
    right: 10
  }
}

export default RoomNavigationBar
