import { Box } from '@mui/material'
import { Component, React } from 'react'
import './StagnantUI.css'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'

import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'

export class StagnantUI extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className='stagnantCanva'>
        <div className='toolBar'>
          <div className='roundButton'>
            <AddIcon />
          </div>
          <div className='roundButton'>
            <PanToolAltIcon />
          </div>
          <div className='roundButton'>
            <NearMeOutlinedIcon />
          </div>
          <div className='roundButton'>
            <DeleteIcon />
          </div>
          <div className='roundButton'>
            <ContentCopyIcon />
          </div>
        </div>
      </div>
    )
  }
}
