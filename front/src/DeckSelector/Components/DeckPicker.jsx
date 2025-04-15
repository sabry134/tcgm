import React, { Component } from 'react'
import { Grid2, Box } from '@mui/material'
import { GameBox } from './GameBox'
import { getCollectionsByUserAndGameRequest, getGamesRequest } from '../../Api/collectionsRequest'

export class DeckPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      deckList: []
    }
  }

  componentDidMount () {
    if (this.state.deckList.length === 0) this.getDecks()
  }

  async getDecks () {
    try {
      //const userId = localStorage.getItem('userId')
      //const gameId = localStorage.getItem('gameId')
      const gameId = 105 // Replace with actual game ID
      const userId = 37 // Replace with actual user ID
      const data = await getCollectionsByUserAndGameRequest(userId, gameId)
      console.log('Decks:', data)
      this.setState({ deckList: data })
    } catch (error) {
      this.setState({ deckList: [] })
      console.error('Error fetching decks:', error)
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
            this.state.deckList.map((deck, index) => (
              <Grid2
                key={index}
                size={{ md: 4 }}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <GameBox game={deck} />
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
