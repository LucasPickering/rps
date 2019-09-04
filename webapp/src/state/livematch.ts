import React from 'react';
import { GameOutcome, MatchOutcome, Move } from './match';

export interface LiveGame {
  selfMove: Move;
  opponentMove: Move;
  outcome: GameOutcome;
}

export interface LiveMatchOpponent {
  username: string;
  isActive: boolean;
  isReady: boolean;
}

/**
 * Static data for a live match. This data is provided by an endpoint on first
 * connect, and never changes after that.
 */
export interface LiveMatchConfig {
  id: string;
  bestOf: number;
  extendedMode: boolean;
}

/**
 * Dynamic data for a live match. Provided via websocket, and changes
 * throughout a match.
 */
export interface LiveMatchData {
  opponent?: LiveMatchOpponent; // undef if waiting on opponent
  isReady: boolean;
  selectedMove?: Move; // undef if no move selected yet
  games: LiveGame[];
  matchOutcome?: MatchOutcome; // undef if match in progress
}

export enum LiveMatchErrorType {
  InvalidMatchId = 'invalid_match_id',
  NotLoggedIn = 'not_logged_in',
  GameFull = 'game_full',
  MalformedMessage = 'malformed_message',
  NotInMatch = 'not_in_match',
  InvalidMove = 'invalid_move',
}

export interface LiveMatchError {
  error: LiveMatchErrorType;
  detail: string;
}

/**
 * All the dynamic content that can come the live match websocket.
 */
export interface LiveMatchState {
  data: LiveMatchData;
  errors: LiveMatchError[];
}

export const defaultLiveMatchState = {
  data: {
    isReady: false,
    games: [],
  },
  errors: [],
};

export enum LiveMatchActionType {
  MatchUpdate,
  Error,
}

export type LiveMatchAction =
  | {
      type: LiveMatchActionType.MatchUpdate;
      data: LiveMatchData;
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
    case LiveMatchActionType.Error:
      return { ...state, errors: [...state.errors, action.error] };
    default:
      return state;
  }
};

export enum ClientMessageType {
  Heartbeat = 'heartbeat',
  Ready = 'ready',
  Move = 'move',
}

// More types will be added here
export type ClientMessage =
  | { type: ClientMessageType.Heartbeat | ClientMessageType.Ready }
  | {
      type: ClientMessageType.Move;
      move: Move;
    };

export interface LiveMatchContextType {
  sendMessage: (msg: ClientMessage) => void;
  config: LiveMatchConfig;
  state: LiveMatchState;
}

export const LiveMatchContext = React.createContext<LiveMatchContextType>(
  {} as LiveMatchContextType // ...sigh - we shouldn't have to do this, but alas
);
