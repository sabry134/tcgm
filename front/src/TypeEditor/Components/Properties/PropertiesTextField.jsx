import { Component } from 'react'
import { VisualProperties } from './VisualProperties'

export class TCGMTextField extends Component {
  render () {
    return (
      <VisualProperties x={this.props.position.x} y={this.props.position.y}>
        <div>{this.props.value}</div>
      </VisualProperties>
    )
  }
}
