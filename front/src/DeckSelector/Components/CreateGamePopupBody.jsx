import { Component, React } from 'react'
import { Box, Button } from '@mui/material'
import './CreateGamePopupBody.css'
import { FormInput } from '../../Components/FormInput'
import CloseIcon from '@mui/icons-material/Close'
import { createCollectionRequest } from '../../Api/collectionsRequest'

export class CreateGamePopupBody extends Component {
  constructor (props) {
    super(props)
    this.closeCallback = props.closeCallback
    this.name = ''
    this.description = ''
    this.state = {
      clicked: false
    }
  }

  onChangeName = event => {
    this.name = event.target.value
  }

  onChangeDescription = event => {
    this.description = event.target.value
  }

  onClickCreate = event => {
    this.setState({ clicked: true })
    createCollectionRequest({
      card_collection: { name: this.name, quantity: 0, game_id: 105, user_id: 37, type: 'deck' }
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
            <Box marginLeft='40px'>CREATE DECK</Box>
            <Button color='white' onClick={this.closeCallback}>
              <CloseIcon />
            </Button>
          </Box>
          <div className='separator' />
          <FormInput label={'Name'} onChange={this.onChangeName} />
          <div
            onClick={this.onClickCreate}
            className={this.state.clicked ? 'button click' : 'button'}
          >
            Create
          </div>
        </Box>
      </div>
    )
  }
}
