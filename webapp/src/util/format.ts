import { GameOutcome, MatchOutcome } from 'state/match';
import { capitalize } from 'lodash';
import { Moment, Duration } from 'moment';

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
        win: 'won',
        loss: 'lost',
        tie: 'tied',
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
        win: 'won',
        loss: 'lost',
      }[outcome];
    case 'abbreviation':
      return outcome.toString()[0].toUpperCase();
  }
};

export const formatDateTime = (
  date: Moment,
  format: string = 'MMM D YYYY, h:mm a'
): string => {
  return date.format(format);
};

/**
 * Formats a duration to be human-friendly, e.g. "1h 12m 19s"
 */
export const formatDuration = (duration: Duration): string => {
  const durationHrs = duration.hours();
  const durationMin = duration.minutes();
  const durationHrsFmt = durationHrs ? `${durationHrs}h ` : '';
  const durationMinFmt = durationHrs || durationMin ? `${durationMin}m ` : '';
  const durationSecFmt = `${duration.seconds()}s`;
  return `${durationHrsFmt}${durationMinFmt}${durationSecFmt}`;
};
