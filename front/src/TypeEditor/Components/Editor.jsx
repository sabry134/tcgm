import { Component, React } from 'react'
import StagnantUI from './StagnantUI'
import { TCGMTextField } from './Properties/PropertiesTextField'
import { Box } from '@mui/material'
import './Editor.css'
import { saveNewCardTypesPropertiesRequest } from '../../Api/cardTypesPropertiesRequest'
export class Editor extends Component {
  constructor (props) {
    super(props)
    localStorage.setItem('editTool', 'select')
    this.state = {
      properties: [],
      idSelected: -1,
      dragged: false,
      position_x: 0,
      position_y: 0,
      offsetX: 0,
      offsetY: 0
    }
  }

  componentDidMount () {
    window.addEventListener('storeProperties', this.handlePropertiesSet)
  }
  componentWillUnmount () {
    window.removeEventListener('storeProperties', this.handlePropertiesSet)
  }

  handlePropertiesSet = () => {
    const tmp = JSON.parse(localStorage.getItem('currentTypeProperties'))
    this.setState({ properties: tmp })
  }

  handleOnDragStart = event => {
    // Calculate offset from mouse to element's top-left corner
    if (this.state.idSelected === -1) return

    const mainArea = document.querySelector('.editor')
    const mainRect = mainArea.getBoundingClientRect()

    const offsetX = event.clientX - this.state.position_x
    const offsetY = event.clientY - this.state.position_y

    this.setState({
      dragged: true,
      offsetX,
      offsetY
    })
  }

  handleDrag = event => {
    if (this.state.dragged) {
      this.setState({
        position: {
          x: event.clientX - this.state.offsetX,
          y: event.clientY - this.state.offsetY
        }
      })
    }
  }

  handleOnDragEnd = () => {
    if (this.state.idSelected === -1) return
    const tmpproperties = this.state.properties
    tmpproperties[this.state.idSelected] = {
      ...tmpproperties[this.state.idSelected],
      position_x: this.state.position_x,
      position_y: this.state.position_y
    }
    this.setState({ properties: tmpproperties })
    localStorage.setItem('currentTypeProperties', JSON.stringify(tmpproperties))
    this.setState({ dragged: false })
  }

  addTextField = () => {
    const typeId = localStorage.getItem('currentTypeSeleceted')

    const tmpProperties = {
      property_name: 'TextField',
      cardtype_id: typeId,
      type: 'text',
      value: 'Text',
      variant: [],
      mutable: true,
      font: 'Arial',
      font_size: 12,
      font_color: 'black',
      position_x: 50,
      position_y: 50,
      rotation: 0,
      border_width: 0,
      border_color: 'black',
      border_radius: 0,
      scale_x: 1,
      scale_y: 1,
      opacity: 1
    }

    this.setState(prevState => {
      const newProperties = [...prevState.properties, tmpProperties]
      localStorage.setItem(
        'currentTypeProperties',
        JSON.stringify(newProperties)
      )
      return { properties: newProperties }
    })
  }

  switchProperties (value, index, selected) {
    switch (value.type) {
      case 'text': {
        return (
          <TCGMTextField
            value={value.value}
            positionX={selected ? this.state.position_x : value.position_x}
            positionY={selected ? this.state.position_y : value.position_y}
          />
        )
      }
      default: {
        return <Box />
      }
    }
  }

  handleSelectedOnClick = (event, index) => {
    event.stopPropagation()
    window.dispatchEvent(new Event('ComponnentSelected'))
    this.setState({
      idSelected: index,
      position_x: this.state.properties[index].position_x,
      position_y: this.state.properties[index].position_y
    })
  }

  handleDeselectedOnClick = () => {
    this.setState({ idSelected: -1 })
  }

  render () {
    return (
      <Box
        onMouseDown={this.handleOnDragStart}
        onMouseMove={this.handleDrag}
        onMouseLeave={this.handleOnDragEnd}
        onMouseUp={this.handleOnDragEnd}
        onClick={this.handleDeselectedOnClick}
        className='editor'
      >
        <StagnantUI addTextField={this.addTextField} />
        {this.state.properties.map((value, index) => (
          <div
            key={index}
            onClick={event => this.handleSelectedOnClick(event, index)}
          >
            {this.switchProperties(
              value,
              index,
              this.state.idSelected === index
            )}
          </div>
        ))}
      </Box>
    )
  }
}
