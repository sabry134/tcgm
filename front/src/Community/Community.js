import React, { useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import { EmptyNavigationBar } from "../Components/NavigationBar/EmptyNavigationBar";
import { CommunityGamePicker } from "./Components/CommunityGamePicker/CommunityGamePicker";
import { Popup } from "../Components/Popup/Popup";
import { createGameRequest } from "../Api/gamesRequest";
import { SidePanel } from "../Components/RawComponents/SidePanel";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";

const Community = () => {
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
    }).then((response) => {
      console.log("Game created successfully", response);
    }).catch((error) => {
      console.log("Error creating game", error);
    })
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
      <EmptyNavigationBar/>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexGrow: 1,
          p: 1,
          bgcolor: "neutral.dark",
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
            boxShadow: 5,
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