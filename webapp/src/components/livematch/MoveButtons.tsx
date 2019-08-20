import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { Move } from 'state/match';
import MoveIcon from '../MoveIcon';
import FlexBox from 'components/core/FlexBox';

const useLocalStyles = makeStyles(({ spacing }) => ({
  button: { margin: spacing(1) },
}));

interface Props {
  onClick: (move: Move) => void;
}

const MoveButtons: React.FC<Props> = ({ onClick }) => {
  const localClasses = useLocalStyles();
  return (
    <FlexBox flexDirection="row" justifyContent="center" width="100%">
      {Object.values(Move).map((move: Move) => (
        <Button
          key={move}
          className={localClasses.button}
          variant="outlined"
          onClick={() => onClick(move)}
        >
          <MoveIcon move={move} />
        </Button>
      ))}
    </FlexBox>
  );
};

export default MoveButtons;
