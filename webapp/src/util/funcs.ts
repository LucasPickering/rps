import React from 'react';

/**
 * Wraps the given HoC in logic that will add a better name to all
 * components created by it, reflecting how that component has been
 * wrapped. Removes boilerplate code that was included in every HoC.
 * @param hoc The HoC to wrap in name logic
 * @param name The name of this HoC
 */
export const makeHoc = <InnerProps, OuterProps>(
  hoc: (
    Component: React.ComponentType<InnerProps>
  ) => React.ComponentType<OuterProps>,
  name: string
): ((
  Component: React.ComponentType<InnerProps>
) => React.ComponentType<OuterProps>) => {
  return Component => {
    const WrappedComponent: React.ComponentType<OuterProps> = hoc(Component);

    const wrappedName = Component.displayName || Component.name || 'Component';
    WrappedComponent.displayName = `${name}(${wrappedName})`;
    return WrappedComponent;
  };
};

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
