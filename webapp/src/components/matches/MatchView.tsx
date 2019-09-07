import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import {
  Grid,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import { Match } from 'state/match';
import PlayerLink from 'components/players/PlayerLink';
import Paper from 'components/common/Paper';
import { formatDateTime } from 'util/format';
import moment from 'moment';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';
import useStyles from 'hooks/useStyles';

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

const PlayerName: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles();
  return (
    <Typography className={classes.normalMessage}>
      <PlayerLink username={username}>
        <strong>{username}</strong>
      </PlayerLink>
    </Typography>
  );
};

const MatchDataView: React.FC<{ match: Match }> = ({ match }) => {
  const [player1, player2] = match.players;
  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item container justify="space-between">
          <PlayerName username={player1} />
          <Typography>vs</Typography>
          <PlayerName username={player2} />
        </Grid>

        <Grid item xs={12}>
          <Typography>
            {formatDateTime(moment(match.startTime))} ({match.duration}s)
          </Typography>
          <Typography>Best of {match.config.bestOf}</Typography>
          <Typography>
            Lizard/Spock: {match.config.extendedMode ? 'Enabled' : 'Disabled'}
          </Typography>
        </Grid>

        {match.games.map((game, i) => (
          <Grid key={i} item>
            <p>{game.winner}</p>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const MatchView: React.FC<{
  matchId: number;
}> = ({ matchId }) => {
  // const localClasses = useLocalStyles();
  const { loading, data, error } = useFetch<Match>(`/api/matches/${matchId}/`);

  return (
    <PageLayout>
      {loading && <CircularProgress />}
      {data && <MatchDataView match={data} />}
      <ApiErrorDisplay error={error} resourceName="match" />
    </PageLayout>
  );
};

export default withRouteParams(MatchView);
