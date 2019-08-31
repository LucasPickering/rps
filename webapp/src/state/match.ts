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

export interface Match {
  id: number;
  startTime: string;
  duration: number;
  bestOf: number;
  games: {
    winner?: string;
    players: {
      username: string;
      move: string;
    }[];
  }[];
  players: string[];
  winner: string;
}
