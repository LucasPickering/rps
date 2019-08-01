import React from 'react';
import { makeReducerContexts } from 'util/funcs';

export interface User {
  username: string;
  email: string;
}

export interface UserState {
  user?: User;
}

export const defaultUserState = {
  user: undefined,
};

export enum UserActionType {
  Login,
  Logout,
}

export type UserAction =
  | { type: UserActionType.Login; user: User }
  | { type: UserActionType.Logout };

export const userReducer: React.Reducer<UserState, UserAction> = (
  state,
  action
) => {
  switch (action.type) {
    case UserActionType.Login:
      return { ...state, user: action.user };
    case UserActionType.Logout:
      return { ...state, user: undefined };
  }
};

export const {
  StateContext: UserStateContext,
  DispatchContext: UserDispatchContext,
} = makeReducerContexts<UserState, UserAction>();
