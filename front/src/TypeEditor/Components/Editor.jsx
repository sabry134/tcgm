import { Box } from '@mui/material'
import { Component, React } from 'react'
import { StagnantUI } from './StagnantUI'

export class Editor extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Box>
        <StagnantUI></StagnantUI>
      </Box>
    )
  }
}
