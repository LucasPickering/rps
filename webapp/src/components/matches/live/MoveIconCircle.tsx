import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from 'components/MoveIcon';
import clsx from 'clsx';
import FlexBox from 'components/common/FlexBox';

const SIZE = 60;

const useLocalStyles = makeStyles(({ palette }) => ({
  root: {
    width: SIZE,
    height: SIZE,
    fontSize: 32,
    borderRadius: SIZE,
    borderWidth: 2,
    borderColor: palette.divider,
  },
  filled: {
    borderStyle: 'solid',
  },
  empty: {
    borderStyle: 'dashed',
  },
}));

interface Props {
  className?: string;
  move?: Move;
  loading: boolean;
}

/**
 * An icon for a single move. If no move is specified, a loading icon is shown
 */
const MoveIconCircle = ({
  className,
  move,
  loading,
}: Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <FlexBox
      className={clsx(
        localClasses.root,
        move ? localClasses.filled : localClasses.empty,
        className
      )}
      justifyContent="center"
    >
      {move && <MoveIcon move={move} />}
      {loading && <CircularProgress size={SIZE / 2} />}
    </FlexBox>
  );
};

MoveIconCircle.defaultProps = {
  loading: false,
};

export default MoveIconCircle;
