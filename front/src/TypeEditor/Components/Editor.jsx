import { Component, React } from 'react'
import StagnantUI from './StagnantUI'
import { TCGMTextField } from './Properties/PropertiesTextField'
import { Box } from '@mui/material'
import './Editor.css'
import { TCGMBox } from './Properties/TCGMBox'

const defaultProperties = {
  property_name: 'Property',
  cardtype_id: '',
  type: 'text',
  value: 'Text',
  variant: [],
  mutable: true,
  width: 50,
  height: 50,
  font: 'Arial',
  font_size: 12,
  font_color: [0, 0, 0, 0],
  background_color: [25, 25, 25, 1],
  position_x: 50,
  position_y: 50,
  rotation: 0,
  border_width: 0,
  border_color: [0, 0, 0, 0],
  border_radius: 0,
  scale_x: 1,
  scale_y: 1,
  opacity: 1,
  image: '',
  image_width: 0,
  image_heigth: 0,
  image_position_x: 0,
  image_position_y: 0,
  image_rotation: 0,
  image_scale_x: 0,
  image_scale_y: 0,
  image_opacity: 0,
  z_axis: 0
}

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
    if (this.state.idSelected === -1)
      localStorage.removeItem('propertySelected')
    window.addEventListener('storage', this.handlePropertyChange)
    window.addEventListener('delete', this.handleDelete)

    window.addEventListener('storeProperties', this.handlePropertiesSet)
  }
  componentWillUnmount () {
    window.removeEventListener('storage', this.handlePropertiesSet)
    window.removeEventListener('storeProperties', this.handlePropertyChange)
    window.removeEventListener('delete', this.handleDelete)
  }

  handleDelete = () => {
    this.state.properties.splice(this.state.idSelected, 1)
  }

  handlePropertyChange = () => {
    const tmpProperties = this.state.properties

    const currentPropertySelected = JSON.parse(
      localStorage.getItem('propertySelected')
    )

    tmpProperties[this.state.idSelected] = currentPropertySelected

    this.setState({
      properties: tmpProperties,
      position_x: currentPropertySelected.position_x,
      position_y: currentPropertySelected.position_y
    })
  }

  handlePropertiesSet = () => {
    const tmp = JSON.parse(localStorage.getItem('currentTypeProperties'))
    this.setState({ properties: tmp ?? [] })
  }

  handleOnDragStart = event => {
    // Calculate offset from mouse to element's top-left corner
    if (this.state.idSelected === -1) return

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
        position_x: event.clientX - this.state.offsetX,
        position_y: event.clientY - this.state.offsetY
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
    this.setState({ properties: tmpproperties, dragged: false })
    localStorage.setItem('currentTypeProperties', JSON.stringify(tmpproperties))
  }

  createNewComponnent = type => {
    const typeId = localStorage.getItem('currentTypeSelected')
    let newProperties = defaultProperties
    newProperties.cardtype_id = typeId
    newProperties.type = type

    this.setState(prevState => {
      const tmpProperties = [...prevState.properties, newProperties]
      localStorage.setItem(
        'currentTypeProperties',
        JSON.stringify(tmpProperties)
      )
      return { properties: tmpProperties }
    })
  }

  switchProperties (value, index, selected) {
    let data = value
    if (index === this.state.idSelected) {
      data = localStorage.getItem('propertySelected')
    }
    switch (value.type) {
      case 'text': {
        return (
          <TCGMTextField
            data={value}
            selected={selected}
            positionX={selected ? this.state.position_x : value.position_x}
            positionY={selected ? this.state.position_y : value.position_y}
          />
        )
      }
      case 'box': {
        return (
          <TCGMBox
            data={value}
            selected={selected}
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
    localStorage.setItem(
      'propertySelected',
      JSON.stringify(this.state.properties[index])
    )

    window.dispatchEvent(new Event('ComponnentSelected'))

    this.setState({
      idSelected: index,
      position_x: this.state.properties[index].position_x,
      position_y: this.state.properties[index].position_y
    })
  }

  handleDeselectedOnClick = () => {
    localStorage.removeItem('propertySelected')
    window.dispatchEvent(new Event('ComponnentSelected'))
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
        <StagnantUI createNewComponnent={this.createNewComponnent} />
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
