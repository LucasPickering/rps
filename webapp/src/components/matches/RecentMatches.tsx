import React from 'react';
import MaterialTable, { Options } from 'material-table';
import useRequest from 'hooks/useRequest';
import { PaginatedResponse, BaseRequestParams } from 'state/api';
import { tableToApiQuery } from 'util/funcs';
import { Match } from 'state/match';
import { makeMatchLink, makePlayerRoute } from 'util/routes';
import Link from 'components/common/Link';
import moment from 'moment';

const tableOptions: Options = {
  search: false,
  paging: false,
  sorting: false,
};

const RecentMatches: React.FC = () => {
  const {
    state: { loading },
    request,
  } = useRequest<PaginatedResponse<Match[]>, {}, BaseRequestParams>({
    url: '/api/matches/',
  });

  return (
    <MaterialTable
      title="Recent Matches"
      options={tableOptions}
      columns={[
        { field: 'id', hidden: true },
        {
          title: 'Time',
          field: 'startTime',
          type: 'string',
          render: row => (
            <Link to={makeMatchLink(row.id)}>
              {moment(row.startTime).fromNow()}
            </Link>
          ),
        },
        {
          title: 'Winner',
          field: 'winner',
          type: 'string',
          render: row => (
            <Link to={makePlayerRoute(row.winner)}>{row.winner}</Link>
          ),
        },
        {
          title: 'Loser',
          field: 'loser',
          type: 'string',
          render: row => (
            <Link to={makePlayerRoute(row.loser)}>{row.loser}</Link>
          ),
        },
      ]}
      isLoading={loading}
      data={query =>
        request({
          params: {
            ...tableToApiQuery(query),
            ordering: '-start_time',
            limit: 5,
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

export default RecentMatches;
