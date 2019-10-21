export type Move = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export type GameOutcome = 'win' | 'loss' | 'tie';

export type MatchOutcome = 'win' | 'loss';

export interface MatchConfig {
  bestOf: number;
  extendedMode: boolean;
  public: boolean;
}

export interface PlayerGame {
  username: string;
  move: Move;
}

export interface Game {
  gameNum: number;
  players: [PlayerGame, PlayerGame];
  winner?: string;
}

export interface Match {
  id: number;
  startTime: string;
  duration: number;
  config: MatchConfig;
  games: Game[];
  players: [string, string];
  winner: string;
  loser: string;
  parent?: number;
  rematch?: number;
}
