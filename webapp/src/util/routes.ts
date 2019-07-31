class RouteLocation<Params = {}> {
  public readonly route: string;

  constructor(route: string) {
    this.route = route;
  }

  public build(params: Params): string {
    // Replace each instance of `:<param>` with the param value
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`:${k}`, v),
      this.route
    );
  }
}

export default {
  home: new RouteLocation('/'),
  login: new RouteLocation('/login'),
  match: new RouteLocation<{ matchId: string }>('/match/:matchId'),
};
