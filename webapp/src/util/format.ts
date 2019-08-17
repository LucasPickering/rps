import { GameOutcome, MatchOutcome } from 'state/match';

export enum OutcomeFormat {
  PastTense,
}

export const formatGameOutcome = (
  outcome: GameOutcome,
  format: OutcomeFormat = OutcomeFormat.PastTense
): string => {
  switch (format) {
    case OutcomeFormat.PastTense:
      return {
        [GameOutcome.Win]: 'won',
        [GameOutcome.Loss]: 'lost',
        [GameOutcome.Tie]: 'tied',
      }[outcome];
  }
};

export const formatMatchOutcome = (
  outcome: MatchOutcome,
  format: OutcomeFormat = OutcomeFormat.PastTense
): string => {
  switch (format) {
    case OutcomeFormat.PastTense:
      return {
        [MatchOutcome.Win]: 'won',
        [MatchOutcome.Loss]: 'lost',
      }[outcome];
  }
};
