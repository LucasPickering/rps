import React from 'react';
import MaterialTable from 'material-table';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { LiveMatchMetadata } from 'state/livematch';
import { makeLiveMatchRoute } from 'util/routes';
import Link from 'components/common/Link';

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
          render: row => <Link to={makeLiveMatchRoute(row.id)}>Link</Link>,
        },
      ]}
      options={tableOptions}
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
  );
};

export default OngoingMatches;
