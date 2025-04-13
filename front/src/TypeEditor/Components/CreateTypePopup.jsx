import { Component, React } from 'react'
import { Box, Button } from '@mui/material'
import { FormInput } from '../../Components/FormInput'
import CloseIcon from '@mui/icons-material/Close'
import { createCardTypeRequest } from '../../Api/cardTypesRequest'
import { TCGMButton } from '../../Components/TCGMButton'
import './CreateTypePopup.css'

export class CreateTypePopup extends Component {
  constructor (props) {
    super(props)
    this.closeCallback = props.closeCallback
    this.name = ''
  }

  onChangeName = event => {
    this.name = event.target.value
  }

  onClickCreate = event => {
    this.setState({ clicked: true })
    createCardTypeRequest({
      cardType: {
        name: this.name,
        game_id: localStorage.getItem('gameSelected'),
        properties: []
      }
    })
    this.closeCallback()
  }

  render () {
    return (
      <div className='background' onClick={this.closeCallback}>
        <Box
          alignItems={'center'}
          className='body'
          onClick={event => event.stopPropagation()}
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            width={'100%'}
          >
            <Box marginLeft='40px'>NEW TYPE</Box>
            <Button color='white' onClick={this.closeCallback}>
              <CloseIcon />
            </Button>
          </Box>
          <div className='separator' />
          <FormInput label={'Name'} onChange={this.onChangeName} />
          <TCGMButton onClick={this.onClickCreate}>Create</TCGMButton>
        </Box>
      </div>
    )
  }
}
