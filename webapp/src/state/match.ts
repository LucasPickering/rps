import { find } from 'lodash';

export enum Move {
  Rock = 'rock',
  Paper = 'paper',
  Scissors = 'scissors',
  Lizard = 'lizard',
  Spock = 'spock',
}

export enum GameOutcome {
  Win = 'win',
  Loss = 'loss',
  Tie = 'tie',
}

export enum MatchOutcome {
  Win = 'win',
  Loss = 'loss',
}

export interface MatchConfig {
  bestOf: number;
  extendedMode: boolean;
}

export interface PlayerGame {
  username: string;
  move: Move;
}

export interface Match {
  id: number;
  startTime: string;
  duration: number;
  config: MatchConfig;
  games: {
    winner?: string;
    players: {
      username: string;
      move: Move;
    }[];
  }[];
  players: string[];
  winner: string;
}

/**
 * Utility function to extract a single player's move from the array of players
 * in a game.
 */
export const getPlayerMove = (
  players: PlayerGame[],
  username: string
): Move => {
  const pm = find(players, player => player.username === username);
  if (pm) {
    return pm.move;
  }
  // Fall back for invalid state condition - this indicates a bug in the API
  // eslint-disable-next-line no-console
  console.error(`Player ${username} not found in game ${players}`);
  return Move.Rock;
};
