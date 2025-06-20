import React, { Component } from "react";
import { SvgIcon, ToggleButton } from "@mui/material";

type IconProps = {
  event: () => void;
  svgComponent: React.ElementType;
  text?: string;
}

/**
 * A button component for the top bar that displays an icon.
 * It uses a ToggleButton from Material-UI for styling and interaction.
 *
 * @param {Object} props - The properties for the component.
 * @param {Function} props.event - The function to call when the button is clicked.
 * @param {React.ElementType} props.svgComponent - The SVG component to render as the icon.
 * @param {string} props.altText - The alternative text for the button, used for accessibility.
 * @param {string} [props.text] - Optional text to display alongside the icon.
 * @return {JSX.Element} The rendered button component.
 *
 * @example
 * <TopBarIconButton
 *  event={() => console.log('Button clicked')}
 *  svgComponent={SomeSvgIcon}
 *  altText="Click me"
 *  text="Button"
 * />
 * @see TopBarTextButton for an example of a button with text.
 */

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
        {this.props.text}
      </ToggleButton>
    )
  }
}

type TextProps = {
  title: string;
  altText: string;
  event: () => void;
}

/**
 * A button component for the top bar that displays text.
 * It uses a ToggleButton from Material-UI for styling and interaction.
 *
 * @param {Object} props - The properties for the component.
 * @param {string} props.title - The text to display on the button.
 * @param {string} props.altText - The alternative text for the button, used for accessibility.
 * @param {Function} props.event - The function to call when the button is clicked.
 * @return {JSX.Element} The rendered button component.
 *
 * @example
 * <TopBarTextButton
 *  title="Click Me"
 *  altText="Click this button to perform an action"
 *  event={() => console.log('Button clicked')}
 * />
 * @see TopBarIconButton for an example of a button with an icon.
 */

export class TopBarTextButton extends Component<TextProps> {
  render() {
    return (
      <ToggleButton
        value={this.props.altText}
        title={this.props.altText}
        onClick={this.props.event}
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