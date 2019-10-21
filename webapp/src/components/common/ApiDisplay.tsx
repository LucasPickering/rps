import React from 'react';
import { ApiState } from 'state/api';
import { CircularProgress } from '@material-ui/core';
import ApiErrorDisplay from './ApiErrorDisplay';
import { noop } from 'lodash';

interface Props<T> {
  resourceName?: string;
  state: ApiState<T, {}>;
  children: (data: T) => React.ReactNode;
}

function ApiDisplay<T>({
  resourceName,
  state,
  children,
}: Props<T>): React.ReactElement | null {
  const { loading, data, error } = state;
  return (
    <>
      {loading && <CircularProgress />}
      {data && children(data)}
      <ApiErrorDisplay error={error} resourceName={resourceName} />
    </>
  );
}

ApiDisplay.defaultProps = {
  children: noop,
} as Partial<Props<{}>>;

export default ApiDisplay;
