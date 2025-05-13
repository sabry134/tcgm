import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainNavigationBar } from "../NavigationBar/MainNavigationBar";
import { CommunityGamePicker } from "./Components/CommunityGamePicker/CommunityGamePicker";
import { Popup } from "../Components/Popup/Popup";
import { createGameRequest } from "../Api/gamesRequest";
import { SidePanel } from "../Components/RawComponents/SidePanel";
import { TCGMButton } from "../Components/RawComponents/TCGMButton/TCGMButton";

const Community = () => {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const spanRef = useRef()

  const openPopup = () => {
    setAnchor(anchor ? null : spanRef);
  };

  const closePopup = () => {
    setAnchor(null)
  }

  const onClickCreate = (data) => {
    createGameRequest({
      game: { name: data[0], description: data[1] },
    }).then()
  }

  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "neutral.main",
      }}
    >
      <MainNavigationBar navigate={navigate}/>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          p: 1,
        }}
      >

        <SidePanel>

          <TCGMButton onClick={openPopup}>
            Create Game
          </TCGMButton>

        </SidePanel>

        <Box
          ref={spanRef}
          className="main-area"
          flexGrow={1}
          position="relative"
        >

          <Popup
            id={id}
            open={open}
            anchorEl={anchor}
            closeCallback={closePopup}
            receivedCallback={(data) => onClickCreate(data)}
            title={"Create Game"}
            inputName={["Name", "Description"]}
          />
          <CommunityGamePicker/>

        </Box>
      </Box>
    </Box>
  );
};

export default Community