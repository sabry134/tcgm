import { React, useRef, useState } from 'react'
import './StagnantUI.css'
import shallowEqualObject from 'shallowequal'
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

const StagnantUI = ({ createNewComponnent }) => {
  const [open, setOpen] = useState(false)
  const [tool, setTool] = useState(0)
  const anchorRef = useRef(null)

  const openAddMenu = () => {
    setOpen(!open)
  }
  const addText = event => {
    setOpen(!open)
    createNewComponnent('text')
  }

  const addBox = event => {
    setOpen(!open)
    createNewComponnent('text')
  }
  const addImage = event => {
    setOpen(!open)
    createNewComponnent('image')
  }

  const addNum = event => {
    setOpen(!open)
    createNewComponnent('number')
  }

  const selectButton = event => {
    localStorage.setItem('editTool', 'select')
    setTool(0)
  }
  const panButton = event => {
    localStorage.setItem('editTool', 'pan')
    setTool(1)
  }

  const deleteButton = event => {
    const property = localStorage.getItem('propertySelected')
    if (!property) return
    window.dispatchEvent(new Event('delete'))
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
          if (!data || i >= data.length) {
            saveNewCardTypesPropertiesRequest(tmpProperties[i])
            continue
          }

          if (
            data &&
            !shallowEqualObject(
              JSON.stringify(tmpProperties[i]),
              JSON.stringify(data[i])
            )
          ) {
            editCardTypesPropertyByIdRequest(
              tmpProperties[i],
              tmpProperties[i].id
            )
          }
        }
        window.dispatchEvent(new Event('componnentCreated'))
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
            <MenuItem onClick={addText}> Text Field </MenuItem>
            <MenuItem onClick={addBox}> Box </MenuItem>
            <MenuItem onClick={addNum}> Number </MenuItem>
            <MenuItem onClick={addImage}> Image </MenuItem>
          </div>
        </Popper>
        <div className='roundButton' onClick={deleteButton}>
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
