import { Match, MatchOutcome } from './match';
import { freq } from 'util/funcs';
import { first } from 'lodash';

export interface PlayerSummary {
  username: string;
  matchWinCount: number;
  matchLossCount: number;
  matchWinPct: number;
}

export interface Player {
  username: string;
  matchWinCount: number;
  matchLossCount: number;
  matchWinPct: number;
  matches: Match[];
}

/**
 * Details on a match, from the perspective of one player.
 */
export interface PlayerMatch {
  opponentName: string;
  wins: number;
  losses: number;
  ties: number;
  outcome: MatchOutcome;
}

/**
 * Reformat the data for a match to be relative to one player, rather than
 * "absolute".
 */
export const getPlayerMatch = (username: string, match: Match): PlayerMatch => {
  const otherPlayers = match.players.filter(name => name !== username);
  if (otherPlayers.length > 1) {
    throw new Error(
      `Multiple opponents found for username=${username}; match=${JSON.stringify(
        match
      )}`
    );
  }
  const opponentName = first(otherPlayers);
  if (!opponentName) {
    throw new Error(
      `No opponent found for username=${username}; match=${JSON.stringify(
        match
      )}`
    );
  }

  const gameOutcomes = match.games.map(game => {
    if (game.winner === username) {
      return 'win';
    }
    if (!game.winner) {
      return 'tie';
    }
    return 'loss';
  });

  return {
    opponentName,
    wins: freq(gameOutcomes, 'win'),
    losses: freq(gameOutcomes, 'loss'),
    ties: freq(gameOutcomes, 'tie'),
    outcome: username === match.winner ? 'win' : 'loss',
  };
};
