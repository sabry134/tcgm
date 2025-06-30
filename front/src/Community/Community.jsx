import React, { useRef, useState } from "react";
import { Typography } from "@mui/material";
import { CommunityGamePicker } from "./Component/CommunityGamePicker";
import { Popup } from "../Components/Popup/Popup";
import { createGameRequest, getGameRequest } from "../Api/gamesRequest";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { BaseLayout } from "../Components/Layouts/BaseLayout";

const Community = () => {
  const [anchor, setAnchor] = useState(null);
  const spanRef = useRef(null);

  const openPopup = () => {
    setAnchor(anchor ? null : spanRef);
  };

  const closePopup = () => {
    setAnchor(null)
  }

  const onClickCreate = (data) => {
    createGameRequest({
      game: { name: data[0], description: data[1] },
    })
      .then((response) => {
        console.log("Game created successfully", response);

        return getGameRequest(response.id);
      })
      .then((game) => {
        console.log("Game details:", game);
      })
      .catch((error) => {
        console.error("Error creating or fetching game:", error);
      });
  };


  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

  return (
    <BaseLayout
      spanRef={spanRef}
      topBar={
        <Typography
          variant="h5"
          sx={{ color: "primary.contrastText" }}
        >
          Community page
        </Typography>
      }

      leftPanel={
        <TCGMButton
          onClick={openPopup}
          text={"Create Game"}
        />
      }

      centerPanel={
        <>
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
        </>
      }
    />
  );
};

export default Community