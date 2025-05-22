import React, { Component } from 'react'
import { GameSelectedAddOn } from "./EditorsAddOn/GameSelectedAddOn";
import { ListEditorsAddOn } from "./EditorsAddOn/ListEditorsAddOn";
import { BaseTopBar } from "../RawComponents/BaseTopBar";

export class MainNavigationBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEditors: false
    }
  }

  componentDidMount() {
    window.addEventListener('gameSelected', this.handleStorageChange)
  }

  componentWillUnmount() {
    window.removeEventListener('gameSelected', this.handleStorageChange)
  }

  toggleDisplayEditors = () => {
    this.setState({ showEditors: !this.state.showEditors })
  }

  render() {
    return (
      <BaseTopBar>

        {this.state.showEditors ? (
          <>
            <ListEditorsAddOn toggleDisplay={this.toggleDisplayEditors}/>
          </>
        ) : (
          <GameSelectedAddOn toggleDisplay={this.toggleDisplayEditors}/>
        )}

      </BaseTopBar>
    )
  }
}