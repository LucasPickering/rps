import React, { useContext } from 'react';
import { GameOutcome, MatchContext, MatchState } from 'state/match';

const outcomeLabel = {
  [GameOutcome.Win]: 'W',
  [GameOutcome.Loss]: 'L',
  [GameOutcome.Tie]: 'T',
};

/**
 * Outline component with visual data about the current match, such as score.
 * Shown during all states of a match.
 */
const MatchOutline: React.FC = ({ children }) => {
  const {
    state: { gameHistory, bestOf, opponentName },
  } = useContext(MatchContext);

  // lodash?
  const wins = gameHistory.filter(outcome => outcome === GameOutcome.Win)
    .length;
  const losses = gameHistory.filter(outcome => outcome === GameOutcome.Loss)
    .length;

  return (
    <div>
      <div>You: {wins}</div>
      <div>
        {opponentName}: {losses}
      </div>
      <p>Best of {bestOf}</p>
      <div>{gameHistory.map(outcome => outcomeLabel[outcome])}</div>
      <div>{children}</div>
    </div>
  );
};

export default MatchOutline;
