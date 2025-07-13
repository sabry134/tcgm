import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
/**
 * Higher-order component to inject React Router props (navigate, location, params)
 * into a wrapped component.
 *
 * @param {React.Component} Component - The component to wrap.
 * @returns {React.Component} - A new component with router props injected.
 */

export function withRouterProps(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };
}