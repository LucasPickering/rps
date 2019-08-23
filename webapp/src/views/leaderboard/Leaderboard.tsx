import React from 'react';
import MaterialTable from 'material-table';
import { PlayerSummary } from 'state/player';
import useFetch from 'hooks/useFetch';

const tableOptions = {
  search: false,
  paging: false,
};

const Leaderboard: React.FC = () => {
  const { loading, data } = useFetch<PlayerSummary[]>('/api/players/');

  return (
    <MaterialTable
      title="Leaderboard"
      columns={[
        { title: 'Player', field: 'username' },
        { title: 'Match Wins', field: 'matchWins' },
      ]}
      options={tableOptions}
      isLoading={loading}
      data={data || []}
    />
  );
};

export default Leaderboard;
