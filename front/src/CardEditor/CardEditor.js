import React, { Component } from "react";
import { Typography } from "@mui/material";
import { TCGMCard } from "./Components/TCGMCard";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import defaultData from "./Data/TestBack.json";
import { BaseLayout } from "../Components/Layouts/BaseLayout";

export default class CardEditor extends Component {
  componentDidMount() {
    if (!localStorage.getItem("currentEditedCard")) {
      localStorage.setItem("currentEditedCard", JSON.stringify(defaultData));
    }
  }

  render() {
    return (
      <BaseLayout
        topBar={
          <Typography variant="h5" sx={{ color: "primary.contrastText" }}>
            Card Editor
          </Typography>
        }

        leftPanel={<LeftPanel />}
        centerPanel={<TCGMCard />}
        rightPanel={<RightPanel />}
      />
    );
  }
}