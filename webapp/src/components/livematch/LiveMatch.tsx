import {
  Box,
  LinearProgress,
  Theme,
  Typography,
  makeStyles,
  Button,
  CircularProgress,
} from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplasher } from 'hooks/useSplashMessage';
import { last } from 'lodash';
import React, { useContext } from 'react';
import {
  ClientMessageType,
  LiveMatchContext,
  LiveMatchData,
} from 'state/livematch';
import {
  formatGameOutcome,
  formatMatchOutcome,
  OutcomeFormat,
} from 'util/format';
import GameLog from './GameLog';
import MoveButtons from './MoveButtons';
import PlayerScore from './PlayerScore';
import MoveIcon from 'components/MoveIcon';
import LiveMatchErrorDisplay from './LiveMatchErrorDisplay';

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
const Actions: React.FC<{ match: LiveMatchData }> = ({
  match: { isReady, opponent, selectedMove, matchOutcome, games },
}) => {
  const localClasses = useLocalStyles();
  const { sendMessage } = useContext(LiveMatchContext);
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
          You {formatMatchOutcome(matchOutcome, OutcomeFormat.PastTense)}!
        </Typography>
        <Typography className={localClasses.minorMessage}>
          {matchOutcomeSplash}
        </Typography>
      </>
    );
  }

  // Match is running
  if (isReady) {
    // Player is ready, show moves
    return selectedMove ? (
      <>
        <Box
          width="60%"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <MoveIcon move={selectedMove} />
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography className={localClasses.minorMessage}>
              Waiting for {opponent && opponent.name}...
            </Typography>
            <CircularProgress size={20} />
          </Box>
        </Box>
      </>
    ) : (
      <MoveButtons
        onClick={move => {
          sendMessage({ type: ClientMessageType.Move, move });
        }}
      />
    );
  }

  // Not ready yet, show a ready button
  const lastGame = last(games);
  return (
    <>
      {lastGame && (
        <Box
          width="60%"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <MoveIcon move={lastGame.selfMove} />
          <Typography className={localClasses.normalMessage}>
            {formatGameOutcome(lastGame.outcome)}
          </Typography>
          <MoveIcon move={lastGame.opponentMove} />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => sendMessage({ type: ClientMessageType.Ready })}
      >
        Ready
      </Button>
    </>
  );
};

/**
 * The main component of the live match screen. As long as the socket is open,
 * this should be rendered. This also includes error cases, e.g. not being
 * logged in.
 */
const LiveMatch: React.FC = () => {
  const localClasses = useLocalStyles();
  const {
    state: { data, errors },
  } = useContext(LiveMatchContext);
  const { opponent } = data;

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        {opponent ? (
          // Match is running
          <>
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
            <Actions match={data} />
          </>
        ) : (
          // No opponent
          <>
            <Typography className={localClasses.normalMessage}>
              Waiting for opponent...
            </Typography>
            <LinearProgress className={localClasses.loading} />
          </>
        )}
      </Box>
      <LiveMatchErrorDisplay errors={errors} />
    </>
  );
};

export default LiveMatch;
