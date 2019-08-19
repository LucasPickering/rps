import {
  Box,
  LinearProgress,
  Theme,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplasher } from 'hooks/useSplashMessage';
import MoveIcon from 'components/MoveIcon';
import { last } from 'lodash';
import React, { useContext } from 'react';
import { ClientMessageType, LiveMatchContext } from 'state/livematch';
import { formatGameOutcome, formatMatchOutcome } from 'util/format';
import GameLog from './GameLog';
import MoveButtons from './MoveButtons';
import PlayerScore from './PlayerScore';

const useLocalStyles = makeStyles(({ typography }: Theme) => ({
  majorMessage: {
    ...typography.h3,
  },
  normalMessage: {
    ...typography.h5,
  },
  minorMessage: {
    ...typography.body1,
  },
  loading: {
    width: '100%',
  },
}));

/**
 * Helper component to render the actions available to the player
 */
const Actions: React.FC = () => {
  const localClasses = useLocalStyles();
  const {
    state: { isReady, opponent, selectedMove, matchOutcome, games },
    sendMessage,
  } = useContext(LiveMatchContext);
  const matchOutcomeSplash = useSplashMessage(
    matchOutcomeSplasher,
    matchOutcome
  );

  // Match is over
  if (matchOutcome) {
    return (
      <>
        <Typography className={localClasses.normalMessage}>
          Match Over
        </Typography>
        <Typography className={localClasses.majorMessage}>
          You {formatMatchOutcome(matchOutcome)}!
        </Typography>
        <Typography className={localClasses.minorMessage}>
          {matchOutcomeSplash}
        </Typography>
      </>
    );
  }

  // Match is running
  const lastGame = last(games);
  if (isReady) {
    return (
      <>
        {lastGame && (
          <Typography className={localClasses.minorMessage}>
            Last Game: You {formatGameOutcome(lastGame.outcome)}
          </Typography>
        )}
        {selectedMove ? (
          <>
            <Typography className={localClasses.normalMessage}>
              <MoveIcon move={selectedMove} />
            </Typography>
            <Typography className={localClasses.normalMessage}>
              Waiting for {opponent && opponent.name}...
            </Typography>
            <LinearProgress className={localClasses.loading} variant="query" />
          </>
        ) : (
          <MoveButtons
            onClick={move => {
              sendMessage({ type: ClientMessageType.Move, move });
            }}
          />
        )}
      </>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => sendMessage({ type: ClientMessageType.Ready })}
      >
        Ready
      </Button>
    </Box>
  );
};

const LiveMatch: React.FC = () => {
  const localClasses = useLocalStyles();
  const {
    state: { opponent },
  } = useContext(LiveMatchContext);

  // No opponent
  if (!opponent) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography className={localClasses.normalMessage}>
          Waiting for opponent...
        </Typography>
        <LinearProgress className={localClasses.loading} />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <PlayerScore isSelf />
          <GameLog />
          <PlayerScore />
        </Box>
        <Actions />
      </Box>
    </>
  );
};

export default LiveMatch;
