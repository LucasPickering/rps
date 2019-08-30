import { Box } from '@material-ui/core';
import React from 'react';

const FlexBox: React.FC<React.ComponentProps<typeof Box>> = props => {
  return <Box display="flex" alignItems="center" {...props} />;
};

export default FlexBox;
