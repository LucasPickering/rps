import { GameOutcome, MatchOutcome } from 'state/match';
import { capitalize } from 'lodash';
import { Moment } from 'moment';

export type OutcomeFormat = 'noun' | 'past' | 'abbreviation';

export const formatGameOutcome = (
  outcome: GameOutcome,
  format: OutcomeFormat = 'noun'
): string => {
  switch (format) {
    case 'noun':
      return capitalize(outcome);
    case 'past':
      return {
        [GameOutcome.Win]: 'won',
        [GameOutcome.Loss]: 'lost',
        [GameOutcome.Tie]: 'tied',
      }[outcome];
    case 'abbreviation':
      return outcome.toString()[0].toUpperCase();
  }
};

export const formatMatchOutcome = (
  outcome: MatchOutcome,
  format: OutcomeFormat = 'noun'
): string => {
  switch (format) {
    case 'noun':
      return capitalize(outcome);
    case 'past':
      return {
        [MatchOutcome.Win]: 'won',
        [MatchOutcome.Loss]: 'lost',
      }[outcome];
    case 'abbreviation':
      return outcome.toString()[0].toUpperCase();
  }
};

export const formatDateTime = (date: Moment): string => {
  return date.format('MMMM D YYYY, h:mm a');
};
