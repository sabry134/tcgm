import { Paper } from '@mui/material'
import { Component, React } from 'react'

export class RightPanel extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    window.addEventListener('ComponnentSelected', this.handleComponnentSelected)
  }

  render () {
    return (
      <Paper
        className='sidebar'
        sx={{
          width: 250,
          p: 2,
          bgcolor: '#5d3a00',
          color: 'white',
          borderRadius: 0
        }}
      ></Paper>
    )
  }
}
