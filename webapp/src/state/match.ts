import { ConnectionStatus, Send } from 'hooks/useWebSocket';
import React from 'react';

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

export interface MatchState {
  bestOf: number;
  opponentName?: string; // undef if waiting on opponent
  gameInProgress: boolean;
  selectedMove?: Move; // undef if no move selected yet
  gameLog: GameOutcome[];
  matchOutcome?: MatchOutcome; // undef if match in progress
}

export const defaultMatchState: MatchState = {
  bestOf: 5, // TODO revert to 0
  opponentName: 'Nick', // TODO remove
  gameInProgress: false,
  gameLog: [],
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
  | { type: MatchActionType.GameEnd; gameLog: GameOutcome[] }
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
        gameLog: action.gameLog,
      };
    case MatchActionType.Move:
      return {
        ...state,
        selectedMove: action.move,
      };
    default:
      return state;
  }
};

export interface MatchContextType {
  connectionStatus: ConnectionStatus;
  send: Send;
  state: MatchState;
}

export const MatchContext = React.createContext<MatchContextType>(
  {} as MatchContextType // ...sigh - we shouldn't have to do this, but alas
);
