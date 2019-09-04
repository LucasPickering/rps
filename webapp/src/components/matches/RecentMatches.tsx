import React from 'react';
import MaterialTable, { Options } from 'material-table';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { Match } from 'state/match';
import PlayerLink from 'components/players/PlayerLink';
import MatchLink from './MatchLink';

const tableOptions: Options = {
  search: false,
  paging: false,
  sorting: false,
};

const RecentMatches: React.FC = () => {
  const {
    state: { loading },
    request,
  } = useRequest<PaginatedResponse<Match[]>>({ url: '/api/matches/' });

  return (
    <MaterialTable
      title="Recent Matches"
      columns={[
        { field: 'id', hidden: true },
        {
          title: 'Time',
          field: 'startTime',
          type: 'string',
          render: row => (
            <MatchLink matchId={row.id}>{row.startTime}</MatchLink>
          ),
        },
        {
          title: 'Winner',
          field: 'winner',
          type: 'string',
          render: row => (
            <PlayerLink username={row.winner}>{row.winner}</PlayerLink>
          ),
        },
      ]}
      options={tableOptions}
      isLoading={loading}
      data={query =>
        new Promise((resolve, reject) =>
          request({
            params: {
              ...tableToApiQuery(query),
              ordering: '-start_time',
              limit: 5,
            },
          })
            .then(response =>
              resolve({
                data: response.results,
                page: query.page,
                totalCount: response.count,
              })
            )
            .catch(error => reject(error))
        )
      }
    />
  );
};

export default RecentMatches;
