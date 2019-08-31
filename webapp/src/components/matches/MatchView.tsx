import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import {
  Grid,
  CircularProgress,
  // makeStyles,
} from '@material-ui/core';
import useFetch from 'hooks/useFetch';
import ErrorSnackbar from 'components/common/ErrorSnackbar';
import { Match } from 'state/match';

// const useLocalStyles = makeStyles(({ typography }) => ({
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

const MatchView: React.FC<{
  matchId: number;
}> = ({ matchId }) => {
  const { loading, data, error } = useFetch<Match>(`/api/matches/${matchId}/`);

  return (
    <Grid item container direction="column" spacing={2} xs={4} sm={6}>
      {loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {data && <Grid item>{data.startTime}</Grid>}
      {error && <ErrorSnackbar message="An error occurred" />}
    </Grid>
  );
};

export default withRouteParams(MatchView);
