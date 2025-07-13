import React from "react";
import { useChannel } from "../ChannelContext";

/**
 * Higher-order component to inject channel context into a component.
 * This allows the wrapped component to access the channel context
 * without needing to use the ChannelContext directly.
 *
 * @param {React.Component} Component - The component to wrap.
 * @returns {React.Component} - A new component with channel context injected.
 */

export const withChannel = (Component) => {
  return function Wrapper(props) {
    const channelContext = useChannel();

    return (
      <Component
        {...props}
        channelContext={channelContext}
      />
    );
  };
};
