import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor';
import JoinRoom from './JoinRoom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SceneEditor />} />
        <Route path="/join" element={<JoinRoom />} />
      </Routes>
    </Router>
  );
}

export default App;