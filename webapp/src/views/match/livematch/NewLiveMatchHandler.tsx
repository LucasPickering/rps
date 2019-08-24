import React from 'react';
import { Redirect } from 'react-router-dom';
import useFetch from 'hooks/useFetch';

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const NewLiveMatchHandler: React.FC = () => {
  const { data } = useFetch<{ matchId: string }>('/api/matches/new/');

  if (data) {
    return <Redirect to={`/matches/live/${data.matchId}`} />;
  }
  return null;
};

export default NewLiveMatchHandler;
