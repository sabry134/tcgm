import { Box } from '@mui/material'
import { Component, React } from 'react'
import './StagnantUI.css'
import AddIcon from '@mui/icons-material/Add'

export class StagnantUI extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className='stagnantCanva'>
        <div className='addButton'>
          <AddIcon />
        </div>
      </div>
    )
  }
}
