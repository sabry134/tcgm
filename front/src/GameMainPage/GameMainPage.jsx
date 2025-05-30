import { MainNavigationBar } from "../Components/NavigationBar/MainNavigationBar";
import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";

class GameMainPage extends Component {
  render() {
    return (
      <>
        <BaseLayout
          topBar={
            <MainNavigationBar />
          }/>
      </>
    )
  }
}

export default GameMainPage;