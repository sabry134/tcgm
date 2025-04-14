import { Component } from 'react'
import { VisualProperties } from './VisualProperties'

export class TCGMTextField extends Component {
  render () {
    return (
      <VisualProperties
        selected={this.props.selected}
        x={this.props.positionX}
        y={this.props.positionY}
        zIndex={this.props.data.z_axis}
      >
        <div>{this.props.data.value}</div>
      </VisualProperties>
    )
  }
}
