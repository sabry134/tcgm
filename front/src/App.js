import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor';
import CardEditor from './CardEditor'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SceneEditor />} />
        <Route path="/card-editor" element={<CardEditor />} />
      </Routes>
    </Router>
  );
}

export default App;