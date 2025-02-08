import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor';
import JoinRoom from './JoinRoom';
import Login from './Login';
import Room from './Room'
import Documentation from './Documentation';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<SceneEditor />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/" element={<Login />} />
        <Route path="/room" element={<Room />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </Router>
  );
}

export default App;