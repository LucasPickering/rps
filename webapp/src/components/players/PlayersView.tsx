import React from 'react';
import { PlayerSummary } from 'state/player';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';
import PageLayout from 'components/common/PageLayout';
import MaterialTable, { Options } from 'material-table';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import useRequest from 'hooks/useRequest';
import { tableToApiQuery } from 'util/funcs';
import { formatWinPct } from 'util/format';
import { makePlayerRoute } from 'util/routes';
import Link from 'components/common/Link';

const tableOptions: Options = {
  pageSize: 10,
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
              <Link to={makePlayerRoute(row.username)}>{row.username}</Link>
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
