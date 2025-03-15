import { React, useRef, useState } from 'react'
import './StagnantUI.css'
import shallowEqual from 'shallowequal'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'
import { MenuItem, Popper } from '@mui/material'
import { Save } from '@mui/icons-material'
import {
  saveNewCardTypesPropertiesRequest,
  getCardTypesPropertiesbyTypeRequest,
  editCardTypesPropertyByIdRequest
} from '../../Api/cardTypesPropertiesRequest'
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

  // saves the properties changed to do so:
  // it checks every property inside back and then compare it to the one in local storage if one is missing or changed saves it
  const saveButton = event => {
    const tmpProperties = JSON.parse(
      localStorage.getItem('currentTypeProperties')
    )
    const typeId = localStorage.getItem('currentTypeSelected')
    try {
      getCardTypesPropertiesbyTypeRequest(typeId).then(data => {
        for (let i = 0; i < tmpProperties.length; i++) {
          if (i >= data.length) {
            saveNewCardTypesPropertiesRequest(tmpProperties[i])
          }
          if (!shallowEqual(tmpProperties[i], data[i])) {
            editCardTypesPropertyByIdRequest(
              tmpProperties[i],
              tmpProperties[i].id
            )
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
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
        <div className='roundButton' onClick={saveButton}>
          <Save />
        </div>
      </div>
    </div>
  )
}

export default StagnantUI
