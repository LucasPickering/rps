import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import useGetRequest from 'hooks/useGetRequest';
import { Player, getPlayerMatch } from 'state/player';
import Panel from 'components/common/Panel';
import { Match } from 'state/match';
import { formatMatchOutcome, formatDateTime, formatWinPct } from 'util/format';
import moment from 'moment';
import { makeMatchLink, makePlayerRoute } from 'util/routes';
import Link from 'components/common/Link';
import PageLayout from 'components/common/PageLayout';
import { fade } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import StaticTable from 'components/common/StaticTable';
import { useParams } from 'react-router';
import ApiDisplay from 'components/common/ApiDisplay';

interface RouteParams {
  username: string;
}

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
    <Panel
      className={clsx(
        localClasses.matchPanel,
        playerMatch.outcome === 'win' ? localClasses.win : localClasses.loss
      )}
    >
      <Typography>
        vs{' '}
        <Link to={makePlayerRoute(playerMatch.opponentName)}>
          <strong>{playerMatch.opponentName}</strong>
        </Link>
      </Typography>
      <Typography className={localClasses.matchStartTime}>
        <Link to={makeMatchLink(match.id)}>
          {formatDateTime(moment(match.startTime))}
        </Link>
      </Typography>
      <Typography className={localClasses.rightText}>
        {playerMatch.wins}-{playerMatch.losses}
      </Typography>
      <Typography className={localClasses.rightText}>
        {formatMatchOutcome(playerMatch.outcome, 'abbreviation')}
      </Typography>
    </Panel>
  );
};

const PlayerView: React.FC = () => {
  const { username } = useParams<RouteParams>();
  const state = useGetRequest<Player>(`/api/players/${username}/`);

  return (
    <PageLayout title={`Profile for ${username}`}>
      <ApiDisplay resourceName="player" state={state}>
        {data =>
          data.username === username && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Panel title="Record">
                  <StaticTable
                    size="small"
                    rows={[
                      { title: 'Wins', value: data.matchWinCount },
                      { title: 'Losses', value: data.matchLossCount },
                      { title: 'Win%', value: formatWinPct(data.matchWinPct) },
                    ]}
                  />
                </Panel>
              </Grid>
              {data.matches.map(match => (
                <Grid key={match.id} item xs={12}>
                  <MatchPanel username={username} match={match} />
                </Grid>
              ))}
            </Grid>
          )
        }
      </ApiDisplay>
    </PageLayout>
  );
};

export default PlayerView;
