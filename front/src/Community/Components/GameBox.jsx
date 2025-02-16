import { Box, Button, Slide, Typography } from '@mui/material'
import React, { Component, useRef } from 'react'
import './GameBox.css'
import { useNavigate } from 'react-router-dom'

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

  handleMouseEnter = event => {
    this.setState({ checked: false })
  }
  handleMouseLeave = event => {
    this.setState({ checked: true })
  }

  handleGameClick = event => {}

  render () {
    return (
      <div
        className='selection'
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Box>
          <Deck checked={this.state.checked} gameId={this.game.id} />
          <Typography variant='h5' gutterBottom>
            {this.game.name}
          </Typography>
        </Box>
      </div>
    )
  }
}

const Deck = ({ checked, gameId }) => {
  const navigate = useNavigate()

  const handleEditButton = event => {
    localStorage.setItem('gameSelected', gameId)
    navigate('/')
  }

  const handleClickButton = event => {
    // make a callback that open the rooms page
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
          <img
            width={width}
            height={height}
            alt='TCGM'
            src='https://www.shutterstock.com/shutterstock/photos/1881111823/display_1500/stock-photo-man-watching-sunset-at-duffey-lake-duffey-lake-provincial-park-british-columbia-canada-1881111823.jpg'
          />
        </Box>
        <Box className='face right'></Box>
        <Box className='face top'></Box>
      </Box>
    </Box>
  )
}
