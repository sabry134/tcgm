import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Chat as ChatIcon } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { useChannel } from '../ChannelContext'
import { ROUTES } from "../Routes/routes"; // Import the context hook

export const RoomNavigationBar = ({ roomId }) => {
  const navigate = useNavigate()
  const { channel } = useChannel() // Use the channel from context
  const playerId = localStorage.getItem('playerUsername') || 'anonymous'

  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [anchorEl, setAnchorEl] = useState(null)
  const [chatAnchorEl, setChatAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const popoverId = open ? 'room-id-popover' : undefined
  const openChat = Boolean(chatAnchorEl)
  const chatPopoverId = openChat ? 'chat-popover' : undefined

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!channel) return

    window.console.log('[DEBUG] Listening for chat updates on channel')

    channel.on('chat_update', payload => {
      window.console.log(
        '[DEBUG EVENT] chat_update full payload:',
        payload.chat
      )
      setMessages(payload.chat || [])
    })

    channel
      .push('get_chat', {})
      .receive('ok', () => {
        window.console.log('[DEBUG] Fetched initial chat messages')
      })
      .receive('error', err => {
        window.console.error('[DEBUG] Failed to fetch chat messages:', err)
      })

    return () => {
      channel.off('chat_update') // Clean up event listener
    }
  }, [channel])

  const handleSendMessage = () => {
    if (!message.trim() || !channel) return

    const payload = { player_id: playerId, message: message.trim() }
    window.console.log('[DEBUG] Sending message payload:', payload)

    channel
      .push('add_chat_message', payload)
      .receive('ok', () => {
        window.console.log('[DEBUG] Message sent OK')
        if (messagesEndRef.current)
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      })
      .receive('error', err => {
        window.console.error('[DEBUG] Send error:', err)
      })

    setMessage('')
  }

  const handleIconClick = e => setAnchorEl(e.currentTarget)
  const handleChatClick = e => setChatAnchorEl(e.currentTarget)
  const handleClose = () => {
    setAnchorEl(null)
    setCopyButtonText('Copy')
  }
  const handleChatClose = () => setChatAnchorEl(null)

  const handleCopy = () => {
    window.console.log('[DEBUG] Copying roomId:', roomId)
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopyButtonText('Copied')
        setTimeout(() => setCopyButtonText('Copy'), 2000)
      })
      .catch(err => {
        window.console.error('[DEBUG] Copy failed:', err)
      })
  }

  const returnHome = () => {
    localStorage.removeItem('room_id')
    navigate(ROUTES.COMMUNITY)
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: '#C4C4C4',
          color: 'white',
          p: 2,
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <NavbarSmallButton
          event={returnHome}
          altText='Return to home'
          svgComponent={Home}
        />
        <NavbarButton
          event={() => navigate(ROUTES.HELP_GAME)}
          altText='Help game'
          buttonText='Help'
        />
        <NavbarSmallButton
          event={handleIconClick}
          altText='Room ID'
          svgComponent={LinkIcon}
        />
        <NavbarSmallButton
          event={handleChatClick}
          altText='Toggle Chat'
          svgComponent={ChatIcon}
        />
      </Box>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPopover-paper': {
            bgcolor: '#5d3a00',
            color: 'white',
            p: 2,
            maxWidth: 250
          }
        }}
      >
        <Typography variant='subtitle1' fontWeight='bold'>
          Room ID
        </Typography>
        <Typography variant='body2' mb={1}>
          Share this Room ID to invite others.
        </Typography>
        <Box display='flex' alignItems='center'>
          <TextField
            value={roomId}
            variant='standard'
            sx={{ flex: 1, '& .MuiInputBase-input': { color: 'white' } }}
            slotProps={
              {
                input: {
                  readOnly: true,
                }
              }
            }
          />
          <Button onClick={handleCopy} sx={{ color: 'white' }}>
            {copyButtonText}
          </Button>
        </Box>
      </Popover>

      <Popover
        id={chatPopoverId}
        open={openChat}
        anchorEl={chatAnchorEl}
        onClose={handleChatClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPopover-paper': {
            bgcolor: '#5d3a00',
            color: 'white',
            p: 2,
            width: 300,
            height: 400,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
        >
          <Typography variant='subtitle1'>Game Chat</Typography>
          <Button
            onClick={handleChatClose}
            size='small'
            sx={{ color: 'white' }}
          >
            ✕
          </Button>
        </Box>
        <Box ref={scrollContainerRef} flex={1} overflowY='auto' mb={1}>
          {[...messages]
            .slice()
            .reverse()
            .map((msg, idx) => {
              const time = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : ''
              return (
                <Typography key={idx} mb={1} sx={{ color: 'white' }}>
                  <strong>{msg.player_id || 'Player'}</strong> [{time}]:{' '}
                  {msg.message}
                </Typography>
              )
            })}
          <div ref={messagesEndRef} />
        </Box>
        <Box display='flex'>
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
            placeholder='Type a message'
            sx={{ flex: 1, '& .MuiInputBase-input': { color: 'white' } }}
          />
          <Button onClick={handleSendMessage} sx={{ color: 'white', ml: 1 }}>
            Send
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default RoomNavigationBar
