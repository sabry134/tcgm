import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Divider, Popper, Stack, Typography } from "@mui/material";
import { FormInput } from "../FormInput/FormInput";

/**
 * Popup component for displaying a modal dialog with input fields and buttons.
 * @param {Object} props - The component props.
 * @param {string} props.id - ID for the Popper component.
 * @param {boolean} props.open - Is the popup open or closed.
 * @param {HTMLElement} props.anchorEl - Element to anchor the popup to.
 *
 * @param {Function} props.closeCallback - Callback function to close.
 * @param {Function} props.receivedCallback - Callback function to handle received data.
 * @param {string} props.title - Title of the popup.
 * @param {Array} props.inputName - Array of input field names.
 *
 * @returns {JSX.Element} The rendered Popup component.
 * @example
 * <Popup
 *  closeCallback={handleClose}
 *  receivedCallback={handleReceived}
 *  title="My Popup"
 *  inputName={['Input 1', 'Input 2']}
 *  id="my-popup"
 *  anchorEl={anchorElement}
 *  open={isOpen}
 *  />
 */

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
            sx={{
              width: '50vw',
              height: '50vh',
              left: '25vw',
              top: '25vh',
              borderRadius: 2,
              position: 'relative',
              display: 'flex',
              py: 5,
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'primary.main',
            }}
            className={styles.bodyPopup}
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
              <Typography variant={'h5'} fontWeight={600} color={"primary.contrastText"}>
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

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '50%',
                  paddingTop: '2vw'
                }}
              >
                <Button
                  onClick={this.closeCallback}
                  color={'error'}
                  variant={'contained'}
                  size={'large'}
                >
                  Cancel
                </Button>

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
              </Box>

            </Stack>

          </Box>
        </div>
      </Popper>
    );
  }
}