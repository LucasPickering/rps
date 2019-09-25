import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MenuItem, makeStyles } from '@material-ui/core';
import { range } from 'lodash';
import useRequest from 'hooks/useRequest';
import { LiveMatchMetadata } from 'state/livematch';
import Form from 'components/common/Form';
import LoadingButton from 'components/common/LoadingButton';
import SelectControl from 'components/common/SelectControl';
import PageLayout from 'components/common/PageLayout';
import SwitchControl from 'components/common/SwitchControl';
import ApiErrorDisplay from 'components/common/ApiErrorDisplay';

const bestOfOptions = range(1, 23, 2);

const useLocalStyles = makeStyles({
  form: {
    alignSelf: 'center',
  },
});

/**
 * Initiates a GET request for a new match ID. When the response comes back,
 * this will redirect to the match page for that new ID.
 */
const NewLiveMatchView: React.FC = () => {
  const localClasses = useLocalStyles();
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
        className={localClasses.form}
        size="small"
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
        <SwitchControl
          label="Lizard Spock"
          checked={extendedMode}
          onChange={() => setExtendedMode(oldValue => !oldValue)}
        />
        <SwitchControl
          label="Public"
          checked={isPublic}
          onChange={() => setIsPublic(oldValue => !oldValue)}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
        >
          Create Match
        </LoadingButton>

        <ApiErrorDisplay error={error} />
      </Form>
    </PageLayout>
  );
};

export default NewLiveMatchView;
