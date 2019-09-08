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
}
