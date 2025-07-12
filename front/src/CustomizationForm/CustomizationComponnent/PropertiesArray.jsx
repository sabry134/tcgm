import React, { Component } from 'react'
import { CustomInput } from './CustomInput'

export class PropertiesArray extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.path,
      localStorageName: props.localStorageName,
      data: []
    }
  }
  getValueByPath (obj, path) {
    if (!path) return ''
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }
  componentDidMount (prevProps) {
    this.setState({
      data: this.getValueByPath(
        JSON.parse(
          localStorage.getItem(
            this.state.localStorageName ?? 'currentEditedCard'
          )
        ),
        this.props.name
      )
    })
  }

  setValueByPath (obj, path, value, index) {
    const parts = path.split('.')
    const lastPart = parts.pop()
    const lastObj = parts.reduce((acc, part) => acc[part], obj)

    lastObj[lastPart][index].value = value // Set the new value
  }

  handleChange = (event, index) => {
    const newValue = event.target.value
    this.state.data[index].value = newValue
    this.setState({ data: this.state.data })

    // Send update to backend (or localStorage for temporary saving)
    this.updateJsonFile(newValue, index)
  }

  // Simulating JSON file update
  updateJsonFile = (newValue, index) => {
    const storedCard = localStorage.getItem(
      this.props.localStorageName ?? 'currentEditedCard'
    )
    const parsedCard = JSON.parse(storedCard)
    this.setValueByPath(parsedCard, this.props.name, newValue, index)
    console.log(parsedCard)
    localStorage.setItem(
      this.props.localStorageName ?? 'currentEditedCard',
      JSON.stringify(parsedCard)
    )
    window.dispatchEvent(new Event('storage'))
  }

  render () {
    return (
      <div
        style={{
          padding: '10px',
          borderRadius: '5px'
        }}
      >
        {this.state.data.map((property, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              paddingBottom: '10px'
            }}
          >
            <div>
              <span style={{ marginLeft: '10px' }}>{property.name}</span>
            </div>
            <div>
              {(() => {
                switch (true) {
                  case typeof property.value === 'string':
                    return (
                      <input
                        className='customInput'
                        id='standard-basic'
                        variant='standard'
                        value={property.value}
                        onChange={event =>
                          this.handleChange(event, index, 'value_string')
                        }
                      />
                    )
                  case typeof property.value_number === 'number':
                    return null
                  //   <NumberInput
                  //      name={path} localStorageName={localStorageName}
                  //   />
                  case typeof property.value_boolean === 'boolean':
                    return null
                  //   <CustomCheckbox
                  //      name={path} localStorageName={localStorageName}
                  //   />
                  default:
                    return null
                }
              })()}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
