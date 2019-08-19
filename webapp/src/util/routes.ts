class RouteLocation<Params = {}> {
  public readonly templateRoute: string;

  public constructor(route: string) {
    this.templateRoute = route;
  }

  public build(params: Params): string {
    // Replace each instance of `:<param>` with the param value
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`:${k}`, v),
      this.templateRoute
    );
  }
}

export default {
  home: new RouteLocation('/'),
  login: new RouteLocation('/login'),
  match: new RouteLocation<{ matchId: string }>('/match/:matchId'),
};
