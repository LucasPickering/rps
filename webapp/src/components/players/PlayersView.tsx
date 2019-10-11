import React from 'react';
import { PlayerSummary } from 'state/player';
import PlayerLink from './PlayerLink';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';
import MaterialTable, { Options } from 'material-table';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import useRequest from 'hooks/useRequest';
import { tableToApiQuery } from 'util/funcs';
import { formatWinPct } from 'util/format';

const tableOptions: Options = {
  pageSizeOptions: [],
};

const PlayersView: React.FC = () => {
  const {
    state: { loading, error },
    request,
  } = useRequest<PaginatedResponse<PlayerSummary[]>, {}, BaseRequestParams>({
    url: '/api/players/',
  });

  return (
    <PageLayout maxWidth="md">
      <MaterialTable
        title="Players"
        options={tableOptions}
        columns={[
          {
            title: 'Player',
            field: 'username',
            sorting: false,
            render: row => (
              <PlayerLink username={row.username}>{row.username}</PlayerLink>
            ),
          },
          {
            title: 'Wins',
            field: 'matchWinCount',
            type: 'numeric',
          },
          {
            title: 'Losses',
            field: 'matchLossCount',
            type: 'numeric',
          },
          {
            title: 'Win%',
            field: 'matchWinPct',
            type: 'numeric',
            defaultSort: 'desc',
            render: row => formatWinPct(row.matchWinPct),
          },
        ]}
        isLoading={loading}
        data={query =>
          request({
            params: {
              ...tableToApiQuery(query),
            },
          }).then(response => ({
            data: response.results,
            page: query.page,
            totalCount: response.count,
          }))
        }
      />
      <ApiErrorDisplay error={error} resourceName="player" />
    </PageLayout>
  );
};

export default PlayersView;
