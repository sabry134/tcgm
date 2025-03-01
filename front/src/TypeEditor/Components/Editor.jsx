import { Component, React } from 'react'
import StagnantUI from './StagnantUI'
import { TCGMTextField } from './Properties/PropertiesTextField'
import { Box } from '@mui/material'
export class Editor extends Component {
  constructor (props) {
    super(props)
    localStorage.setItem('editTool', 'select')
    this.state = {
      properties: [],
      idSelected: -1,
      dragged: false,
      position: { x: 0, y: 0 },
      offsetX: 0,
      offsetY: 0
    }
  }

  handleOnDragStart = event => {
    // Calculate offset from mouse to element's top-left corner
    if (this.state.idSelected === -1) return

    const mainArea = document.querySelector('.editor')
    const mainRect = mainArea.getBoundingClientRect()
    const rect = event.target.getBoundingClientRect()

    const offsetX = mainRect.left + event.clientX - rect.left
    const offsetY = mainRect.top + event.clientY - rect.top

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
    //set properties of state and local storage
    this.setState({ dragged: false })
  }

  addTextField = () => {
    this.setState(prevState => {
      const newProperties = [
        ...prevState.properties,
        {
          type: 'text',
          value: 'Text Field',
          position: { x: '50%', y: '50%' }
        }
      ]
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
            position={selected ? this.state.position : value.position}
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
    this.setState({ idSelected: index })
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
          <Box
            key={index}
            onClick={event => this.handleSelectedOnClick(event, index)}
          >
            {this.switchProperties(
              value,
              index,
              this.state.idSelected === index
            )}
          </Box>
        ))}
      </Box>
    )
  }
}

// revoir les calcul
// montrer quand qqc est selected
// add right pannel customization possibility
