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
        value={this.props.altText}
        title={this.props.altText}
        onClick={this.props.event}
        sx={{
          color: "primary.contrastText",
        }}
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
        value={this.props.altText}
        title={this.props.altText}
        sx={{
          color: "primary.contrastText",
          '&.Mui-selected': {
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            '&:hover': {
              backgroundColor: "primary.dark",
            },
          }
        }}
      >
        {this.props.title}
      </ToggleButton>
    )
  }
}