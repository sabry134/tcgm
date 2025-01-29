import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneEditor from './SceneEditor';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SceneEditor />} />
        
      </Routes>
    </Router>
  );
}

export default App;