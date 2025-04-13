import { Component } from 'react'
import { VisualProperties } from './VisualProperties'
import { Box } from '@mui/material'

export class TCGMBox extends Component {
  constructor (props) {
    super(props)
    console.log(this.props.data)
  }

  render () {
    return (
      <VisualProperties
        selected={this.props.selected}
        x={this.props.positionX}
        y={this.props.positionY}
        zIndex={this.props.data.z_axis}
      >
        <Box
          sx={{
            backgroundColor: this.props.data.backgroundColor,
            rotate: this.props.data.rotation,
            borderWidth: this.props.data.border_width,
            borderColor: `rgba(${this.props.data.border_color[0]}, ${this.props.data.border_color[1]}, ${this.props.data.border_color[2]}, ${this.props.data.border_color[3]})`,
            borderRadius: this.props.data.borderRadius,
            width: this.props.data.width * this.props.data.scale_x,
            height: this.props.data.height * this.props.data.scale_y,
            borderStyle: 'solid',
            bgcolor: `rgba(${this.props.data.background_color[0]}, ${this.props.data.background_color[1]}, ${this.props.data.background_color[2]}, ${this.props.data.background_color[3]})`
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
