import { FormComponnent } from '../FormComponnent'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { getCardTypesByGameRequest } from '../../Api/cardTypesRequest'
import shallowEqual from 'shallowequal'

export class CardTypePicker extends FormComponnent {
  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      cardTypes: [] // Store fetched Data
    }
  }

  componentDidMount () {
    this.fetchType()
    const currentCard = localStorage.getItem('currentEditedCard')
    if (currentCard) {
      this.setState({ inputValue: JSON.parse(currentCard).card_type_id })
    }
  }

  componentDidUpdate () {
    this.setState({
      inputValue: this.getValueByPath(
        JSON.parse(
          localStorage.getItem(
            this.props.localStorageName ?? 'currentEditedCard'
          )
        ),
        this.props.name
      )
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !shallowEqual(
        this.state.inputValue,
        this.getValueByPath(
          JSON.parse(
            localStorage.getItem(
              this.props.localStorageName ?? 'currentEditedCard'
            )
          ),
          this.props.name
        )
      ) ||
      (nextState && !shallowEqual(this.state.cardTypes, nextState.cardTypes))
    )
  }

  fetchType = async () => {
    try {
      const data = await getCardTypesByGameRequest(
        localStorage.getItem('gameSelected')
      )
      this.setState({ cardTypes: data })
    } catch (error) {
      console.log(error)
    }
  }

  handleChange = event => {
    const newValue = event.target.value

    this.setState({ inputValue: newValue })
    this.updateJsonFile(newValue.toString())
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
          label='Type'
          onChange={this.handleChange}
        >
          {this.state.cardTypes.length > 0 ? (
            this.state.cardTypes.map((type, index) => {
              return (
                <MenuItem key={index} value={type.id}>
                  {type.name}
                </MenuItem>
              )
            })
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>
    )
  }
}
