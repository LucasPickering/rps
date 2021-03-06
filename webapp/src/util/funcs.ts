import React from 'react';
import camelcaseKeys from 'camelcase-keys';
import { BaseRequestParams } from 'state/api';
import { Query } from 'material-table';
import { snakeCase } from 'lodash';

/**
 * Counts the number of occurrences of an element in an array.
 * @param arr the array to count in
 * @param el the element to count for
 * @return the number of times el appears in arr (by === equality)
 */
export const freq = <T>(arr: T[], el: T): number =>
  arr.filter(e => e === el).length;

/**
 * Creates a pair of contexts for the state and dispatch of a useReducer.
 * Splitting the two is recommended by the React docs.
 * @return The two contexts
 */
export const makeReducerContexts = <State, Action>(): {
  StateContext: React.Context<State>;
  DispatchContext: React.Context<React.Dispatch<Action>>;
} => {
  return {
    StateContext: React.createContext<State>({} as State),
    DispatchContext: React.createContext<React.Dispatch<Action>>(
      {} as React.Dispatch<Action>
    ),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tableToApiQuery = <T extends Record<string, any>>(
  query: Query<T>
): BaseRequestParams => {
  return {
    limit: query.pageSize,
    offset: query.page * query.pageSize,
    search: query.search || undefined, // Replace '' with undefined
    ordering:
      query.orderBy &&
      query.orderBy.field &&
      (query.orderDirection === 'desc' ? '-' : '') +
        snakeCase(query.orderBy.field.toString()),
  };
};

export const gamesToWin = (bestOf: number): number => Math.ceil(bestOf / 2);

/**
 * Recursively convert the keys in the gievn object to camel case.
 */
export const objToCamelCase = <T>(obj: object): T =>
  // This is probably safe, right?
  (camelcaseKeys(obj, {
    deep: true,
  }) as unknown) as T;
