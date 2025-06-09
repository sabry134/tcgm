import React, { Component } from "react";
import { SvgIcon, ToggleButton } from "@mui/material";

type IconProps = {
  event: () => void;
  svgComponent: React.ElementType;
}

export class TopBarIconButton extends Component<IconProps> {
  render() {
    return (
      <ToggleButton
        value="return"
        aria-label="return"
        onClick={this.props.event}
      >
        <SvgIcon component={this.props.svgComponent}/>
      </ToggleButton>
    )
  }
}

type TextProps = {
  title: string;
  altText: string;
}

export class TopBarTextButton extends Component<TextProps> {
  render() {
    return (
      <ToggleButton
        value="editors"
        aria-label="editors"
        title={ this.props.altText }
      >
        { this.props.title }
      </ToggleButton>
    )
  }
}