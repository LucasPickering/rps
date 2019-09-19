import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { range } from 'lodash';
import useRequest from 'hooks/useRequest';
import { LiveMatchMetadata } from 'state/livematch';
import Form from 'components/common/Form';
import useStyles from 'hooks/useStyles';
import LoadingButton from 'components/common/LoadingButton';
import SelectControl from 'components/common/SelectControl';
import PageLayout from 'components/common/PageLayout';

const bestOfOptions = range(1, 23, 2);

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const NewLiveMatchView: React.FC = () => {
  const classes = useStyles();
  const [bestOf, setBestOf] = useState(5);
  const [extendedMode, setExtendedMode] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const {
    request,
    state: { loading, error },
  } = useRequest<
    LiveMatchMetadata,
    {},
    undefined,
    Omit<LiveMatchMetadata, 'id'>
  >({
    method: 'POST',
    url: '/api/matches/live/',
  });
  const [data, setData] = useState<LiveMatchMetadata | undefined>(undefined);

  // Once a response has come in, redirect based on the match ID
  if (data) {
    return <Redirect to={`/matches/live/${data.id}`} push />;
  }

  return (
    <PageLayout maxWidth="xs">
      <Form
        onSubmit={() =>
          request({
            data: { config: { bestOf, extendedMode, public: isPublic } },
          }).then(data => setData(data))
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
        <FormControlLabel
          control={
            <Switch
              checked={extendedMode}
              onChange={() => setExtendedMode(oldValue => !oldValue)}
            />
          }
          label="Lizard Spock"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={() => setIsPublic(oldValue => !oldValue)}
            />
          }
          label="Public"
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
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
    </PageLayout>
  );
};

export default NewLiveMatchView;
