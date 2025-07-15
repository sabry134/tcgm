import { Component } from 'react'
import { TCGMTextField } from './Properties/PropertiesTextField'
import { TCGMBox } from './Properties/TCGMBox'
import { Box } from '@mui/material'

export class CardTypeDisplay extends Component {
  switchProperties (value, index, selected) {
    let data = value
    if (selected) {
      data = localStorage.getItem('propertySelected')
    }
    switch (value.type) {
      case 'text': {
        return (
          <TCGMTextField
            data={value}
            selected={selected}
            positionX={selected ? this.props.position_x : value.position_x}
            positionY={selected ? this.props.position_y : value.position_y}
          />
        )
      }
      case 'box': {
        return (
          <TCGMBox
            data={value}
            selected={selected}
            positionX={selected ? this.props.position_x : value.position_x}
            positionY={selected ? this.props.position_y : value.position_y}
          />
        )
      }
      case 'number': {
        return (
          <TCGMTextField
            data={value}
            selected={selected}
            positionX={selected ? this.props.position_x : value.position_x}
            positionY={selected ? this.props.position_y : value.position_y}
          />
        )
      }
      default: {
        return <Box />
      }
    }
  }

  handleOnClick = (event, index) => {
    if (this.props.handleSelectedOnClick)
      this.props.handleSelectedOnClick(event, index)
  }

  render () {
    return this.props.properties.map((value, index) => (
      <div
        key={index}
        onClick={event => this.handleOnClick(event, index)}
        style={{
          pointerEvents: this.props.handleSelectedOnClick ? 'auto' : 'none'
        }}
      >
        {this.switchProperties(value, index, this.props.idSelected === index)}
      </div>
    ))
  }
}
