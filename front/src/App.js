import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './Theme'
import { ChannelProvider } from './ChannelContext';
import { AppRoutes } from "./Routes/AppRoutes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ChannelProvider>
        <AppRoutes/>
      </ChannelProvider>
    </ThemeProvider>
  )
}

export default App;