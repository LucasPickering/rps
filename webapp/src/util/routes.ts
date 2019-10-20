import { Location } from 'history';

import queryString from 'query-string';

export const makePlayerRoute = (username: string): string =>
  `/players/${username}`;

export const makeMatchLink = (matchId: number): string => `/matches/${matchId}`;

export const makeLiveMatchRoute = (matchId: string): string =>
  `/matches/live/${matchId}`;

export const makeLoginRoute = ({ pathname, search }: Location): string => {
  const query = ['/', 'login'].includes(pathname)
    ? ''
    : '?' + queryString.stringify({ next: `${pathname}${search}` });
  return `/account/login${query}`;
};
