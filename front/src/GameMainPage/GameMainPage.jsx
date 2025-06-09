import React, { Component } from "react";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import EditNavigationBar from "../Components/NavigationBar/EditNavigationBar";

export class GameMainPage extends Component {
  render() {
    return (
      <>
        <BaseLayout
          topBar={
            <EditNavigationBar/>
          }/>
      </>
    )
  }
}