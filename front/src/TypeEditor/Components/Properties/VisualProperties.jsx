import { Component } from 'react'
import './Properties.css'
import { width } from '@mui/system'

export class VisualProperties extends Component {
  render () {
    return (
      <div
        style={{
          left: this.props.x,
          top: this.props.y,
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
