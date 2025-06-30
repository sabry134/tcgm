import { Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { TopBarButton } from "../Components/TopBar/TopBarButton";
import { ROUTES } from "../Routes/routes";
import { Home } from "@mui/icons-material";

const GameMainPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <BaseLayout
      topBar={
        <>
          <TopBarButton
            event={() => navigate(ROUTES.HOME)}
            altText={"Return to community page"}
            svgComponent={Home}
          />
        </>
      }

      leftPanel={
        <>
          <TCGMButton
            onClick={() => navigate(ROUTES.CARD_EDITOR)}
            text={"Create & Customize Cards"}
            altText={"Edit cards"}
          />
          <TCGMButton
            onClick={() => navigate(ROUTES.BOARD_EDITOR)}
            text={"Design the Play Area"}
            altText={"Edit board"}
          />
          <TCGMButton
            onClick={() => navigate(ROUTES.TYPE_EDITOR)}
            text={"Set up Card Types and Behaviors"}
            altText={"Edit types"}
          />
        </>
      }
    />
  );
}

export default GameMainPage;