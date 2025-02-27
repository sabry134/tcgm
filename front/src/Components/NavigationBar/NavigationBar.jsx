import { Box, Button, Typography } from '@mui/material'
import React, { Component } from 'react'
import { GameSelectedAddOn } from "./GameSelectedAddOn";

export class NavigationBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      noGameChosen: true
    }
  }
  componentDidMount () {
    this.handleStorageChange({})

    window.addEventListener('gameSelected', this.handleStorageChange)
  }

  componentWillUnmount () {
    window.removeEventListener('gameSelected', this.handleStorageChange)
  }

  handleStorageChange = () => {
    if (localStorage.getItem('gameSelected')) {
      this.setState({ noGameChosen: false })
    }
  }

  render () {
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
        {/*<Button onClick={() => this.props.navigate("/")} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        🌟 Scene
                    </Typography>
            </Button>*/}
        <Button
          onClick={() => this.props.navigate('/')}
          sx={ buttonStyle }
        >
          <Typography variant='h6' sx={{ color: 'white' }}>
            Game List
          </Typography>
        </Button>
        {!this.state.noGameChosen && (
          <>
            <GameSelectedAddOn />
          </>
        )}
      </Box>
    )
  }
}

const buttonStyle = {
  padding: '10px 20px', // Add padding
  backgroundColor: '#5d3a00', // Add background color
  flexGrow: 1, // Fill the container
  margin: '0 10px' // Add margin
}