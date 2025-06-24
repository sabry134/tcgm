import { Component } from 'react'
import { Button, Typography } from "@mui/material";

/**
 * TCGMButton is a custom button component styled for the TCGM application.
 * It uses Material-UI's Button and Typography components to create a large, contained button
 * with specific styles for background color and hover effects.
 *
 * @extends Component
 * @param {Object} props - The component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {string} props.text - Optional text to display inside the button.
 * @returns {JSX.Element} The rendered TCGMButton component.
 *
 * @example
 * <TCGMButton
 *  onClick={() => console.log('Button clicked!')}
 *  text="Click Me"
 * />
 */

export class TCGMButton extends Component {
  render() {
    return (
      <Button
        onClick={this.props.onClick}
        variant="contained"
        size="large"
        sx={{
          bgcolor: "secondary.main",
          '&:hover': { bgcolor: "secondary.light" },
          '&:clicked': { bgcolor: "secondary.dark" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        {this.props.text && (
          <Typography variant={"body1"} fontWeight={500} color={"secondary.contrastText"}>
            {this.props.text}
          </Typography>
        )}

      </Button>
    )
  }
}