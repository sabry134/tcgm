import { Box, Button, Typography } from '@mui/material'
import React, { Component } from 'react'

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
          backgroundColor: '#5d3a00',
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
          sx={{ borderRadius: 0 }}
        >
          <Typography variant='h6' sx={{ color: 'white' }}>
            🌍 Community
          </Typography>
        </Button>
        <Button
          disabled={this.state.noGameChosen}
          onClick={() => this.props.navigate('/card-editor')}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant='h6' sx={{ color: 'white' }}>
            🖼️ Card Editor
          </Typography>
        </Button>

        <Button
          disabled={this.state.noGameChosen}
          onClick={() => this.props.navigate('/type-editor')}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant='h6' sx={{ color: 'white' }}>
            🔨 Type Editor
          </Typography>
        </Button>
        <Button
          disabled={this.state.noGameChosen}
          onClick={() => this.props.navigate('/templates')}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant='h6' sx={{ color: 'white' }}>
            📜 Templates
          </Typography>
        </Button>
      </Box>
    )
  }
}
