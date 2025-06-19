import React, { Component } from "react";
import { Stack, ToggleButtonGroup } from "@mui/material";

/**
 * A button group component for the top bar that allows users to select different options.
 * It uses a ToggleButtonGroup from Material-UI for styling and interaction.
 * It is intended to switch between different pages at first, but can be extended to include more complex functionality.
 *
 * @param {Object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to render inside the button group.
 * @return {JSX.Element} The rendered button group component.
 *
 * @example
 * <TopBarButtonGroup>
 *   <TopBarIconButton
 *     event={() => console.log('Button 1 clicked')}
 *     svgComponent={SomeSvgIcon1}
 *    altText="Button 1"
 *    text="Button 1"
 *   />
 *   <TopBarIconButton
 *    event={() => console.log('Button 2 clicked')}
 *    svgComponent={SomeSvgIcon2}
 *    altText="Button 2"
 *    text="Button 2"
 *   />
 * </TopBarButtonGroup>
 */

export class TopBarButtonGroup extends Component {
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
          {this.props.children}
        </Stack>
      </ToggleButtonGroup>
    )
  }
}