import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor';
import JoinRoom from './JoinRoom';
import Login from './Login';
import Room from './Room'
import Documentation from './Documentation';
import Template from './Template';
import Community from './Community';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<SceneEditor />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/" element={<Login />} />
        <Route path="/room" element={<Room />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/templates" element={<Template />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;