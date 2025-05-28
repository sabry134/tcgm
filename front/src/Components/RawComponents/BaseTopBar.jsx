import { Box } from "@mui/material";
import React, { Component } from "react";

/**
 * BaseTopBar component for displaying an empty top navigation bar.
 * It wraps its children in a styled Box component.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered inside the BaseTopBar.
 *
 * @returns {JSX.Element} The rendered BaseTopBar component.
 * @example
 * <BaseTopBar>
 *   <ChildComponent1 />
 *   <ChildComponent2 />
 *   <ChildComponent3 />
 *   ...
 *   <ChildComponentN />
 * </BaseTopBar>
 */

export class BaseTopBar extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <Box
        sx={{
          bgcolor: 'primary.dark',
          p: 2,
          display: 'flex',
          justifyContent: 'space-around',
          height: theme => theme.spacing(4),
        }}
      >
        {this.props.children}
      </Box>
    )
  }
}