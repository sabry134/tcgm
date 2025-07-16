import { Component } from 'react'
import { VisualProperties } from './VisualProperties'

export class TCGMTextField extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const backgroundColor = this.props.data.background_color ?? [0, 0, 0, 0]
    const fontColor = this.props.data.font_color ?? [0, 0, 0, 0]

    return (
      <VisualProperties
        selected={this.props.selected}
        x={this.props.positionX}
        y={this.props.positionY}
        zIndex={this.props.data.z_axis}
      >
        <div
          style={{
            rotate: `${this.props.data.rotation}deg`,
            opacity: this.props.data.opacity,
            fontSize: this.props.data.font_size,
            width: this.props.data.width,
            fontFamily: this.props.data.font,
            height: this.props.data.height,
            backgroundColor: `rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, ${backgroundColor[3]})`,
            color: `rgba(${fontColor[0]}, ${fontColor[1]}, ${fontColor[2]}, ${fontColor[3]})`
          }}
        >
          {this.props.data.value}
        </div>
      </VisualProperties>
    )
  }
}
