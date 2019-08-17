import {
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useLocalStyles = makeStyles(({  }: Theme) => ({
  loading: {
    width: '100%',
  },
}));

interface Props {
  minor?: string;
  major?: string;
  loading: boolean;
}

// We have to leave the React.FC tag off to get default props to work
const LiveMatchStatusMessage = ({ minor, major, loading }: Props) => {
  const localClasses = useLocalStyles();
  return (
    <>
      {minor && <Typography variant="h5">{minor}</Typography>}
      {major && <Typography variant="h3">{major}</Typography>}
      {loading && <LinearProgress className={localClasses.loading} />}
    </>
  );
};

LiveMatchStatusMessage.defaultProps = {
  loading: false,
};

export default LiveMatchStatusMessage;
