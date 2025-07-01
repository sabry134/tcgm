import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Chat as ChatIcon } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { Socket } from 'phoenix'

export const RoomNavigationBar = ({ roomId }) => {
  const navigate = useNavigate()
  const playerId = localStorage.getItem('playerUsername') || 'anonymous'

  const socketRef = useRef(null)
  const channelRef = useRef(null)
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!roomId) return

    let socketURL = process.env.REACT_WS_URL
    if (!socketURL) socketURL = 'ws://localhost:4000/socket'

    const socket = new Socket(socketURL)
    socket.connect()
    socketRef.current = socket

    const channel = socket.channel(`room:${roomId}`, {})

    channel.join()
      .receive('ok', () => {
        channelRef.current = channel
        channel.push('get_chat', {})
      })
      .receive('error', () => {})

    channel.on('chat_update', payload => {
      setMessages(payload.chat || [])
    })

    return () => {
      channelRef.current?.leave()
      socketRef.current?.disconnect()
    }
  }, [roomId])

  const handleSendMessage = () => {
    if (!message.trim() || !channelRef.current) return

    const payload = { player_id: playerId, message: message.trim() }
    channelRef.current.push('add_chat_message', payload)
      .receive('ok', () => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      })
      .receive('error', () => {})

    setMessage('')
  }

  const handleIconClick = e => setAnchorEl(e.currentTarget)
  const handleChatClick = e => setChatAnchorEl(e.currentTarget)
  const handleClose = () => { setAnchorEl(null); setCopyButtonText('Copy') }
  const handleChatClose = () => setChatAnchorEl(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => { setCopyButtonText('Copied'); setTimeout(() => setCopyButtonText('Copy'), 2000) })
      .catch(() => {})
  }

  const returnHome = () => { localStorage.removeItem('room_id'); navigate('/') }

  return (
    <>
      <Box sx={{ bgcolor: '#C4C4C4', color: 'white', p: 2, display: 'flex', justifyContent: 'space-around' }}>
        <NavbarSmallButton event={returnHome} altText="Return to home" svgComponent={Home} />
        <NavbarButton event={() => navigate('/help-game')} altText="Help game" buttonText="Help" />
        <NavbarSmallButton event={handleIconClick} altText="Room ID" svgComponent={LinkIcon} />
        <NavbarSmallButton event={handleChatClick} altText="Toggle Chat" svgComponent={ChatIcon} />
      </Box>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiPopover-paper': { bgcolor: '#5d3a00', color: 'white', p: 2, maxWidth: 250 } }}
      >
        <Typography variant="subtitle1" fontWeight="bold">Room ID</Typography>
        <Typography variant="body2" mb={1}>Share this Room ID to invite others.</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            value={roomId}
            variant="standard"
            sx={{ flex: 1, '& .MuiInputBase-input': { color: 'white' } }}
            InputProps={{ readOnly: true }}
          />
          <Button onClick={handleCopy} sx={{ color: 'white' }}>{copyButtonText}</Button>
        </Box>
      </Popover>

      <Popover
        id={chatPopoverId}
        open={openChat}
        anchorEl={chatAnchorEl}
        onClose={handleChatClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiPopover-paper': { bgcolor: '#5d3a00', color: 'white', p: 2, width: 300, height: 400, display: 'flex', flexDirection: 'column' } }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">Game Chat</Typography>
          <Button onClick={handleChatClose} size="small" sx={{ color: 'white' }}>✕</Button>
        </Box>
        <Box
          ref={scrollContainerRef}
          flex={1}
          overflowY="auto"
          mb={1}
        >
          {[...messages]
            .slice()
            .reverse()
            .map((msg, idx) => {
              const time = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''
              return (
                <Typography key={idx} mb={1} sx={{ color: 'white' }}>
                  <strong>{msg.player_id || 'Player'}</strong> [{time}]: {msg.message}
                </Typography>
              )
            })}
          <div ref={messagesEndRef} />
        </Box>
        <Box display="flex">
          <TextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage() } }}
            variant="standard"
            placeholder="Type a message"
            sx={{ flex: 1, '& .MuiInputBase-input': { color: 'white' } }}
          />
          <Button onClick={handleSendMessage} sx={{ color: 'white', ml: 1 }}>Send</Button>
        </Box>
      </Popover>
    </>
  )
}

const styles = {
  linkIconBox: { position: 'absolute', top: 10, right: 10 },
}

export default RoomNavigationBar
