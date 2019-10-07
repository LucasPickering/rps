import { AxiosRequestConfig } from 'axios';

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
 * AxiosRequestConfig, but with improved type-checking
 */
export interface RequestConfig<P, D> extends AxiosRequestConfig {
  params?: P;
  data?: D;
}

/**
 * The generic request parameter format that the API uses for sorting, filters,
 * pagination, etc.
 */
export interface BaseRequestParams {
  limit?: number;
  offset?: number;
  search?: string;
  ordering?: string;
  q?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  previous?: string;
  next?: string;
  results: T;
}
