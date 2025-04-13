import { FormComponnent } from '../../CustomizationForm/FormComponnent'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { getCardsByGameRequest } from '../../Api/cardsRequest'

export class CardPicker extends FormComponnent {
  constructor (props) {
    super(props)
    this.state = {
      inputValue: 0,
      cards: [] // Store fetched Data
    }
  }

  componentDidMount () {
    this.fetchType()
  }

  fetchType = () => {
    const gameSelected = localStorage.getItem('gameSelected')

    try {
      getCardsByGameRequest(gameSelected).then(data => {
        if (!data) {
          return []
        }
        this.setState({ cards: data })
      })
    } catch (error) {
      console.error(error)
    }
  }

  handleChange = event => {
    const newValue = event.target.value
    this.setState({ inputValue: newValue })
    localStorage.setItem('editIdPick', newValue.toString())
  }

  render () {
    return (
      <FormControl fullWidth>
        <InputLabel id='card-type-picke-label'></InputLabel>
        <Select
          style={{ backgroundColor: 'white' }}
          labelId='card-type-picke-label'
          id='card-type-picker'
          value={this.state.inputValue}
          defaultValue={0}
          label='Type'
          onChange={this.handleChange}
          onOpen={this.fetchType}
        >
          <MenuItem key={'new'} value={0}>
            ➕ New Card{' '}
          </MenuItem>
          {this.state.cards.length > 0 ? (
            this.state.cards.map((card, index) => (
              <MenuItem key={index} value={card.id}>
                {card.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>
    )
  }
}
