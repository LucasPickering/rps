import { Typography, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { LiveMatchContext } from 'state/livematch';
import GameLog from './GameLog';
import PlayerScore from './PlayerScore';
import MoveIconCircle from './MoveIconCircle';
import useScreenSize, { ScreenSize } from 'hooks/useScreenSize';
import FlexBox from 'components/common/FlexBox';

/**
 * Helper component for the current match status. Used by participants and
 * spectators.
 */
const LiveMatchHeader: React.FC = () => {
  const {
    metadata: {
      config: { bestOf },
    },
    data: { player1, player2, games, isParticipant },
  } = useContext(LiveMatchContext);
  const screenSize = useScreenSize();

  const [leftPlayer, rightPlayer] = [player1, player2];

  const leftScoreEl = <PlayerScore player={player1} />;
  const leftMoveEl = leftPlayer && (
    <MoveIconCircle
      loading={!isParticipant && !leftPlayer.move}
      move={leftPlayer.move}
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
  const rightMoveEl = rightPlayer && (
    <MoveIconCircle loading={!rightPlayer.move} move={rightPlayer.move} />
  );
  const rightScoreEl = <PlayerScore rightSide player={player2} />;

  // Responsive design!
  return screenSize === ScreenSize.Large ? (
    <Grid container justify="space-between">
      {leftScoreEl}
      {leftMoveEl}
      <FlexBox flexDirection="column" alignItems="center">
        {bestOfEl}
        {gameLogEl}
      </FlexBox>
      {rightMoveEl}
      {rightScoreEl}
    </Grid>
  ) : (
    <>
      <Grid item container justify="space-between">
        {leftScoreEl}
        {rightScoreEl}
      </Grid>
      <Grid item container justify="space-between">
        {leftMoveEl}
        {bestOfEl}
        {gameLogEl}
        {rightMoveEl}
      </Grid>
    </>
  );
};

export default LiveMatchHeader;
