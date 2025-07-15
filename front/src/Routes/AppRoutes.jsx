import { Navigate, Route, Routes } from "react-router-dom";
import GameMainPage from "../GameMainPage/GameMainPage";
import CardEditor from "../CardEditor/CardEditor";
import TypeEditor from "../TypeEditor/TypeEditor";
import BoardEditor from "../BoardEditor/BoardEditor";
import JoinRoom from "../JoinRoom/JoinRoom";
import Login from "../Login/Login";
import HelpGame from "../HelpGame/HelpGame";
import Room from "../Room/Room";
import DeckSelector from "../DeckSelector/DeckSelector";
import DeckBuilder from "../DeckBuilder/DeckBuilder";
import Lobby from "../Lobby/Lobby";
import { HashRouter as Router } from "react-router";
import React from "react";
import { ROUTES } from "./routes";
import Community from "../Community/Community";
import RuleEditor from "../RuleEditor/RuleEditor";
import CardCollectionEditor from "../CardCollectionEditor/CardCollectionEditor";
//import Templates from "../Templates/Templates";

export class AppRoutes extends React.Component {

  render() {
    return (
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN} element={<Login/>}/>
          <Route path={ROUTES.COMMUNITY} element={<Community/>}/>

          <Route path={ROUTES.GAME_MAIN_PAGE} element={<GameMainPage/>}/>
          <Route path={ROUTES.CARD_EDITOR} element={<CardEditor/>}/>
          <Route path={ROUTES.TYPE_EDITOR} element={<TypeEditor/>}/>
          <Route path={ROUTES.BOARD_EDITOR} element={<BoardEditor/>}/>
          <Route path={ROUTES.CARD_COLLECTION_EDITOR} element={<CardCollectionEditor/>}/>
        {/* <Route path={ROUTES.TEMPLATES} element={<Templates/>}/>*/}

          <Route path={ROUTES.JOIN} element={<JoinRoom/>}/>
          <Route path={ROUTES.SELECT_DECK} element={<DeckSelector/>}/>
          <Route path={ROUTES.EDIT_DECK} element={<DeckBuilder/>}/>
          <Route path={ROUTES.LOBBY} element={<Lobby/>}/>
          <Route path={ROUTES.RULE_EDITOR} element={<RuleEditor/>}/>

          <Route path={ROUTES.ROOM} element={<Room/>}/>
          <Route path={ROUTES.HELP_GAME} element={<HelpGame/>}/>
        </Routes>
      </Router>
    )
  }
}