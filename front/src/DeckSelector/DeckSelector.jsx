import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JoinRoomNavigationBar } from "../NavigationBar/JoinRoomNavigationBar";
import { LeftPanel } from "./Components/LeftPanel";
import { DeckPicker } from "./Components/DeckPicker";
import { createCollectionRequest } from "../Api/collectionsRequest";
import { TCGMPopup } from "../Components/RawComponents/TCGMPopup";

const DeckSelector = () => {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const spanRef = useRef()

  const openPopup = () => {
    setAnchor(anchor ? null : spanRef);
  };

  const closePopup = () => {
    setAnchor(null)
  }

  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

  const createDeck = async (data) => {
    const deckCreationData = {
      card_collection : {
        name: data[0],
        quantity : 1,
        game_id: localStorage.getItem("gameSelected"),
        user_id: localStorage.getItem("userId"),
        type: "deck",
        active: false
      }
    };
    createCollectionRequest(deckCreationData)
    .then(() => {
      console.log("Deck created successfully");
    })
    .then(() => {
      window.dispatchEvent(new Event('refreshDecks'));
    })
    .catch((error) => {
      console.error("Error creating deck:", error);
    });
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <JoinRoomNavigationBar navigate={navigate}/>

      <Box display="flex" flexGrow={1} bgcolor="#c4c4c4">
        <LeftPanel popupCallback={openPopup} />
        <Box
          ref={spanRef}
          className="main-area"
          flexGrow={1}
          position="relative"
        >
          <TCGMPopup
            id={id}
            open={open}
            anchorEl={anchor}
            closeCallback={closePopup}
            receivedCallback={async (data) => {createDeck(data)}}
            title={"Create Deck"}
            inputName={["Name"]}
          />
          <DeckPicker />
        </Box>
      </Box>
    </Box>
  );
};

export default DeckSelector;