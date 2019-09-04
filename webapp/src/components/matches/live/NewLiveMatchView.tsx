import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Typography, MenuItem } from '@material-ui/core';
import { Dictionary, range } from 'lodash';
import useRequest from 'hooks/useRequest';
import { LiveMatchConfig } from 'state/livematch';
import Form from 'components/common/Form';
import useStyles from 'hooks/useStyles';
import LoadingButton from 'components/common/LoadingButton';
import SelectControl from 'components/common/SelectControl';

const bestOfOptions = range(1, 23, 2);

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const NewLiveMatchView: React.FC = () => {
  const classes = useStyles();
  const [bestOf, setBestOf] = useState(5);
  const {
    request,
    state: { loading, error },
  } = useRequest<LiveMatchConfig>({
    method: 'POST',
    url: '/api/matches/live/',
  });
  const [data, setData] = useState<LiveMatchConfig | undefined>(undefined);

  const validationErrors: Dictionary<string> = {
    bestOf:
      bestOf <= 0 || bestOf % 2 === 0 ? 'Must be a positive odd number' : '',
  };

  // Once a response has come in, redirect based on the match ID
  if (data) {
    return <Redirect to={`/matches/live/${data.id}`} />;
  }

  return (
    <Form
      size="small"
      onSubmit={() =>
        request({ data: { best_of: bestOf } }).then(data => setData(data))
      }
    >
      <SelectControl
        id="bestOf-select"
        label="Best Of"
        value={bestOf}
        onChange={e => setBestOf(e.target.value as number)}
      >
        {bestOfOptions.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </SelectControl>
      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        loading={loading}
        disabled={Object.values(validationErrors).some(Boolean)}
      >
        Create Match
      </LoadingButton>
      {error && (
        <Typography className={classes.errorMessage}>
          {error.status === 400
            ? 'Incorrect username or password'
            : "Unknown error. Looks like you're really up shit creek."}
        </Typography>
      )}
    </Form>
  );
};

export default NewLiveMatchView;
