export type Error = string; // TODO

export interface ApiState<T> {
  loading: boolean;
  data?: T;
  error?: Error;
}

export const defaultApiState = {
  loading: false,
};

export interface ApiCallbacks<T> {
  onRequest?: () => void;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export enum ApiActionType {
  Request,
  Success,
  Error,
}

export type ApiAction<T> =
  | { type: ApiActionType.Request }
  | { type: ApiActionType.Success; data: T }
  | { type: ApiActionType.Error; error: Error };
