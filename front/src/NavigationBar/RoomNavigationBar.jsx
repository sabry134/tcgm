import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from '@mui/icons-material'
import { NavbarButton, NavbarSmallButton } from './Components/navbarButton'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { useChannel } from '../ChannelContext'

export const RoomNavigationBar = ({ roomId }) => {
  const navigate = useNavigate()
  const { resetConnection } = useChannel()
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const popoverId = open ? 'room-id-popover' : undefined

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCopyButtonText('Copy')
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopyButtonText('Copied')
        setTimeout(() => {
          setCopyButtonText('Copy')
        }, 2000)
      })
      .catch(err => {
        console.error('Failed to copy room id: ', err)
      })
  }

  const returnHome = () => {
    resetConnection()
    localStorage.removeItem('room_id')
    navigate('/')
  }

  return (
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
        event={() => navigate('/help-game')}
        altText={'Help game'}
        buttonText={'Help'}
      />
      <NavbarSmallButton
        event={handleIconClick}
        altText={'Room ID'}
        svgComponent={LinkIcon}
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
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontWeight: 500
                }
              }}
            />
            <Button variant='text' onClick={handleCopy} sx={{ color: 'white' }}>
              {copyButtonText}
            </Button>
          </Box>
        </Popover>
      </Box>
    </Box>
  )
}

const styles = {
  linkIconBox: {
    position: 'absolute',
    top: 10,
    right: 10
  }
}
