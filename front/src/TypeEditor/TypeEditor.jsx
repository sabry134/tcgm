import React, { Component, createRef } from 'react';
import { LeftPanel } from './Components/LeftPanel';
import { RightPanel } from './Components/RightPanel';
import { Editor } from './Components/Editor';
import { Popup } from '../Components/Popup/Popup';
import { createCardTypeRequest } from '../Api/cardTypesRequest';
import { ROUTES } from "../Routes/routes";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { Close } from "@mui/icons-material";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { withRouterProps } from "../Utility/hocNavigation";
import { unselectGame } from "../Utility/navigate";

class TypeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
      leftPanelKey: 0,
    };
    this.spanRef = createRef();
  }

  openPopup = () => {
    this.setState((prevState) => ({
      anchor: prevState.anchor ? null : this.spanRef.current,
    }));
  };

  closePopup = () => {
    this.setState((prevState) => ({
      anchor: null,
      leftPanelKey: prevState.leftPanelKey + 1,
    }));
  };

  onClickCreate = (data) => {
    createCardTypeRequest({
      cardType: {
        name: data[0],
        game_id: localStorage.getItem('gameSelected'),
        properties: [],
      },
    }).then();
  };

  render() {
    const { anchor, leftPanelKey } = this.state;
    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;

    return (
      <BaseLayout
        spanRef={this.spanRef}
        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => unselectGame(this.props.navigate)}
              svgComponent={Close}
              altText="Unselect Game"
            />
            <TopBarTextButton
              title="Edit Card"
              altText="Edit card"
              event={() => this.props.navigate(ROUTES.CARD_EDITOR)}
            />
            <TopBarTextButton
              title="Edit Board"
              altText="Edit board"
              event={() => this.props.navigate(ROUTES.BOARD_EDITOR)}
            />
          </TopBarButtonGroup>
        }

        leftPanel={<LeftPanel key={leftPanelKey} popupCallback={this.openPopup}/>}

        centerPanel={
          <>
            <Editor/>
            <Popup
              id={id}
              open={open}
              anchorEl={anchor}
              closeCallback={this.closePopup}
              receivedCallback={(data) => this.onClickCreate(data)}
              title={'Create Type'}
              inputName={['Name']}
            />
          </>
        }

        rightPanel={<RightPanel/>}

      />
    );
  }
}

export default withRouterProps(TypeEditor)