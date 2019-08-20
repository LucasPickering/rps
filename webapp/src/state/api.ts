export interface ApiError {
  status: number;
  // TODO
}

export interface ApiState<T> {
  loading: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiCallbacks<T> {
  onRequest?: () => void;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}
