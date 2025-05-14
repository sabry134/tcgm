import React, { useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
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

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexGrow: 1,
          p: 1,
          bgcolor: "neutral.main",
          overflowY: "auto",
        }}
      >

        <SidePanel>

          <TCGMButton onClick={openPopup}>
            Create Game
          </TCGMButton>

        </SidePanel>

        <Box
          sx={{
            boxShadow: 2,
            borderRadius: 2,
            bgcolor: "neutral.light",
            flexGrow: 1,
          }}
          ref={spanRef}
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

        <SidePanel/>

      </Stack>
    </Box>
  );
};

export default Community