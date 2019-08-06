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
  MatchUpdate,
}

export interface MatchAction {
  type: MatchActionType;
  state: MatchState;
}

// This reducer should only ever be triggered by a server message
export const matchReducer: React.Reducer<MatchState, MatchAction> = (
  state,
  action
) => {
  console.log(action);
  switch (action.type) {
    case MatchActionType.MatchUpdate:
      return action.state;
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
