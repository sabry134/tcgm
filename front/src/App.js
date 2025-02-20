import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
// import SceneEditor from './SceneEditor/SceneEditor';
import Templates from "./Templates/Templates";
import CardEditor from './CardEditor/CardEditor'
import Community from "./Community/Community";
import { ThemeProvider } from '@emotion/react';
import theme from './Theme'
import TypeEditor from './TypeEditor/TypeEditor';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/*<Route path="/" element={<SceneEditor />} />*/}
          <Route path="/templates" element={<Templates />} />
          <Route path="/card-editor" element={<CardEditor />} />
          <Route path="/type-editor" element={<TypeEditor />} />
          <Route path="/" element={<Community />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;