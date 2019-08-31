import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import {
  Grid,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import { PlayerHistory, getPlayerMatch } from 'state/player';
import Paper from 'components/common/Paper';
import ErrorSnackbar from 'components/common/ErrorSnackbar';
import useStyles from 'hooks/useStyles';
import { Match } from 'state/match';
import { formatMatchOutcome, formatDateTime } from 'util/format';
import moment from 'moment';
import PlayerLink from './PlayerLink';
import MatchLink from 'components/matches/MatchLink';

const useLocalStyles = makeStyles(({ typography }) => ({
  matchPanel: {
    display: 'grid',
    gridTemplateColumns: '70% 20% 10%',
    gridTemplateRows: 'repeat(3, 1fr)',
  },
  matchStartTime: {
    gridRow: 3,
    gridColumn: 1,
  },
  matchScore: {
    gridRow: 2,
    gridColumn: 2,
    ...typography.h5,
  },
  matchOutcome: {
    gridRow: 2,
    gridColumn: 3,
    ...typography.h5,
  },
}));

const MatchPanel: React.FC<{ username: string; match: Match }> = ({
  username,
  match,
}) => {
  const localClasses = useLocalStyles();
  const playerMatch = getPlayerMatch(username, match);
  return (
    <Paper className={localClasses.matchPanel}>
      <Typography>
        vs{' '}
        <PlayerLink username={playerMatch.opponentName}>
          <strong>{playerMatch.opponentName}</strong>
        </PlayerLink>
      </Typography>
      <Typography className={localClasses.matchStartTime}>
        <MatchLink matchId={match.id}>
          {formatDateTime(moment(match.startTime))}
        </MatchLink>
      </Typography>
      <Typography className={localClasses.matchScore}>
        {playerMatch.wins}-{playerMatch.losses}
      </Typography>
      <Typography className={localClasses.matchOutcome}>
        {formatMatchOutcome(playerMatch.outcome, 'abbreviation')}
      </Typography>
    </Paper>
  );
};

const PlayerView: React.FC<{
  username: string;
}> = ({ username }) => {
  const classes = useStyles();
  const { loading, data, error } = useFetch<PlayerHistory>(
    `/api/players/${username}/`
  );

  return (
    <Grid item container direction="column" spacing={2} xs={4} sm={6}>
      <Grid item>
        <Typography className={classes.normalMessage}>{username}</Typography>
      </Grid>
      {loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {data &&
        data.matches.map(match => (
          <Grid key={match.id} item>
            <MatchPanel username={username} match={match} />
          </Grid>
        ))}
      {error && <ErrorSnackbar message="An error occurred" />}
    </Grid>
  );
};

export default withRouteParams(PlayerView);
