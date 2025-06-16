import React, { Component } from "react";
import { Stack, ToggleButtonGroup } from "@mui/material";
import { TopBarIconButton } from "./TopBarButton";
import { Close } from "@mui/icons-material";
import { ROUTES } from "../../Routes/routes";
import { withRouterProps } from "../../Utility/HocNavigation";

class GameMainPageTopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: 'none'
    };
  }

  handleSelectionChange = (event, newSelection) => {
    if (newSelection !== null) {
      this.setState({ selection: newSelection });
      // Here you can add logic to handle the selection change, e.g., navigate to a different page or update the state
      console.log(`Selected: ${newSelection}`);
    }
  }

  unselectGame = () => {
    if (localStorage.getItem('gameSelected')) {
      localStorage.setItem('gameSelected', false);
    }
    this.props.navigate(ROUTES.HOME);
  }

  render() {
    return (
      <ToggleButtonGroup
        value={this.state.selection}
        exclusive
        onChange={this.handleSelectionChange}
        aria-label="edit navigation bar"
        size={"large"}
        color={"primary"}
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            '&.Mui-selected': {
              border: 'none',
            },
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <TopBarIconButton
            altText="Unselect Game"
            svgComponent={Close}
            event={this.unselectGame}
          />
        </Stack>
      </ToggleButtonGroup>
    )
  }
}

export default withRouterProps(GameMainPageTopBar);