import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';

const SwitchControl: React.FC<
  { label?: string } & React.ComponentProps<typeof Switch>
> = ({ className, label, ...rest }) => {
  return (
    <FormControlLabel
      className={className}
      label={label}
      control={<Switch color="primary" {...rest} />}
    />
  );
};

export default SwitchControl;
