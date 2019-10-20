import { useLocation } from 'react-router';
import queryString from 'query-string';

/**
 * Converts the current router path to a query string, with the path encoded
 * under the variable "next". E.g. "/matches" => "?/matches". Intended to be
 * used with redirects/links to the login page.
 */
const usePathAsQuery = (): string => {
  // TODO include query params here
  const { pathname } = useLocation();
  return ['/', 'login'].includes(pathname)
    ? ''
    : '?' + queryString.stringify({ next: pathname }, { encode: false });
};

export default usePathAsQuery;
