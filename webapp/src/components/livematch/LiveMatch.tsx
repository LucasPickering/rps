import {
  LinearProgress,
  Typography,
  makeStyles,
  Button,
  Grid,
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
// import FlexBox from 'components/core/FlexBox';

const useLocalStyles = makeStyles(({ typography }) => ({
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
  match: { isReady, selectedMove, matchOutcome, games },
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
      <Grid item container justify="space-between">
        <Grid item>
          <MoveIcon move={selectedMove} />
        </Grid>
        <Grid item>
          <MoveIcon />
        </Grid>
      </Grid>
    ) : (
      <Grid item container justify="center">
        <MoveButtons
          onClick={move => {
            sendMessage({ type: ClientMessageType.Move, move });
          }}
        />
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
            <MoveIcon move={lastGame.selfMove} />
          </Grid>
          <Grid item>
            <Typography className={localClasses.normalMessage}>
              {formatGameOutcome(lastGame.outcome)}
            </Typography>
          </Grid>
          <Grid item>
            <MoveIcon move={lastGame.opponentMove} />
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
  const localClasses = useLocalStyles();
  const {
    state: { data, errors },
  } = useContext(LiveMatchContext);
  const { opponent } = data;

  return (
    <>
      <Grid container direction="column" alignItems="center">
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
            <Grid container item direction="column" alignItems="center" xs={8}>
              <Actions match={data} />
            </Grid>
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
      </Grid>
      <LiveMatchErrorDisplay errors={errors} />
    </>
  );
};

export default LiveMatch;
