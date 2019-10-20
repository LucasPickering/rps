import React from 'react';
import MaterialTable from 'material-table';
import { PlayerSummary } from 'state/player';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { makePlayerRoute } from 'util/routes';
import Link from 'components/common/Link';
import { formatWinPct } from 'util/format';

const tableOptions = {
  search: false,
  paging: false,
  sorting: false,
};

const Leaderboard: React.FC = () => {
  const {
    state: { loading },
    request,
  } = useRequest<PaginatedResponse<PlayerSummary[]>, {}, BaseRequestParams>({
    url: '/api/players/',
  });

  return (
    <MaterialTable
      title="Leaderboard"
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
          render: row => formatWinPct(row.matchWinPct),
        },
      ]}
      options={tableOptions}
      isLoading={loading}
      data={query =>
        request({
          params: {
            ...tableToApiQuery(query),
            ordering: '-match_win_pct,-match_count',
          },
        }).then(response => ({
          data: response.results,
          page: query.page,
          totalCount: response.count,
        }))
      }
    />
  );
};

export default Leaderboard;
