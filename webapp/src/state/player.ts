import { Match, MatchOutcome, GameOutcome } from './match';
import { freq } from 'util/funcs';
import { first } from 'lodash';

export interface PlayerSummary {
  username: string;
  matchWinCount: number;
  matchLossCount: number;
  matchWinPct: number;
}

export interface PlayerHistory {
  username: string;
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
      `Multiple opponents found for username=${username}; match=${match}`
    );
  }
  const opponentName = first(otherPlayers);
  if (!opponentName) {
    throw new Error(
      `No opponent found for username=${username}; match=${match}`
    );
  }

  const gameOutcomes = match.games.map(game => {
    if (game.winner === username) {
      return GameOutcome.Win;
    }
    if (!game.winner) {
      return GameOutcome.Tie;
    }
    return GameOutcome.Loss;
  });

  return {
    opponentName,
    wins: freq(gameOutcomes, GameOutcome.Win),
    losses: freq(gameOutcomes, GameOutcome.Loss),
    ties: freq(gameOutcomes, GameOutcome.Tie),
    outcome: username === match.winner ? MatchOutcome.Win : MatchOutcome.Loss,
  };
};
