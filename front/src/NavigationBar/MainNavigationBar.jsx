import { Box, Typography } from '@mui/material'
import React, { Component } from 'react'
import { GameSelectedAddOn } from "./EditorsAddOn/GameSelectedAddOn";
import { ListEditorsAddOn } from "./EditorsAddOn/ListEditorsAddOn";

export class MainNavigationBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      noGameChosen: true,
      showEditors: false
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
    } else {
      this.setState({ noGameChosen: true })
    }
  }

  toggleDisplayEditors = () => {
    this.setState({ showEditors: !this.state.showEditors })
  }

  render () {
    return (
      <>
        { this.state.noGameChosen ? (
          <Box
            sx={{
              backgroundColor: '#5d3a00',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Typography variant='h5' sx={{ color: 'white' }}>
              Game List
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: '#C4C4C4',
              color: 'white',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            { this.state.showEditors ? (
              <>
                <ListEditorsAddOn toggleDisplay={this.toggleDisplayEditors} />
              </>
            ) : (
              <GameSelectedAddOn toggleDisplay={ this.toggleDisplayEditors } />
            )}
          </Box>
        )}
      </>
    )
  }
}