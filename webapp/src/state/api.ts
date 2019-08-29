export interface ApiError<T> {
  status: number;
  data: T;
  // TODO
}

export interface ApiState<T, E> {
  loading: boolean;
  data?: T;
  error?: ApiError<E>;
}

/**
 * The generic request parameter format that the API uses for sorting, filters,
 * pagination, etc.
 */
export interface RequestParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  q?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  previous?: string;
  next?: string;
  results: T;
}
