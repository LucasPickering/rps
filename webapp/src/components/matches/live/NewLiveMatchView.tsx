import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useRequest from 'hooks/useRequest';
import { LiveMatchConfig } from 'state/livematch';
import { CircularProgress } from '@material-ui/core';

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const NewLiveMatchView: React.FC = () => {
  const { request } = useRequest<LiveMatchConfig>({
    method: 'POST',
    url: '/api/matches/live/',
  });
  const [data, setData] = useState<LiveMatchConfig | undefined>(undefined);

  useEffect(() => {
    request().then(data => setData(data));
  }, [request, setData]);

  // TODO: Make this an actual form
  if (data) {
    return <Redirect to={`/matches/live/${data.id}`} />;
  }
  return <CircularProgress />;
};

export default NewLiveMatchView;
