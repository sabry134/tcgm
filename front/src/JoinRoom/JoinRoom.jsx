import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createRoomRequest, joinRoomRequest } from '../Api/roomRequest'
import { getGamesRulesByGameIdRequest, getPlayerPropertiesByGameRuleIdRequest } from '../Api/rulesRequest'
import { getActiveCardCollectionRequestForUserAndGame } from '../Api/collectionsRequest'
import { getBoardByGameIdRequest } from '../Api/boardRequest'
import { JoinRoomNavigationBar } from '../NavigationBar/JoinRoomNavigationBar'
import { useChannel } from '../ChannelContext'
import { ROUTES } from '../Routes/routes'
import { get } from 'lodash'

const JoinRoom = () => {
  const navigate = useNavigate()
  const { weakResetConnection } = useChannel()
  const [scenes, setScenes] = useState([])
  const [selectedScene, setSelectedScene] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [cards, setCards] = useState([])
  const [buttons, setButtons] = useState([])
  const [roomId, setRoomId] = useState('')
  const [playerUsername, setPlayerUsername] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [ressourcesOk, setRessourcesOk] = useState(false)
  const { setGameState } = useChannel()

  useEffect(() => {
    const savedScenes = JSON.parse(localStorage.getItem('scenes')) || []
    if (savedScenes.length > 0) {
      setScenes(savedScenes)
      setSelectedScene(savedScenes[0])
    }
  }, [])

  useEffect(() => {
    checkRessources()
  }, [])

  useEffect(() => {
    if (selectedScene) {
      const savedSceneData = JSON.parse(
        sessionStorage.getItem(selectedScene)
      ) || { cards: [], buttons: [] }
      setCards(savedSceneData.cards)
      setButtons(savedSceneData.buttons)
    }
  }, [selectedScene])

  useEffect(() => {
    if (selectedScene) {
      sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }))
    }
  }, [cards, buttons, selectedScene])

  useEffect(() => {
    if (scenes.length > 0) {
      localStorage.setItem('scenes', JSON.stringify(scenes))
    }
  }, [scenes])

  const checkRessources = async () => {
    const user_id = localStorage.getItem('userId')
    const game_id = localStorage.getItem('gameSelected')

    try {
      const gameRulesResponse = await getGamesRulesByGameIdRequest(game_id)
      console.log('Game rules response:', gameRulesResponse)
      if (!gameRulesResponse) {
        console.log('No game rules found for the selected game.')
        setRessourcesOk(false)
        return;
      }
      const playerProperties = await getPlayerPropertiesByGameRuleIdRequest(gameRulesResponse[0].id)
      console.log('Player properties response:', playerProperties)
      if (!playerProperties) {
        console.log('No player properties found for the game rules.')
        setRessourcesOk(false)
        return;
      }
      const boardResponse = await getBoardByGameIdRequest(game_id)
      console.log('Board response:', boardResponse)
      if (!boardResponse) {
        console.log('No board found for the selected game.')
        setRessourcesOk(false)
        return;
      }
      const activeDeck = await getActiveCardCollectionRequestForUserAndGame(user_id, game_id, 'deck')
      console.log('Active deck response:', activeDeck)
      if (!activeDeck) {
        console.log('No active deck found for the user and game.')
        setRessourcesOk(false)
        return;
      }
      setRessourcesOk(true)
    } catch (error) {
      console.error('Error checking resources:', error)
      setSnackbarMessage('Error checking resources. Please try again.')
      setSnackbarOpen(true)
      setRessourcesOk(false)
      return;
    }
  }

  const joinRoom = async (navigate, create = false) => {
    if (!create) localStorage.setItem('room_id', roomId)
    localStorage.setItem('player_id', playerUsername ?? 'Player')
    localStorage.setItem('playerUsername', playerUsername ?? 'Player')
    navigate(ROUTES.LOBBY)
  }

  const createRoom = async navigate => {
    try {
      const response = await createRoomRequest()
      console.log('response to create room:', response)
      localStorage.setItem('room_id', response.room_id)
      joinRoom(navigate, true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <JoinRoomNavigationBar />

      <Box sx={styles.container}>
        <Box sx={styles.contentBox}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            textColor='inherit'
            indicatorColor='secondary'
          >
            <Tab label='Join Room' />
            <Tab label='Create Room' />
          </Tabs>
          {tabIndex === 0 ? (
            <Box sx={styles.formBox}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label='Enter Room ID'
                  variant='outlined'
                  sx={styles.textField}
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                />
                <TextField
                  fullWidth
                  label='Enter player username (optional)'
                  variant='outlined'
                  sx={styles.textField}
                  value={playerUsername}
                  onChange={e => setPlayerUsername(e.target.value)}
                />
              </Stack>
              <Button
                fullWidth
                variant='contained'
                sx={styles.button}
                onClick={() => joinRoom(navigate)}
                disabled={!ressourcesOk}
              >
                Join Room
              </Button>
            </Box>
          ) : (
            <Box sx={styles.formBox}>
              <TextField
                fullWidth
                label='Room Name'
                variant='outlined'
                sx={styles.textField}
              />
              <Button
                fullWidth
                variant='contained'
                sx={styles.button}
                onClick={() => createRoom(navigate)}
                disabled={!ressourcesOk}
              >
                Create Room
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity='error'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const styles = {
  navbar: {
    backgroundColor: '#5d3a00',
    color: 'white',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-around'
  },
  navButton: {
    borderRadius: 0
  },
  navText: {
    color: 'white'
  },
  container: {
    height: '100vh',
    backgroundColor: '#c4c4c4',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentBox: {
    backgroundColor: '#5d3a00',
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center'
  },
  formBox: {
    mt: 3,
    width: '300px',
    textAlign: 'center'
  },
  textField: {
    backgroundColor: 'white',
    borderRadius: 1
  },
  button: {
    mt: 2
  }
}

export default JoinRoom
