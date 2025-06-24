import React, { Component, ReactNode } from 'react';
import { Box } from "@mui/material";

/**
 * SidePanel component for displaying components on the side.
 * It wraps its children in a styled container.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered inside the SidePanel.
 * @returns {JSX.Element} The rendered SidePanel component.
 *
 * @example
 *
 * <SidePanel>
 *   <ChildComponent1 />
 *   <ChildComponent2 />
 *   <ChildComponent3 />
 *   ...
 *   <ChildComponentN />
 * </SidePanel>
 */

type Props = {
  children?: ReactNode;
}

export class SidePanel extends Component<Props> {
  render() {
    const { children } = this.props;

    return (
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
          width: '15%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Box
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1,
              gap: 4,
              bgcolor: 'primary.light',
            }}
          >
            {children}
          </Box>
      </Box>
    );
  }
}