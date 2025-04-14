import { Component } from 'react'
import './Properties.css'
import { width } from '@mui/system'

export class VisualProperties extends Component {
  render () {
    return (
      <div
        style={{
          left: this.props.x - (this.props.selected ? 1 : 0),
          top: this.props.y - (this.props.selected ? 1 : 0),
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none',
          padding: '5px',
          border: this.props.selected ? '1px solid #656d4a' : 'none',
          zIndex: this.props.zIndex
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
