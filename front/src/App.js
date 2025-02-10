import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor/SceneEditor';
import Templates from "./Templates/Templates";
import CardEditor from './CardEditor/CardEditor'
import Community from "./Community/Community";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SceneEditor />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/card-editor" element={<CardEditor />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;