import { Component } from 'react'
import { CardTypeDisplay } from '../../TypeEditor/Components/CardTypeDisplay'
import { getCardTypesPropertiesbyTypeRequest } from '../../Api/cardTypesPropertiesRequest'

export class TCGMCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardData: {},
      properties: []
    }
  }

  componentDidMount () {
    this.handleStorageChange()
    window.addEventListener('storage', this.handleStorageChange)
  }

  componentWillUnmount () {
    window.removeEventListener('storage', this.handleStorageChange)
  }

  handleStorageChange = event => {
    const storedData = localStorage.getItem('currentEditedCard')
    if (storedData) {
      const data = JSON.parse(storedData).card
      if (data) {
        try {
          getCardTypesPropertiesbyTypeRequest(data.card_type_id).then(
            response => {
              this.setState({ cardData: data, properties: response })
            }
          )
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  render () {
    return (
      <CardTypeDisplay
        properties={this.state.properties ?? []}
        idSelected={-1}
      />
    )
  }
}
