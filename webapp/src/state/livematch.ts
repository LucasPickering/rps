import { ConnectionStatus } from 'hooks/useWebSocket';
import React from 'react';
import { GameOutcome, MatchOutcome, Move } from './match';

export interface LiveGame {
  selfMove: Move;
  opponentMove: Move;
  outcome: GameOutcome;
}

export interface LiveMatchState {
  bestOf: number;
  // undef if waiting on opponent
  opponent?: {
    name: string;
    isConnected: boolean;
  };
  isGameInProgress: boolean;
  selectedMove?: Move; // undef if no move selected yet
  games: LiveGame[];
  matchOutcome?: MatchOutcome; // undef if match in progress
}

export const defaultLiveMatchState: LiveMatchState = {
  bestOf: 0,
  isGameInProgress: false,
  games: [],
};

export enum LiveMatchActionType {
  MatchUpdate,
}

export interface LiveMatchAction {
  type: LiveMatchActionType;
  state: LiveMatchState;
}

// This reducer should only ever be triggered by a server message
export const liveMatchReducer: React.Reducer<
  LiveMatchState,
  LiveMatchAction
> = (state, action) => {
  switch (action.type) {
    case LiveMatchActionType.MatchUpdate:
      return action.state;
    default:
      return state;
  }
};

export enum ClientMessageType {
  Move = 'move',
}

// More types will be added here
export interface ClientMessage {
  type: ClientMessageType.Move;
  move: Move;
}

export interface LiveMatchContextType {
  connectionStatus: ConnectionStatus;
  sendMessage: (msg: ClientMessage) => void;
  state: LiveMatchState;
}

export const LiveMatchContext = React.createContext<LiveMatchContextType>(
  {} as LiveMatchContextType // ...sigh - we shouldn't have to do this, but alas
);
