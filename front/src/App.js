import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
// import SceneEditor from './SceneEditor/SceneEditor';
import Templates from "./Templates/Templates";
import GameMainPage from "./GameMainPage/GameMainPage";
import CardEditor from "./CardEditor/CardEditor";
import Community from "./Community/Community";
import { ThemeProvider } from '@emotion/react';
import theme from './Theme'
import TypeEditor from './TypeEditor/TypeEditor';
import JoinRoom from './JoinRoom/JoinRoom';
import Login from './Login/Login';
import HelpGame from './HelpGame/HelpGame';
import Room from './Room/Room';
import DeckBuilder from './DeckBuilder/DeckBuilder';
import DeckSelector from './DeckSelector/DeckSelector';
import BoardEditor from './BoardEditor/BoardEditor';
import Lobby from './Lobby/Lobby';
import { ChannelProvider } from './ChannelContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ChannelProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Community />} />
            <Route path="/game-main-page" element={<GameMainPage />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/card-editor" element={<CardEditor />} />
            <Route path="/type-editor" element={<TypeEditor />} />
            <Route path="/board-editor" element={<BoardEditor />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/help-game" element={<HelpGame />} />
            <Route path="/room" element={<Room />} />
            <Route path="/select-deck" element={<DeckSelector />} />
            <Route path="/edit-deck" element={<DeckBuilder />} />
            <Route path='/lobby' element={<Lobby />} />
          </Routes>
        </Router>
      </ChannelProvider>
    </ThemeProvider>
  )
}

export default App;