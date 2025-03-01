import { React, useRef, useState } from 'react'
import './StagnantUI.css'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'

import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'
import { MenuItem, Popper } from '@mui/material'
const StagnantUI = ({ addTextField }) => {
  const [open, setOpen] = useState(false)
  const [tool, setTool] = useState(0)
  const anchorRef = useRef(null)

  const openAddMenu = () => {
    setOpen(!open)
  }
  const addText = event => {
    setOpen(!open)
    addTextField()
  }
  const selectButton = event => {
    localStorage.setItem('editTool', 'select')
    setTool(0)
  }
  const panButton = event => {
    localStorage.setItem('editTool', 'pan')
    setTool(1)
  }

  return (
    <div className='stagnantCanva'>
      <div className='toolBar'>
        <div
          onClick={selectButton}
          className={tool === 0 ? 'roundButton selected' : 'roundButton'}
        >
          <NearMeOutlinedIcon />
        </div>
        <div
          onClick={panButton}
          className={tool === 1 ? 'roundButton selected' : 'roundButton'}
        >
          <PanToolAltIcon />
        </div>
        <div className='verticalSeparator' />
        <div onClick={openAddMenu} className='roundButton' ref={anchorRef}>
          <AddIcon />
        </div>
        <Popper anchorEl={anchorRef.current} open={open}>
          <div className='subAddMenu'>
            {/* We need to add icon to menu item */}
            <MenuItem onClick={addText}> Text Field </MenuItem>
            <MenuItem> Image </MenuItem>
            <MenuItem> Icon </MenuItem>
          </div>
        </Popper>
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

export default StagnantUI
