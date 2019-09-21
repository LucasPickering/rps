import React from 'react';
import { Select, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useLocalStyles = makeStyles(() => ({
  root: {
    width: 120,
  },
}));

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
