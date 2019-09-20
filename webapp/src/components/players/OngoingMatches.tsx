import React from 'react';
import MaterialTable from 'material-table';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { LiveMatchMetadata } from 'state/livematch';
import LiveMatchLink from 'components/matches/LiveMatchLink';

const tableOptions = {
  search: false,
  paging: false,
  sorting: false,
};

const OngoingMatches: React.FC = () => {
  const {
    state: { loading },
    request,
  } = useRequest<PaginatedResponse<LiveMatchMetadata[]>, {}, BaseRequestParams>(
    {
      url: '/api/matches/live/',
    }
  );

  return (
    <MaterialTable
      title="Ongoing Matches"
      columns={[
        {
          title: 'Link',
          field: 'id',
          sorting: false,
          render: row => <LiveMatchLink matchId={row.id}>Link</LiveMatchLink>,
        },
      ]}
      options={tableOptions}
      isLoading={loading}
      data={query =>
        new Promise((resolve, reject) =>
          request({
            params: {
              ...tableToApiQuery(query),
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

export default OngoingMatches;
