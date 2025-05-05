import { Paper } from '@mui/material'
import React, { Component } from 'react'
import JsonToForm from '../../CustomizationForm/JsonToForm'
import txt from '../Data/TestBackTypes.json'

export class RightPanel extends Component {
  render () {
    return (
      <Paper
        className='settings'
        sx={{
          width: '30vw',
          bgcolor: '#5d3a00',
          color: 'white',
          height: '100%',
          borderRadius: 0
        }}
      >
        <JsonToForm data={txt}></JsonToForm>
      </Paper>
    )
  }
}
