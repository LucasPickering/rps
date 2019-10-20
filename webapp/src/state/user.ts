import React from 'react';
import { makeReducerContexts } from 'util/funcs';

export interface User {
  pk: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SocialAccount {
  id: number;
  provider: string;
  uid: string;
  lastLogin: string;
  dateJoined: string;
}

export interface UserState {
  loading: boolean;
  user?: User;
}

export const defaultUserState = {
  loading: true,
};

export enum UserActionType {
  Loading,
  Login,
  Logout,
}

export type UserAction =
  | { type: UserActionType.Loading }
  | { type: UserActionType.Login; user: User }
  | { type: UserActionType.Logout };

export const userReducer: React.Reducer<UserState, UserAction> = (
  _state,
  action
) => {
  switch (action.type) {
    case UserActionType.Loading:
      return { loading: true };
    case UserActionType.Login:
      return { loading: false, user: action.user };
    case UserActionType.Logout:
      return { loading: false, user: undefined };
  }
};

export const {
  StateContext: UserStateContext,
  DispatchContext: UserDispatchContext,
} = makeReducerContexts<UserState, UserAction>();
