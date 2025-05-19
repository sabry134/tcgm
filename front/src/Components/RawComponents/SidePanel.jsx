import React, { Component, ReactNode } from 'react';
import { Container } from "@mui/material";

/**
 * SidePanel component for displaying components on the side.
 * It wraps its children in a styled container.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered inside the SidePanel.
 *
 * @returns {JSX.Element} The rendered SidePanel component.
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
      <Container
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          py: 2,
          width: '15%',
          bgcolor: 'primary.main',
        }}
        >
        {React.Children.map(children, (child, index) => (
          <Container
            key={index}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              bgcolor: 'primary.light',
            }}>
            {child}
          </Container>
        ))}
      </Container>
    );
  }
}