import { ConnectionStatus } from 'hooks/useWebSocket';
import React from 'react';
import { GameOutcome, MatchOutcome, Move } from './match';

export interface LiveGame {
  selfMove: Move;
  opponentMove: Move;
  outcome: GameOutcome;
}

export interface LiveMatchStateData {
  bestOf: number;
  // undef if waiting on opponent
  opponent?: {
    name: string;
    isConnected: boolean;
    isReady: boolean;
  };
  isReady: boolean;
  selectedMove?: Move; // undef if no move selected yet
  games: LiveGame[];
  matchOutcome?: MatchOutcome; // undef if match in progress
}

export interface LiveMatchError {
  type: string;
  detail: string;
}

export interface LiveMatchState {
  data?: LiveMatchStateData;
  error?: LiveMatchError;
}

export enum LiveMatchActionType {
  MatchUpdate,
  Error,
}

export type LiveMatchAction =
  | {
      type: LiveMatchActionType.MatchUpdate;
      data: LiveMatchStateData;
    }
  | {
      type: LiveMatchActionType.Error;
      error: LiveMatchError;
    };

// This reducer should only ever be triggered by a server message
export const liveMatchReducer: React.Reducer<
  LiveMatchState,
  LiveMatchAction
> = (state, action) => {
  switch (action.type) {
    case LiveMatchActionType.MatchUpdate:
      return { ...state, data: action.data };
    default:
      return state;
  }
};

export enum ClientMessageType {
  Ready = 'ready',
  Move = 'move',
}

// More types will be added here
export type ClientMessage =
  | { type: ClientMessageType.Ready }
  | {
      type: ClientMessageType.Move;
      move: Move;
    };

export interface LiveMatchContextType {
  connectionStatus: ConnectionStatus;
  sendMessage: (msg: ClientMessage) => void;
  state: LiveMatchState;
}

export const LiveMatchContext = React.createContext<LiveMatchContextType>(
  {} as LiveMatchContextType // ...sigh - we shouldn't have to do this, but alas
);
