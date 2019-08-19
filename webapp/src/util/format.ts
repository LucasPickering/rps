import { GameOutcome, MatchOutcome } from 'state/match';
import { capitalize } from 'lodash';

export enum OutcomeFormat {
  Noun,
  PastTense,
}

export const formatGameOutcome = (
  outcome: GameOutcome,
  format: OutcomeFormat = OutcomeFormat.Noun
): string => {
  switch (format) {
    case OutcomeFormat.Noun:
      return capitalize(outcome);
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
  format: OutcomeFormat = OutcomeFormat.Noun
): string => {
  switch (format) {
    case OutcomeFormat.Noun:
      return capitalize(outcome);
    case OutcomeFormat.PastTense:
      return {
        [MatchOutcome.Win]: 'won',
        [MatchOutcome.Loss]: 'lost',
      }[outcome];
  }
};
