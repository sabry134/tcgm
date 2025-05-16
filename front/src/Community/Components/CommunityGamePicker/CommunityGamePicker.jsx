import React, { Component } from 'react'
import { Grid2, Box } from '@mui/material'
import { GameBox } from './GameBox'
import { getGamesRequest } from '../../../Api/gamesRequest'

export class CommunityGamePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gameList: []
    }
  }

  componentDidMount () {
    if (this.state.gameList.length === 0) this.getGames()
  }

  async getGames () {
    try {
      const data = await getGamesRequest()
      this.setState({ gameList: data })
    } catch (error) {
      this.setState({ gameList: [] })
      console.error('Error fetching games:', error)
    }
  }

  render () {
    return (
      <Box>
        <Grid2
          container
          rowSpacing={0}
          alignItems={'center'}
          columns={{ md: 16 }}
        >
          {this.state.gameList ? (
            this.state.gameList.map((game, index) => (
              <Grid2
                key={index}
                size={{ md: 4 }}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <GameBox game={game} />
              </Grid2>
            ))
          ) : (
            <Box> Loading ... </Box>
          )}
        </Grid2>
      </Box>
    )
  }
}
