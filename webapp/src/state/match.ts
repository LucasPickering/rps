export enum Move {
  Rock = 'rock',
  Paper = 'paper',
  Scissors = 'scissors',
  Lizard = 'lizard',
  Spock = 'spock',
}

export interface MatchState {}

export enum MatchActionType {
  Start,
  Move,
}

export type MatchAction =
  | { type: MatchActionType.Start }
  | { type: MatchActionType.Move; move: Move };

export const defaultMatchState = {};

export const matchReducer: React.Reducer<MatchState, MatchAction> = (
  state,
  action
) => {
  switch (action.type) {
    case MatchActionType.Start:
      return { ...state };
    case MatchActionType.Move:
      return { ...state };
  }
};
