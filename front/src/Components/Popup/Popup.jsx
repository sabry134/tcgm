import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Divider, Popper, Stack, Typography } from "@mui/material";
import { FormInput } from "../FormInput/FormInput";
import { createGameRequest } from "../../Api/gamesRequest";

type PopupProps = {
  id: string,
  open: boolean,
  anchorEl: HTMLElement | null,
  closeCallback: () => void,
  title: string,
  inputName: [string],
}

export class Popup extends Component<PopupProps> {
  constructor(props) {
    super();
    this.id = props.id;
    this.open = props.open;
    this.anchorEl = props.anchorEl;
    this.closeCallback = props.closeCallback
    this.title = props.title;
    this.inputName = props.inputName;
    this.inputContent = props.inputName.map(() => '');
    this.state = {
      clicked: false
    }
  }

  // onChangeName = event => {
  //   this.name = event.target.value
  // }
  //
  // onChangeDescription = event => {
  //   this.description = event.target.value
  // }

  onChangeInput = (event, index) => {
    this.inputContent[index] = event.target.value;
  }

  // onClickCreate = () => {
  //   this.setState({ clicked: true })
  //   createGameRequest({
  //     game: { name: this.name, description: this.description }
  //   }).then()
  //   this.closeCallback()
  // }

  render() {
    return (
      <Popper id={this.id} open={this.open} anchorEl={this.anchorEl}>
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
              {this.inputName.map((name, index) => (
                <FormInput
                  label={name}
                  onChange={(event) => this.onChangeInput(event, index)}
                />
              ))}

              {/*<FormInput*/}
              {/*  label={'Name'}*/}
              {/*  onChange={this.onChangeName}*/}
              {/*/>*/}
              {/*<FormInput*/}
              {/*  label={'Description'}*/}
              {/*  onChange={this.onChangeDescription}*/}
              {/*/>*/}

              {/*<Button*/}
              {/*  onClick={this.onClickCreate}*/}
              {/*  sx={{*/}
              {/*    backgroundColor: '#656d4a',*/}
              {/*    '&:hover': {*/}
              {/*      backgroundColor: '#414833'*/}
              {/*    },*/}
              {/*    '&:clicked': {*/}
              {/*      backgroundColor: '#333d29'*/}
              {/*    }*/}
              {/*  }}*/}
              {/*  variant={'contained'}*/}
              {/*  size={'large'}*/}
              {/*>*/}
              {/*  Create*/}
              {/*</Button>*/}
            </Stack>

          </Box>
        </div>
      </Popper>
    );
  }
}