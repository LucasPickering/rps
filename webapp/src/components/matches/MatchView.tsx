import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import {
  Grid,
  CircularProgress,
  Typography,
  // makeStyles,
} from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import { Match } from 'state/match';
import PlayerLink from 'components/players/PlayerLink';
import Paper from 'components/common/Paper';
import { formatDateTime } from 'util/format';
import moment from 'moment';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';

// const useLocalStyles = makeStyles(() => ({
//   matchPanel: {
//     display: 'grid',
//     gridTemplateColumns: '70% 20% 10%',
//     gridTemplateRows: 'repeat(3, 1fr)',
//   },
//   matchStartTime: {
//     gridRow: 3,
//     gridColumn: 1,
//   },
//   matchScore: {
//     gridRow: 2,
//     gridColumn: 2,
//     ...typography.h5,
//   },
//   matchOutcome: {
//     gridRow: 2,
//     gridColumn: 3,
//     ...typography.h5,
//   },
// }));

const MatchDataView: React.FC<{ match: Match }> = ({ match }) => {
  const [player1, player2] = match.players;
  return (
    <Paper>
      <Grid container>
        <Grid item container justify="space-between">
          <Typography>
            <PlayerLink username={player1}>
              <strong>{player1}</strong>
            </PlayerLink>
          </Typography>
          <Typography>vs</Typography>
          <Typography>
            <PlayerLink username={player2}>
              <strong>{player2}</strong>
            </PlayerLink>
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Typography>
          {formatDateTime(moment(match.startTime))} ({match.duration}s)
          <br />
          Best of {match.config.bestOf}
          <br />
          Lizard/Spock: {match.config.extendedMode ? 'Enabled' : 'Disabled'}
        </Typography>
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
