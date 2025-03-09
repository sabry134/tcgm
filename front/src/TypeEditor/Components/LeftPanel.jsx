import { Paper, Typography } from '@mui/material'
import { Component, React } from 'react'
import {
  createCardTypeRequest,
  getCardTypesByGameRequest
} from '../../Api/cardTypesRequest'
import CheckIcon from '@mui/icons-material/Check'
import './LeftPanel.css'
import { TCGMButton } from '../../Components/TCGMButton'
import { getCardTypesPropertiesbyTypeRequest } from '../../Api/cardTypesPropertiesRequest'

export class LeftPanel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      types: [],
      selected: 0
    }
  }

  async createCardType () {
    const gameSelected = localStorage.getItem('gameSelected')

    try {
      await createCardTypeRequest({
        cardType: {
          name: this.state.createTypeInput.name,
          properties: this.state.createTypeInput.properties,
          game_id: gameSelected
        }
      }).then(data => {
        console.log(data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount () {
    const gameId = localStorage.getItem('gameSelected')
    this.getGameTypes(gameId)
  }

  getGameTypes (gameId) {
    getCardTypesByGameRequest(gameId).then(data => {
      if (data) this.setState({ types: data })
    })
  }

  selectType (typeId, index) {
    try {
      getCardTypesPropertiesbyTypeRequest(typeId).then(data => {
        if (!data) {
          return []
        }
        localStorage.setItem('currentTypeProperties', JSON.stringify(data))
        localStorage.setItem('currentTypeSelected', typeId)
        window.dispatchEvent(new Event('PropertiesSet'))
        this.setState({ selected: index })
        return data
      })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (
      <Paper
        className='sidebar'
        sx={{
          width: 250,
          p: 2,
          bgcolor: '#5d3a00',
          color: 'white',
          borderRadius: 0
        }}
      >
        <TCGMButton onClick={this.props.popupCallback}>Add Type</TCGMButton>
        <div className='title'> Type List </div>
        <ul className='typeList'>
          {this.state.types.map((value, index) => (
            <div key={index} className='itemList'>
              <div
                className={'selector'}
                onClick={event => this.selectType(value.id, index)}
              >
                <Typography
                  color={this.state.selected === index ? '#FFF600' : 'white'}
                >
                  {value.name}
                </Typography>
                {this.state.selected === index && (
                  <CheckIcon htmlColor='#FFF600' />
                )}
              </div>
              <div className='separator'></div>
            </div>
          ))}
        </ul>
      </Paper>
    )
  }
}
