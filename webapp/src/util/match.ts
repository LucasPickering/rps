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

export interface MatchState {
  opponentName?: string;
  gameInProgress: boolean;
  selectedMove?: Move;
  gameHistory: GameOutcome[];
}

export const defaultMatchState: MatchState = {
  opponentName: undefined,
  gameInProgress: false,
  selectedMove: undefined,
  gameHistory: [],
};

export enum MatchActionType {
  MatchJoin,
  GameStart,
  GameEnd,
  Move,
}

export type MatchAction =
  | { type: MatchActionType.MatchJoin; state: MatchState }
  | { type: MatchActionType.GameStart }
  | { type: MatchActionType.GameEnd; gameHistory: GameOutcome[] }
  | { type: MatchActionType.Move; move: Move };

export const matchReducer: React.Reducer<MatchState, MatchAction> = (
  state,
  action
) => {
  switch (action.type) {
    case MatchActionType.MatchJoin:
      return action.state;
    case MatchActionType.GameStart:
      return {
        ...state,
        gameInProgress: true,
      };
    case MatchActionType.GameEnd:
      // We might want to make this message return the entire game history
      return {
        ...state,
        gameInProgress: false,
        gameHistory: action.gameHistory,
      };
    case MatchActionType.Move:
      return {
        ...state,
        selectedMove: action.move,
      };
  }
};
