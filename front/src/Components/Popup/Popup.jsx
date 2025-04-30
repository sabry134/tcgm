import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Divider, Popper, Stack, Typography } from "@mui/material";
import { FormInput } from "../FormInput/FormInput";

export class Popup extends Component {
  constructor(props) {
    super();
    this.closeCallback = props.closeCallback;
    this.receivedCallback = props.receivedCallback;
    this.title = props.title;
    this.nameList = props.inputName;
    this.inputFields = [];
  }

  onChangeInput = (event, index) => {
    this.inputFields[index] = event.target.value
  }

  onSubmit = () => {
    if (this.inputFields.length !== this.nameList.length) {
      console.error("Input fields length does not match name list length");
      return;
    }
    if (this.receivedCallback) {
      this.receivedCallback(this.inputFields)
    }
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

              {this.nameList.map((name, index) => (
                <FormInput
                  key={index}
                  label={name}
                  onChange={event => this.onChangeInput(event, index)}
                />
              ))}

              <Button
                onClick={this.onSubmit}
                sx={{
                  backgroundColor: '#656d4a',
                  '&:hover': { backgroundColor: '#414833' },
                  '&:clicked': { backgroundColor: '#333d29' }
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