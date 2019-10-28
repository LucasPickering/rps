import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import useGetRequest from 'hooks/useGetRequest';
import { Match } from 'state/match';
import Panel from 'components/common/Panel';
import { formatDateTime, formatDuration } from 'util/format';
import moment from 'moment';
import PageLayout from 'components/common/PageLayout';
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
  playerName: {
    ...typography.h5,
  },
  rightText: {
    textAlign: 'right',
  },
}));

const PlayerName = ({
  username,
  rightSide,
}: {
  username: string;
  rightSide: boolean;
}): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <Grid item xs={4}>
      <Typography
        className={clsx(
          localClasses.playerName,
          rightSide && localClasses.rightText
        )}
      >
        <Link to={makePlayerRoute(username)}>
          <strong>{username}</strong>
        </Link>
      </Typography>
    </Grid>
  );
};

PlayerName.defaultProps = {
  rightSide: false,
};

const MatchDataView: React.FC<{ match: Match }> = ({ match }) => {
  const localClasses = useLocalStyles();
  const [player1, player2] = match.players;

  return (
    <Panel>
      <Grid container spacing={1}>
        <Grid item container justify="space-between">
          <PlayerName username={player1} />
          <Typography>vs</Typography>
          <PlayerName username={player2} rightSide />
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
    </Panel>
  );
};

const MatchView: React.FC = () => {
  const { matchId } = useParams<RouteParams>();
  const state = useGetRequest<Match>(`/api/matches/${matchId}/`);

  return (
    <PageLayout title="Match Details">
      <ApiDisplay resourceName="match" state={state}>
        {data =>
          data.id.toString() === matchId && <MatchDataView match={data} />
        }
      </ApiDisplay>
    </PageLayout>
  );
};

export default MatchView;
