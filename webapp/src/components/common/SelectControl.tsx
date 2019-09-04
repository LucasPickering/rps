import React from 'react';
import { Select, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useLocalStyles = makeStyles(() => ({
  root: {
    width: 120,
  },
}));

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const SelectControl: React.FC<
  { id: string; label?: string } & React.ComponentProps<typeof Select>
> = ({ className, id, label, ...rest }) => {
  const localClasses = useLocalStyles();

  return (
    <FormControl className={clsx(localClasses.root, className)}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select id={id} {...rest} />
    </FormControl>
  );
};

export default SelectControl;
