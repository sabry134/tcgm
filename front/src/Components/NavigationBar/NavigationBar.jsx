import { Box, Button, Typography } from '@mui/material'
import React, { Component } from 'react'
import { GameSelectedAddOn } from "./GameSelectedAddOn";
import { buttonStyle } from "./Style";

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