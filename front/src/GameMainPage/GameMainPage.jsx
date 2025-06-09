import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { EditNavigationWrapper } from "../Utility/wrapperNavigation";

class GameMainPage extends Component {
  render() {
    return (
      <>
        <BaseLayout
          topBar={
            <EditNavigationWrapper/>
          }/>
      </>
    )
  }
}

export default GameMainPage;