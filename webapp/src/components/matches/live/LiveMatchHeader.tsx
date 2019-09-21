import { Typography, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import {
  LiveMatchDataContext,
  LiveMatchMetadataContext,
} from 'state/livematch';
import GameLog from '../GameLog';
import PlayerScore from './PlayerScore';
import MoveIconCircle from './MoveIconCircle';
import useScreenSize from 'hooks/useScreenSize';
import FlexBox from 'components/common/FlexBox';

/**
 * Helper component for the current match status. Used by participants and
 * spectators.
 */
const LiveMatchHeader: React.FC = () => {
  const {
    config: { bestOf },
  } = useContext(LiveMatchMetadataContext);
  const { players, games, isParticipant } = useContext(LiveMatchDataContext);
  const screenSize = useScreenSize();

  const [player1, player2] = players;

  const leftScoreEl = <PlayerScore player={player1} />;
  const leftMoveEl = (
    <MoveIconCircle
      loading={!isParticipant && player1 && !player1.move}
      move={player1 && player1.move}
    />
  );
  const bestOfEl = <Typography variant="h5">Best of {bestOf}</Typography>;
  const gameLogEl = player1 && player2 && (
    <GameLog
      player1={player1.username}
      player2={player2.username}
      games={games}
    />
  );
  const rightMoveEl = (
    <MoveIconCircle
      loading={player2 && !player2.move}
      move={player2 && player2.move}
    />
  );
  const rightScoreEl = <PlayerScore rightSide player={player2} />;

  // Responsive design!
  return screenSize === 'large' ? (
    <Grid container justify="space-between">
      <Grid item xs={3}>
        {leftScoreEl}
      </Grid>
      {leftMoveEl}
      <FlexBox flexDirection="column" alignItems="center">
        {bestOfEl}
        {gameLogEl}
      </FlexBox>
      {rightMoveEl}
      <Grid item xs={3}>
        {rightScoreEl}
      </Grid>
    </Grid>
  ) : (
    <>
      <Grid container justify="space-between">
        <Grid item xs={6}>
          {leftScoreEl}
        </Grid>
        <Grid item xs={6}>
          {rightScoreEl}
        </Grid>
      </Grid>
      <Grid item container justify="space-between">
        {leftMoveEl}
        <Grid item>
          {bestOfEl}
          {gameLogEl}
        </Grid>
        {rightMoveEl}
      </Grid>
    </>
  );
};

export default LiveMatchHeader;
