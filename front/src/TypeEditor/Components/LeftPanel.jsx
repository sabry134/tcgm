import { Paper, Typography } from '@mui/material'
import { Component, React } from 'react'
import {
  createCardTypeRequest,
  getCardTypesByGameRequest
} from '../../Api/cardTypesRequest'
import CheckIcon from '@mui/icons-material/Check'
import './LeftPanel.css'
import { TCGMButton } from '../../Components/RawComponents/TCGMButton/TCGMButton'
import { getCardTypesPropertiesbyTypeRequest } from '../../Api/cardTypesPropertiesRequest'

export class LeftPanel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      types: [],
      selectedType: 0,
      selectedProperties: 0,
      properties: []
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
    window.addEventListener('componnentCreated', this.handleComponnentChange)
    window.addEventListener('delete', this.handleComponnentChange)
    window.addEventListener('ComponnentSelected', this.handleComponnentSelected)

    this.getGameTypes(gameId)
  }
  componentWillUnmount () {
    window.removeEventListener(
      'ComponnentSelected',
      this.handleComponnentSelected
    )

    window.removeEventListener('componnentCreated', this.handleComponnentChange)
    window.removeEventListener('delete', this.handleComponnentChange)
  }

  handleComponnentChange = () => {
    this.setState({
      properties: JSON.parse(localStorage.getItem('currentTypeProperties'))
    })
  }

  handleComponnentSelected = () => {
    const tmpProperty = JSON.parse(localStorage.getItem('propertySelected'))
    if (!tmpProperty) {
      this.setState({ selectedProperties: -1 })
      return
    }
    this.setState({
      selectedProperties: this.state.properties.findIndex((value, index) => {
        return value.id === tmpProperty.id
      })
    })
  }

  getGameTypes (gameId) {
    getCardTypesByGameRequest(gameId).then(data => {
      if (data) {
        this.setState({ types: data })
        if (data[0]) {
          this.selectType(data[0].id, 0)
        }
      }
    })
  }

  selectProperties (index) {
    localStorage.setItem('idSelected', index)
    this.setState({ selectedProperties: index })
    window.dispatchEvent(new Event('idSelected'))
    window.dispatchEvent(new Event('ComponnentSelected'))
  }

  selectType (typeId, index) {
    try {
      getCardTypesPropertiesbyTypeRequest(typeId).then(data => {
        if (data) {
          localStorage.setItem('currentTypeProperties', JSON.stringify(data))
          this.setState({ properties: data })
        } else {
          localStorage.setItem('currentTypeProperties', JSON.stringify([]))
          this.setState({ properties: [] })
        }
        localStorage.setItem('currentTypeSelected', typeId)
        localStorage.removeItem('propertySelected')
        window.dispatchEvent(new Event('storeProperties'))
        window.dispatchEvent(new Event('ComponnentSelected'))
        this.setState({ selected: index })
      })
    } catch (error) {
      localStorage.setItem('currentTypeProperties', JSON.stringify([]))
      localStorage.setItem('currentTypeSelected', typeId)
      localStorage.removeItem('propertySelected')

      window.dispatchEvent(new Event('storeProperties'))
      window.dispatchEvent(new Event('ComponnentSelected'))
      console.log(error)
    }
    this.setState({ selectedType: index })
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

        <div className='titleList'> Type List </div>
        <ul className='typeList'>
          {this.state.types.map((value, index) => (
            <div key={index} className='itemList'>
              <div
                className={'selector'}
                onClick={event => this.selectType(value.id, index)}
              >
                <Typography
                  color={
                    this.state.selectedType === index ? '#FFF600' : 'white'
                  }
                >
                  {value.name}
                </Typography>
                {this.state.selectedType === index && (
                  <CheckIcon htmlColor='#FFF600' />
                )}
              </div>
              <div className='separator'></div>
            </div>
          ))}
        </ul>

        <div className='titleList'> Properties List </div>
        <ul className='typeList'>
          {this.state.properties.map((value, index) => (
            <div key={index} className='itemList'>
              <div
                className={'selector'}
                onClick={event => this.selectProperties(index)}
              >
                <Typography
                  color={
                    this.state.selectedProperties === index
                      ? '#FFF600'
                      : 'white'
                  }
                >
                  {value.property_name}
                </Typography>
                {this.state.selectedProperties === index && (
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
