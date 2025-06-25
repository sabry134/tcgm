import React, { Component, createRef } from "react";
import { LeftPanel } from "./Components/LeftPanel";
import { DeckPicker } from "./Components/DeckPicker";
import { Popup } from "../Components/Popup/Popup";
import { withRouterProps } from "../Utility/hocNavigation";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { unselectGame } from "../Utility/navigate";
import { Home } from "@mui/icons-material";
import { ROUTES } from "../Routes/routes";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";

class DeckSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
    };
    this.spanRef = createRef();
  }

  openPopup = () => {
    this.setState((prevState) => ({
      anchor: prevState.anchor ? null : this.spanRef.current,
    }));
  };

  closePopup = () => {
    this.setState({ anchor: null });
  };

  render() {
    const { anchor } = this.state;
    const open = Boolean(anchor);
    const id = open ? "simple-popper" : undefined;

    return (
      <BaseLayout
        spanRef={this.spanRef}
        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => {
                unselectGame(this.props.navigate);
              }}
              svgComponent={Home}
              altText="Return to home"
            />
            <TopBarTextButton
              title={"Create/Join Room"}
              altText={"Create or join a game room"}
              event={() => this.props.navigate(ROUTES.JOIN)}
            />
            <TopBarTextButton
              title={"Edit Deck"}
              altText={"Edit your decks"}
              event={() => this.props.navigate(ROUTES.EDIT_DECK)}
            />
          </TopBarButtonGroup>
        }

        leftPanel={<LeftPanel popupCallback={this.openPopup}/>}

        centerPanel={
          <>
            <Popup
              id={id}
              open={open}
              anchorEl={anchor}
              closeCallback={this.closePopup}
              receivedCallback={(data) => {}}
              title={"Create Deck"}
              inputName={["Name"]}
            />
            <DeckPicker/>
          </>
        }
      />
    );
  }
}

export default withRouterProps(DeckSelector);