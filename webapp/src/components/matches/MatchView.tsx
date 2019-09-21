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
import { formatDateTime, formatDuration } from 'util/format';
import moment from 'moment';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';
import useStyles from 'hooks/useStyles';
import MatchLink from './MatchLink';
import GameLog from './GameLog';
import clsx from 'clsx';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from '@material-ui/icons';

const useLocalStyles = makeStyles(({ typography }) => ({
  configText: {
    '& > .MuiTypography-root': {
      ...typography.body2,
    },
  },
  rightText: {
    textAlign: 'right',
  },
}));

const PlayerName: React.FC<{ className?: string; username: string }> = ({
  className,
  username,
}) => {
  const classes = useStyles();
  return (
    <Grid item xs={4}>
      <Typography className={clsx(classes.normalMessage, className)}>
        <PlayerLink username={username}>
          <strong>{username}</strong>
        </PlayerLink>
      </Typography>
    </Grid>
  );
};

const MatchDataView: React.FC<{ match: Match }> = ({ match }) => {
  const localClasses = useLocalStyles();
  const [player1, player2] = match.players;

  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item container justify="space-between">
          <PlayerName username={player1} />
          <Typography>vs</Typography>
          <PlayerName className={localClasses.rightText} username={player2} />
        </Grid>

        <Grid className={localClasses.configText} item xs={12}>
          <Typography>
            {formatDateTime(moment(match.startTime))} (
            {formatDuration(moment.duration(match.duration, 'seconds'))})
          </Typography>
          <Typography>Best of {match.config.bestOf}</Typography>
          <Typography>
            Lizard/Spock: {match.config.extendedMode ? 'Enabled' : 'Disabled'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {match.parent && (
            <MatchLink matchId={match.parent}>
              <IconChevronLeft fontSize="small" />
              Rematch of
            </MatchLink>
          )}
        </Grid>
        <Grid item xs={6} container justify="flex-end">
          {match.rematch && (
            <MatchLink matchId={match.rematch}>
              Rematch <IconChevronRight fontSize="small" />
            </MatchLink>
          )}
        </Grid>

        <Grid item xs={12} container justify="center">
          <GameLog
            size="large"
            player1={player1}
            player2={player2}
            games={match.games}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const MatchView: React.FC<{
  matchId: number;
}> = ({ matchId }) => {
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
