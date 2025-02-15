import { Box, Button, Slide, Typography } from '@mui/material'
import React, { Component, useRef } from 'react'
import './GameBox.css'

const height = '120px'
const width = '140px'
// the translate is half of the width

export class GameBox extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: true
    }

    this.game = props.game
  }

  chooseGame (id) {
    localStorage.setItem('gameSelected', id)
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
          <Deck checked={this.state.checked} />
          <Typography variant='h5' gutterBottom>
            {this.game.name}
          </Typography>
        </Box>
      </div>
    )
  }
}
// connect buttons to back
// reduce number of columns and increase size of box and buttons
// make a new form to create Games

const Deck = ({ checked }) => {
  return (
    <Box className='game'>
      <Box className='cube '>
        <Box className='face left'></Box>
        <Box className='face bottom'></Box>
        <Box className='face back'></Box>
        {!checked && (
          <Box className='middle' display={'flex'} flexDirection={'column'}>
            <Button className='button'> Edit </Button>
            <Button className='button'> Play </Button>
          </Box>
        )}
      </Box>
      <Box className={!checked ? 'cube cubeAnimation' : 'cube'}>
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
