import React, { Component } from 'react'
import { Grid2, Box } from '@mui/material'
import { GameBox } from './GameBox'

export class CommunityGamePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gameList: []
    }
    this.baseApiUrl = process.env.REACT_APP_API_URL
    if (!this.baseApiUrl) {
      this.baseApiUrl = 'http://localhost:4000/api/'
    }
  }

  componentDidMount () {
    this.getGames()
  }

  async getGames () {
    const apiUrl = this.baseApiUrl + 'games'

    try {
      const response = await fetch(apiUrl, { method: 'GET' })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      // ✅ Set state AFTER fetching data
      this.setState({ gameList: data })

      return data // ✅ Return the fetched data
    } catch (error) {
      console.error('Error fetching games:', error)
      return {} // ✅ Return empty object if there's an error
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
