import { Box, Button, Typography } from '@mui/material'
import React, { Component } from 'react'
import './GameBox.css'
import { useNavigate } from 'react-router-dom'
import logo from '../../../Assets/TCGMlogo.png'
import { createUserRequest } from '../../../Api/userRequest'

const height = '120px'
const width = '140px'

export class GameBox extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: true
    }

    this.game = props.game
  }

  handleMouseEnter = () => {
    this.setState({ checked: false })
  }
  handleMouseLeave = () => {
    this.setState({ checked: true })
  }

  // handleGameClick = event => {}

  render () {
    return (
      <div
        className='selection'
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Deck checked={this.state.checked} gameId={this.game.id} />
        <Typography variant='h5' gutterBottom>
          {this.game.name}
        </Typography>
      </div>
    )
  }
}

// Temporary function to create a user
async function createUser () {
  try {
    const data = await createUserRequest({
      user: { username: 'TestUser2' }
    })
    localStorage.setItem('userId', data.id)
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

// TODO(all): refacto game id selection
const Deck = ({ checked, gameId }) => {
  const navigate = useNavigate()

  const handleEditButton = () => {
    localStorage.setItem('gameSelected', gameId)
    window.dispatchEvent(new Event('gameSelected'))
    navigate('/game-main-page')
  }

  const handleClickButton = () => {
    localStorage.setItem('gameSelected', gameId)
    if (!localStorage.getItem('userId')) {
      console.log('User not found, creating a new user...')
      createUser()
    }
    navigate('/join')
  }

  return (
    <Box className='game'>
      <Box className={!checked ? 'cube bottomCubeAnimation' : 'cube'}>
        <Box className='face front leftSide' />
        <Box className='face front rightSide' />
        <Box className='face front bottomSide' />

        <Box className='face right' />
        <Box className='face left' />
        <Box className='face back' />
      </Box>
      {!checked && (
        <Box className='middle' display={'flex'} flexDirection={'column'}>
          <Button
            sx={{ m: 1 }}
            variant='contained'
            color='success'
            className='button'
            onClick={handleEditButton}
          >
            Edit
          </Button>
          <Button
            variant='contained'
            color='primary'
            className='button'
            onClick={handleClickButton}
          >
            Play
          </Button>
        </Box>
      )}

      <Box className={!checked ? 'cube topCubeAnimation' : 'cube'}>
        <Box className='face front'>
          <img width={width} height={height} alt='TCGM' src={logo} />
        </Box>
        <Box className='face right'></Box>
        <Box className='face top'></Box>
      </Box>
    </Box>
  )
}
