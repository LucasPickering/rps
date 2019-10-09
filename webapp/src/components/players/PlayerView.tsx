import React from 'react';
import withRouteParams from 'hoc/withRouteParams';
import {
  Grid,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import useGetRequest from 'hooks/useGetRequest';
import { Player, getPlayerMatch } from 'state/player';
import Paper from 'components/common/Paper';
import useStyles from 'hooks/useStyles';
import { Match } from 'state/match';
import { formatMatchOutcome, formatDateTime, formatWinPct } from 'util/format';
import moment from 'moment';
import PlayerLink from './PlayerLink';
import MatchLink from 'components/matches/MatchLink';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';
import { fade } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import StaticTable from 'components/common/StaticTable';

const useLocalStyles = makeStyles(({ palette, customPalette, typography }) => ({
  matchPanel: {
    display: 'grid',
    gridTemplateColumns: '4fr 1fr 1fr',
    gridTemplateRows: 'repeat(2, 1fr)',
    alignItems: 'center',
  },
  win: {
    backgroundColor: fade(customPalette.success.main, 0.2),
  },
  loss: {
    backgroundColor: fade(palette.error.main, 0.2),
  },
  matchStartTime: {
    gridRow: 2,
    gridColumn: 1,
  },
  rightText: {
    gridRow: '1 / 3',
    textAlign: 'right',
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
    <Paper
      className={clsx(
        localClasses.matchPanel,
        playerMatch.outcome === 'win' ? localClasses.win : localClasses.loss
      )}
    >
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
      <Typography className={localClasses.rightText}>
        {playerMatch.wins}-{playerMatch.losses}
      </Typography>
      <Typography className={localClasses.rightText}>
        {formatMatchOutcome(playerMatch.outcome, 'abbreviation')}
      </Typography>
    </Paper>
  );
};

const PlayerView: React.FC<{
  username: string;
}> = ({ username }) => {
  const classes = useStyles();
  const { loading, data, error } = useGetRequest<Player>(
    `/api/players/${username}/`
  );

  return (
    <PageLayout>
      <Typography className={classes.pageSubtitle}>{username}</Typography>
      {loading && <CircularProgress />}
      {data && data.username === username && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper>
              <Typography className={classes.panelTitle}>Record</Typography>
              <StaticTable
                size="small"
                rows={[
                  { title: 'Wins', value: data.matchWinCount },
                  { title: 'Losses', value: data.matchLossCount },
                  { title: 'Win%', value: formatWinPct(data.matchWinPct) },
                ]}
              />
            </Paper>
          </Grid>
          {data.matches.map(match => (
            <Grid key={match.id} item xs={12}>
              <MatchPanel username={username} match={match} />
            </Grid>
          ))}
        </Grid>
      )}
      <ApiErrorDisplay error={error} resourceName="player" />
    </PageLayout>
  );
};

export default withRouteParams(PlayerView);
