import { freq, tableToApiQuery } from 'util/funcs';

describe('Utility functions', () => {
  describe('freq', () => {
    it('returns 0 for empty array', () => {
      expect(freq([], 0)).toEqual(0);
    });

    it('returns the correct number for an element', () => {
      expect(freq([1, 2, 3, 1, 1], 1)).toEqual(3);
    });
  });

  describe('tableToApiQuery', () => {
    it('converts params correctly', () => {
      expect(
        tableToApiQuery({
          page: 3,
          pageSize: 10,
          filters: [],
          search: '',
          orderBy: {},
          orderDirection: 'asc',
        })
      ).toEqual({
        limit: 10,
        offset: 30,
      });
    });
  });
});
