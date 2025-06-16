import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import GameMainPageTopBar from "../Components/TopBar/GameMainPageTopBar";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { ROUTES } from "../Routes/routes";
import { withRouterProps } from "../Utility/HocNavigation";

class GameMainPage extends Component {
  navigateTo = (route) => {
    this.props.navigate(route);
  }

  render() {
    return (
      <>
        <BaseLayout
          topBar={
            <GameMainPageTopBar/>
          }
          leftPanel={
            <>
              <TCGMButton
                onClick={this.navigateTo.bind(this, ROUTES.CARD_EDITOR)}
              >
                Create & customize cards
              </TCGMButton>
              <TCGMButton
                onClick={this.navigateTo.bind(this, ROUTES.BOARD_EDITOR)}
              >
                Design the play area
              </TCGMButton>
              <TCGMButton
                onClick={this.navigateTo.bind(this, ROUTES.TYPE_EDITOR)}
              >
                Set up card types and behaviors
              </TCGMButton>
            </>
          }
        />
      </>
    )
  }
}

export default withRouterProps(GameMainPage);