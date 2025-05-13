import React, { Component, ReactNode } from 'react';
import { Container } from "@mui/material";

/**
 * SidePanel component for displaying components on the side.
 * @extends Component
 */

type Props = {
  children: ReactNode;
}

export class SidePanel extends Component<Props> {
  render() {
    const { children } = this.props;

    return (
      <Container
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          p: 1,
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
              p: 1,
              bgcolor: 'primary.light',
            }}>
            {child}
          </Container>
        ))}
      </Container>
    );
  }
}