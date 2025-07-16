import { Component } from 'react'
import { CardTypeDisplay } from '../../TypeEditor/Components/CardTypeDisplay'
import { getCardTypesPropertiesbyTypeRequest } from '../../Api/cardTypesPropertiesRequest'
import { baseRequest } from '../../Api/baseRequest'

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
      const data = JSON.parse(storedData)
      if (data) {
        try {
          getCardTypesPropertiesbyTypeRequest(data.card_type_id).then(
            response => {
              baseRequest('/cardProperties/card/' + data.id, 'GET').then(
                cardProperties => {
                  const newPropertiesData = cardProperties?.map(
                    (value, index) => {
                      const newIndex = response.findIndex(
                        (respvalue, respIndex) =>
                          value.cardtype_property_id === respvalue.id
                      )
                      return {
                        ...response[newIndex],
                        value: data.properties[index].value
                      }
                    }
                  )
                  this.setState({
                    cardData: data,
                    properties: newPropertiesData
                  })
                }
              )
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
