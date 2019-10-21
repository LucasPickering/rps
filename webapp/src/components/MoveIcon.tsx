import React from 'react';
import { Move } from 'state/match';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

/**
 * Mapping of move->icon. We need this in an object to convince TS that the
 * icons names are always valid.
 */
const moveIcons: { [move: string]: IconName } = {
  rock: 'hand-rock',
  paper: 'hand-paper',
  scissors: 'hand-scissors',
  lizard: 'hand-lizard',
  spock: 'hand-spock',
};

/**
 * An icon for a single move. If no move is specified, a loading icon is shown
 */
const MoveIcon: React.FC<{
  className?: string;
  move: Move;
}> = ({ className, move }) => (
  <FontAwesomeIcon className={className} icon={moveIcons[move]} title={move} />
);

export default MoveIcon;
