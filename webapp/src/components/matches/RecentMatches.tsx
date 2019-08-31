import React from 'react';
import MaterialTable from 'material-table';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { Match } from 'state/match';
import PlayerLink from 'components/players/PlayerLink';

const tableOptions = {
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
        {
          title: 'Time',
          field: 'startTime',
          type: 'string',
        },
        {
          title: 'Winner',
          field: 'winner',
          type: 'string',
          render: row => <PlayerLink username={row.winner} />,
        },
      ]}
      options={tableOptions}
      isLoading={loading}
      data={query =>
        new Promise((resolve, reject) =>
          request({
            params: { ...tableToApiQuery(query), ordering: '-start_time' },
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
