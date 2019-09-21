import React from 'react';
import { Move, MatchConfig, Game } from './match';
import { noop } from 'lodash';

/**
 * Static data for a live match. This data is provided by an endpoint on first
 * connect, and never changes after that.
 */
export interface LiveMatchMetadata {
  id: string;
  config: MatchConfig;
}

export interface LivePlayerMatch {
  username: string;
  // undef if not chosen yet, or if this player is someone else and the game is
  // still in progress
  move?: Move;
  isActive: boolean;
  isReady: boolean;
}

/**
 * Dynamic data for a live match. Provided via websocket, and changes
 * throughout a match.
 */
export interface LiveMatchData {
  players: LivePlayerMatch[];
  games: Game[];
  permanentMatch?: number; // undef if match in progress
  winner?: string; // undef if match in progress
  rematch?: string; // ID for the rematch
  isParticipant: boolean; // true if playing in the match, false if spectating
}

export enum LiveMatchErrorType {
  UnknownMatchId = 'unknown_match_id',
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
  data?: LiveMatchData;
  errors: LiveMatchError[];
}

export const defaultLiveMatchState: LiveMatchState = {
  errors: [],
};

export enum LiveMatchActionType {
  MatchUpdate,
  Error,
  Reset,
}

export type LiveMatchAction =
  | {
      type: LiveMatchActionType.MatchUpdate;
      data: LiveMatchData;
    }
  | {
      type: LiveMatchActionType.Error;
      error: LiveMatchError;
    }
  | { type: LiveMatchActionType.Reset };

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
    case LiveMatchActionType.Reset:
      return defaultLiveMatchState;
    default:
      return state;
  }
};

export enum ClientMessageType {
  Heartbeat = 'heartbeat',
  Ready = 'ready',
  Move = 'move',
  Rematch = 'rematch',
}

// More types will be added here
export type ClientMessage =
  | {
      type:
        | ClientMessageType.Heartbeat
        | ClientMessageType.Ready
        | ClientMessageType.Rematch;
    }
  | {
      type: ClientMessageType.Move;
      move: Move;
    };

export const LiveMatchMetadataContext = React.createContext<LiveMatchMetadata>(
  {} as LiveMatchMetadata // ...sigh - we shouldn't have to do this, but alas
);

export const LiveMatchDataContext = React.createContext<LiveMatchData>(
  {} as LiveMatchData
);

export const LiveMatchSendMessageContext = React.createContext<
  (msg: ClientMessage) => void
>(noop);
