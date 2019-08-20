import queryString from 'query-string';

class RouteLocation<RouteParams = {}, QueryParams = {}> {
  public readonly templateRoute: string;

  public constructor(route: string) {
    this.templateRoute = route;
  }

  public build(routeParams: RouteParams, queryParams: QueryParams): string {
    // Replace each instance of `:<param>` with the param value
    const pathname = Object.entries(routeParams).reduce(
      (acc, [k, v]) => acc.replace(`:${k}`, v),
      this.templateRoute
    );
    return `${pathname}?${queryString.stringify(queryParams)}`;
  }
}

export default {
  home: new RouteLocation('/'),
  login: new RouteLocation<{}, { next?: string }>('/login'),
  match: new RouteLocation<{ matchId: string }>('/match/:matchId'),
};
