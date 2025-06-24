import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { TopBarIconButton } from "../Components/TopBar/TopBarButton";
import { Close } from "@mui/icons-material";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { ROUTES } from "../Routes/routes";
import { withRouterProps } from "../Utility/hocNavigation";
import { unselectGame } from "../Utility/navigate";

class GameMainPage extends Component {
  navigateTo = (route) => {
    this.props.navigate(route);
  }

  render() {
    return (
      <BaseLayout

        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => unselectGame(this.props.navigate)}
              svgComponent={Close}
              altText="Unselect Game"
            />
          </TopBarButtonGroup>
        }

        leftPanel={
          <>
            <TCGMButton
              onClick={this.navigateTo.bind(this, ROUTES.CARD_EDITOR)}
              text="Create & customize cards"
            />
            <TCGMButton
              onClick={this.navigateTo.bind(this, ROUTES.BOARD_EDITOR)}
              text="Design the play area"
            />
            <TCGMButton
              onClick={this.navigateTo.bind(this, ROUTES.TYPE_EDITOR)}
              text="Set up card types and behaviors"
            />
          </>
        }
      />
    )
  }
}

export default withRouterProps(GameMainPage);