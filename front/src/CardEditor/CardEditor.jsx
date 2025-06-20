import React, { Component } from "react";
import { ROUTES } from "../Routes/routes";
import { Close } from "@mui/icons-material";
import { TCGMCard } from "./Components/TCGMCard";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import defaultData from "./Data/TestBack.json";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { withRouterProps } from "../Utility/HocNavigation";

class CardEditor extends Component {
  componentDidMount() {
    if (!localStorage.getItem("currentEditedCard")) {
      localStorage.setItem("currentEditedCard", JSON.stringify(defaultData));
    }
  }

  unselectGame = () => {
    if (localStorage.getItem("gameSelected")) {
      localStorage.setItem("gameSelected", false);
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
            <TopBarTextButton
              title="Edit Type"
              altText="Edit card type"
              event={() => this.props.navigate(ROUTES.TYPE_EDITOR)}
            />
            <TopBarTextButton
              title="Edit Board"
              altText="Edit board"
              event={() => this.props.navigate(ROUTES.BOARD_EDITOR)}
            />
          </TopBarButtonGroup>
        }

        leftPanel={<LeftPanel />}
        centerPanel={<TCGMCard />}
        rightPanel={<RightPanel />}
      />
    );
  }
}

export default withRouterProps(CardEditor);