import { Component } from 'react'
import { VisualProperties } from './VisualProperties'
import { Box } from '@mui/material'

export class TCGMBox extends Component {
  render () {
    //TODO(): when back is done changing properties remove those props values
    const backgroundColor =
      this.props.data.background_color ?? this.props.data.font_color
    const width = this.props.data.width ?? this.props.data.image_width
    const height = this.props.data.height ?? this.props.data.image_height

    return (
      <VisualProperties
        selected={this.props.selected}
        x={this.props.positionX}
        y={this.props.positionY}
        zIndex={this.props.data.z_axis}
      >
        <Box
          sx={{
            backgroundColor: backgroundColor,
            rotate: `${this.props.data.rotation}deg`,
            borderWidth: `${this.props.data.border_width}px`,
            borderColor: `rgba(${this.props.data.border_color[0]}, ${this.props.data.border_color[1]}, ${this.props.data.border_color[2]}, ${this.props.data.border_color[3]})`,
            borderRadius: this.props.data.borderRadius,
            width: width * this.props.data.scale_x,
            height: height * this.props.data.scale_y,
            borderStyle: 'solid',
            opacity: this.props.data.opacity,
            bgcolor: `rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, ${backgroundColor[3]})`
          }}
        >
          <img
            src={this.props.data.value}
            alt=''
            width={'100%'}
            height={'100%'}
          ></img>
        </Box>
      </VisualProperties>
    )
  }
}
