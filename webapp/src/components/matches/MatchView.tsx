import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import useGetRequest from 'hooks/useGetRequest';
import { Match } from 'state/match';
import Paper from 'components/common/Paper';
import { formatDateTime, formatDuration } from 'util/format';
import moment from 'moment';
import PageLayout from 'components/common/PageLayout';
import useStyles from 'hooks/useStyles';
import { makeMatchLink, makePlayerRoute } from 'util/routes';
import Link from 'components/common/Link';
import GameLog from './GameLog';
import clsx from 'clsx';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from '@material-ui/icons';
import { useParams } from 'react-router';
import ApiDisplay from 'components/common/ApiDisplay';

interface RouteParams {
  matchId: string;
}

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
      <Typography className={clsx(classes.pageSubtitle, className)}>
        <Link to={makePlayerRoute(username)}>
          <strong>{username}</strong>
        </Link>
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
            <Link to={makeMatchLink(match.parent)}>
              <IconChevronLeft fontSize="small" />
              Rematch of
            </Link>
          )}
        </Grid>
        <Grid item xs={6} container justify="flex-end">
          {match.rematch && (
            <Link to={makeMatchLink(match.rematch)}>
              Rematch <IconChevronRight fontSize="small" />
            </Link>
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

const MatchView: React.FC = () => {
  const { matchId } = useParams<RouteParams>();
  const state = useGetRequest<Match>(`/api/matches/${matchId}/`);

  return (
    <PageLayout>
      <ApiDisplay resourceName="match" state={state}>
        {data =>
          data.id.toString() === matchId && <MatchDataView match={data} />
        }
      </ApiDisplay>
    </PageLayout>
  );
};

export default MatchView;
