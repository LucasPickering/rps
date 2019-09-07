import { formatDuration } from 'util/format';
import moment from 'moment';

describe('Formatting functions', () => {
  describe('formatDuration', () => {
    it('returns "0s" for a zero duration', () => {
      expect(formatDuration(moment.duration(0, 'seconds'))).toEqual('0s');
    });

    it('returns only seconds for duration under a minute', () => {
      expect(formatDuration(moment.duration(19, 'seconds'))).toEqual('19s');
    });

    it('returns only seconds and minutes for duration under an hour', () => {
      expect(formatDuration(moment.duration(700, 'seconds'))).toEqual(
        '11m 40s'
      );
    });

    it('returns all segments for durations over an hour', () => {
      expect(formatDuration(moment.duration(3674, 'seconds'))).toEqual(
        '1h 1m 14s'
      );
    });

    it('returns all segments for on-the-hour durations', () => {
      expect(formatDuration(moment.duration(1, 'hour'))).toEqual('1h 0m 0s');
    });
  });
});
