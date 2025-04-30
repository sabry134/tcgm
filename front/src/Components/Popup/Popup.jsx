import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Divider, Popper, Stack, Typography } from "@mui/material";
import { FormInput } from "../FormInput/FormInput";
import { createGameRequest } from "../../Api/gamesRequest";

export class Popup extends Component {
  constructor(props) {
    super();
    this.closeCallback = props.closeCallback;
    this.title = props.title;
    this.name = '';
    this.description = '';
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
        <div
          onClick={this.closeCallback}
          className={styles.backdrop}
        >
          <Box
            sx={{ borderRadius: '10px' }}
            alignItems={'center'}
            className={styles.body}
            onClick={event => event.stopPropagation()}
          >
            <Box
              display={'flex'}
              paddingBottom={'2vw'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
            >
              <Typography variant={'h5'} fontWeight={600}>
                {this.title}
              </Typography>
            </Box>

            <Divider orientation={"horizontal"} variant={"middle"} flexItem/>

            <Stack
              spacing={'2vw'}
              paddingTop={'2vw'}
              alignItems={'center'}
            >

              <FormInput
                label={'Name'}
                onChange={this.onChangeName}
              />
              <FormInput
                label={'Description'}
                onChange={this.onChangeDescription}
              />

              <Button
                onClick={this.onClickCreate}
                sx={{
                  backgroundColor: '#656d4a',
                  '&:hover': {
                    backgroundColor: '#414833'
                  },
                  '&:clicked': {
                    backgroundColor: '#333d29'
                  }
                }}
                variant={'contained'}
                size={'large'}
              >
                Create
              </Button>
            </Stack>

          </Box>
        </div>
      </Popper>
    );
  }
}