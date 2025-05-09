import React, { Component } from 'react';
import styles from './Popup.module.css'
import { Box, Button, Popper, Stack, Typography } from "@mui/material";
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
        <div onClick={this.closeCallback} className={styles.backdrop}>

          <Box
            sx={{
              borderRadius: 2,
              py: 2,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'primary.main',
              boxShadow: 2,
            }}
            className={styles.positionPopup}
            onClick={event => event.stopPropagation()}
          >

            <Stack alignItems={'center'} spacing={2}>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'primary.light',
                  py: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant={'h5'} fontWeight={600} color={"primary.contrastText"}>
                  {this.title}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'primary.light',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
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
                    justifyContent: 'space-evenly',
                    pt: 5,
                  }}
                >
                  <Button
                    onClick={this.closeCallback}
                    sx={{
                      backgroundColor: 'error.main',
                      '&:hover': { backgroundColor: 'error.light' },
                      '&:clicked': { backgroundColor: 'error.dark' }
                    }}
                    variant={'contained'}
                    size={'large'}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.onSubmit}
                    sx={{
                      backgroundColor: 'success.main',
                      '&:hover': { backgroundColor: 'success.light' },
                      '&:clicked': { backgroundColor: 'success.dark' }
                    }}
                    variant={'contained'}
                    size={'large'}
                  >
                    Create
                  </Button>

                </Box>
              </Box>
            </Stack>
          </Box>
        </div>
      </Popper>
    );
  }
}