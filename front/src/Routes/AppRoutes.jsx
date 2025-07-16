import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";

import Login from "../Login/Login";
import Community from "../Community/Community";
import GameMainPage from "../GameMainPage/GameMainPage";
import CardEditor from "../CardEditor/CardEditor";
import TypeEditor from "../TypeEditor/TypeEditor";
import BoardEditor from "../BoardEditor/BoardEditor";
import JoinRoom from "../JoinRoom/JoinRoom";
import HelpGame from "../HelpGame/HelpGame";
import Room from "../Room/Room";
import DeckSelector from "../DeckSelector/DeckSelector";
import DeckBuilder from "../DeckBuilder/DeckBuilder";
import Lobby from "../Lobby/Lobby";
import RuleEditor from "../RuleEditor/RuleEditor";
import CardCollectionEditor from "../CardCollectionEditor/CardCollectionEditor";
// import Templates from "../Templates/Templates";

import { ROUTES } from "./routes";

// ✅ PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

export class AppRoutes extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route path={ROUTES.COMMUNITY} element={<PrivateRoute><Community /></PrivateRoute>} />
          <Route path={ROUTES.GAME_MAIN_PAGE} element={<PrivateRoute><GameMainPage /></PrivateRoute>} />
          <Route path={ROUTES.CARD_EDITOR} element={<PrivateRoute><CardEditor /></PrivateRoute>} />
          <Route path={ROUTES.TYPE_EDITOR} element={<PrivateRoute><TypeEditor /></PrivateRoute>} />
          <Route path={ROUTES.BOARD_EDITOR} element={<PrivateRoute><BoardEditor /></PrivateRoute>} />
          <Route path={ROUTES.CARD_COLLECTION_EDITOR} element={<PrivateRoute><CardCollectionEditor /></PrivateRoute>} />
          {/* <Route path={ROUTES.TEMPLATES} element={<PrivateRoute><Templates /></PrivateRoute>} /> */}

          <Route path={ROUTES.JOIN} element={<PrivateRoute><JoinRoom /></PrivateRoute>} />
          <Route path={ROUTES.SELECT_DECK} element={<PrivateRoute><DeckSelector /></PrivateRoute>} />
          <Route path={ROUTES.EDIT_DECK} element={<PrivateRoute><DeckBuilder /></PrivateRoute>} />
          <Route path={ROUTES.LOBBY} element={<PrivateRoute><Lobby /></PrivateRoute>} />
          <Route path={ROUTES.RULE_EDITOR} element={<PrivateRoute><RuleEditor /></PrivateRoute>} />
          <Route path={ROUTES.ROOM} element={<PrivateRoute><Room /></PrivateRoute>} />
          <Route path={ROUTES.HELP_GAME} element={<PrivateRoute><HelpGame /></PrivateRoute>} />
        </Routes>
      </Router>
    );
  }
}
