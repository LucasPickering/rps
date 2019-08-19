/* eslint-disable react/display-name */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { makeHoc } from 'util/funcs';

const HOC_NAME = 'WithRouteParams';

/**
 * Wraps the given component in another component that takes matched
 * parameters from React router and spreads them into individual props
 * to the child component.
 * @param Component The component to wrap
 */
export default function<UrlParams>(
  Component: React.ComponentType<UrlParams>
): React.ComponentType<RouteComponentProps<UrlParams>> {
  // The main logic. Unpacks the param match props.
  const innerHoc = (
    InnerComponent: React.ComponentType<UrlParams>
  ): React.ComponentType<RouteComponentProps<UrlParams>> => ({
    match: { params },
  }) => <InnerComponent {...params} />;

  // Wrap the inner HoC in logic that will name the wrapped component
  return makeHoc(innerHoc, HOC_NAME)(Component);
}
