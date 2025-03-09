import { Component } from 'react'
import { VisualProperties } from './VisualProperties'

export class TCGMTextField extends Component {
  render () {
    return (
      <VisualProperties x={this.props.positionX} y={this.props.positionY}>
        <div>{this.props.value}</div>
      </VisualProperties>
    )
  }
}
