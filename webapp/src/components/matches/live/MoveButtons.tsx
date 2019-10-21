import { makeStyles, Grid, IconButton } from '@material-ui/core';
import React, { useContext } from 'react';
import { Move } from 'state/match';
import MoveIconCircle from './MoveIconCircle';
import {
  LiveMatchMetadataContext,
  LiveMatchSendMessageContext,
  ClientMessageType,
} from 'state/livematch';

const useLocalStyles = makeStyles(({ spacing }) => ({
  button: {
    padding: spacing(1),
  },
}));

const baseMoves: Move[] = ['rock', 'paper', 'scissors'];
const extendedMoves: Move[] = ['lizard', 'spock'];

interface Props {
  disabled: boolean;
}

const MoveButtons = ({ disabled }: Props): React.ReactElement => {
  const localClasses = useLocalStyles();
  const {
    config: { extendedMode },
  } = useContext(LiveMatchMetadataContext);
  const sendMessage = useContext(LiveMatchSendMessageContext);

  const MoveButton: React.FC<{ move: Move }> = ({ move }) => (
    <IconButton
      className={localClasses.button}
      title={move}
      disabled={disabled}
      onClick={() => sendMessage({ type: ClientMessageType.Move, move })}
    >
      <MoveIconCircle move={move} />
    </IconButton>
  );

  return (
    <Grid item container justify="center">
      {/* Break these up into two subcontainers to get the wrapping correct */}
      <Grid item>
        {baseMoves.map(move => (
          <MoveButton key={move} move={move} />
        ))}
      </Grid>
      {extendedMode && (
        <Grid item>
          {extendedMoves.map(move => (
            <MoveButton key={move} move={move} />
          ))}
        </Grid>
      )}
    </Grid>
  );
};

MoveButtons.defaultProps = {
  disabled: false,
};

export default React.memo(MoveButtons);
