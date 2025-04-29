import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Popper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FormInput } from "../FormInput/FormInput";
import { createGameRequest } from "../../Api/gamesRequest";

export class Popup extends Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.open = props.open;
    this.anchorEl = props.anchorEl;
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
    createGameRequest({
      game: { name: this.name, description: this.description }
    })
    this.closeCallback()
  }

  render() {
    return (
      <Popper id={this.props.id} open={this.props.open} anchorEl={this.props.anchorEl}>
        <div className={styles.background} onClick={this.closeCallback}>
          <Box
            alignItems={'center'}
            className='body'
            onClick={event => event.stopPropagation()}
          >
            {/*<Box*/}
            {/*  display={'flex'}*/}
            {/*  flexDirection={'row'}*/}
            {/*  alignItems={'center'}*/}
            {/*  justifyContent={'space-between'}*/}
            {/*  width={'100%'}*/}
            {/*>*/}
            {/*  <Box marginLeft='40px'>CREATE GAME</Box>*/}
            {/*  <Button color='white' onClick={this.closeCallback}>*/}
            {/*    <CloseIcon />*/}
            {/*  </Button>*/}
            {/*</Box>*/}

            {/*<div className='separator' />*/}

            {/*<FormInput label={'Name'} onChange={this.onChangeName} />*/}
            {/*<FormInput*/}
            {/*  label={'Description'}*/}
            {/*  onChange={this.onChangeDescription}*/}
            {/*/>*/}

            {/*<div*/}
            {/*  onClick={this.onClickCreate}*/}
            {/*  className={this.state.clicked ? 'button click' : 'button'}*/}
            {/*>*/}
            {/*  Create*/}
            {/*</div>*/}

          </Box>
        </div>
      </Popper>
    );
  }
}