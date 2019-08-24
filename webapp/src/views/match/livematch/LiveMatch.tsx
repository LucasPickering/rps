import {
  LinearProgress,
  Typography,
  makeStyles,
  Button,
  Grid,
} from '@material-ui/core';
import useSplashMessage, { matchOutcomeSplasher } from 'hooks/useSplashMessage';
import { last } from 'lodash';
import React, { useContext, useEffect } from 'react';
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
import LiveMatchErrorDisplay from './LiveMatchErrorDisplay';
import useStyles from 'hooks/useStyles';
import useNotifications from 'hooks/useNotifications';
import MoveIconCircle from './MoveIconCircle';

const useLocalStyles = makeStyles(() => ({
  loading: {
    width: '100%',
  },
}));

/**
 * Helper component to render the actions available to the player
 */
const Actions: React.FC<{ match: LiveMatchData }> = ({
  match: { isReady, selectedMove, matchOutcome, games },
}) => {
  const classes = useStyles();
  const { sendMessage } = useContext(LiveMatchContext);
  const matchOutcomeSplash = useSplashMessage(
    matchOutcomeSplasher,
    matchOutcome
  );

  // Match is over
  if (matchOutcome) {
    return (
      <>
        <Typography className={classes.normalMessage}>Match Over</Typography>
        <Typography className={classes.majorMessage}>
          You {formatMatchOutcome(matchOutcome, OutcomeFormat.PastTense)}!
        </Typography>
        <Typography className={classes.minorMessage}>
          {matchOutcomeSplash}
        </Typography>
      </>
    );
  }

  // Match is running
  if (isReady) {
    // Player is ready, show moves
    return (
      <Grid item container justify="space-between">
        <Grid item>
          <MoveIconCircle move={selectedMove} />
        </Grid>
        <Grid item>
          {/* Only show loading icon for opponent if user has already picked a move */}
          <MoveIconCircle loading={Boolean(selectedMove)} />
        </Grid>
        {!selectedMove && (
          <Grid item container justify="center">
            <MoveButtons
              onClick={move => {
                sendMessage({ type: ClientMessageType.Move, move });
              }}
            />
          </Grid>
        )}
      </Grid>
    );
  }

  // Not ready yet, show a ready button
  const lastGame = last(games);
  return (
    <>
      {lastGame && (
        <Grid item container justify="space-between">
          <Grid item>
            <MoveIconCircle move={lastGame.selfMove} />
          </Grid>
          <Grid item>
            <Typography className={classes.normalMessage}>
              {formatGameOutcome(lastGame.outcome)}
            </Typography>
          </Grid>
          <Grid item>
            <MoveIconCircle move={lastGame.opponentMove} />
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => sendMessage({ type: ClientMessageType.Ready })}
        >
          Ready
        </Button>
      </Grid>
    </>
  );
};

/**
 * The main component of the live match screen. As long as the socket is open,
 * this should be rendered. This also includes error cases, e.g. not being
 * logged in.
 */
const LiveMatch: React.FC = () => {
  const classes = useStyles();
  const localClasses = useLocalStyles();
  const notify = useNotifications();
  const {
    state: { data, errors },
    sendMessage,
  } = useContext(LiveMatchContext);
  const { games, opponent } = data;

  // Set up an interval to ping the server once per second
  useEffect(() => {
    const intervalId = setInterval(
      () => sendMessage({ type: ClientMessageType.Heartbeat }),
      1000
    );
    return () => clearInterval(intervalId);
  }, [sendMessage]);

  const opponentName = opponent && opponent.username;
  useEffect(() => {
    if (opponentName) {
      notify(`${opponentName} connected`);
    }
  }, [notify, opponentName]);

  useEffect(() => {
    const lastGame = last(games);
    if (lastGame) {
      notify(
        `Game over - ${formatGameOutcome(lastGame.outcome, OutcomeFormat.Noun)}`
      );
    }
  }, [notify, games.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {opponent ? (
        // Match is running
        <>
          <Grid item container justify="space-between">
            <Grid item>
              <PlayerScore isSelf />
            </Grid>
            <Grid item>
              <GameLog />
            </Grid>
            <Grid item>
              <PlayerScore />
            </Grid>
          </Grid>
          <Grid item sm={8} container direction="column" alignItems="center">
            <Actions match={data} />
          </Grid>
        </>
      ) : (
        // No opponent
        <>
          <Typography className={classes.normalMessage}>
            Waiting for opponent...
          </Typography>
          <LinearProgress className={localClasses.loading} />
        </>
      )}
      <LiveMatchErrorDisplay errors={errors} />
    </>
  );
};

export default LiveMatch;
