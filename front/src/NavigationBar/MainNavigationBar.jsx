import { Typography } from '@mui/material'
import React, { Component } from 'react'
import { GameSelectedAddOn } from "./EditorsAddOn/GameSelectedAddOn";
import { ListEditorsAddOn } from "./EditorsAddOn/ListEditorsAddOn";
import { BaseTopBar } from "./Components/BaseTopBar";

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
          <BaseTopBar>

            <Typography variant='h5' sx={{ color: 'primary.contrastText' }}>
              Game List
            </Typography>

          </BaseTopBar>
        ) : (
          <BaseTopBar>

            { this.state.showEditors ? (
              <>
                <ListEditorsAddOn toggleDisplay={this.toggleDisplayEditors} />
              </>
            ) : (
              <GameSelectedAddOn toggleDisplay={ this.toggleDisplayEditors } />
            )}

          </BaseTopBar>
        )}
      </>
    )
  }
}