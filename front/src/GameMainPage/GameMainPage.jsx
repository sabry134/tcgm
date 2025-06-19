import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { TopBarIconButton } from "../Components/TopBar/TopBarButton";
import { Close } from "@mui/icons-material";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { ROUTES } from "../Routes/routes";
import { withRouterProps } from "../Utility/HocNavigation";

class GameMainPage extends Component {
  navigateTo = (route) => {
    this.props.navigate(route);
  }

  unselectGame = () => {
    if (localStorage.getItem('gameSelected')) {
      localStorage.setItem('gameSelected', false);
    }
    this.props.navigate(ROUTES.HOME);
  }

  render() {
    return (
      <BaseLayout

        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={this.unselectGame}
              svgComponent={Close}
              altText="Unselect Game"
            />
          </TopBarButtonGroup>
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
    )
  }
}

export default withRouterProps(GameMainPage);