import { Component } from 'react'
import { Button, Typography } from "@mui/material";

export class TCGMButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
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
        <Typography variant={"body1"} fontWeight={500} color={"secondary.contrastText"}>
          {this.props.children}
        </Typography>
      </Button>
    )
  }
}