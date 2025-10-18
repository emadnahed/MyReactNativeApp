import { getImageUrl } from '../tmdb.api';

describe('TMDB API Utilities', () => {
  describe('getImageUrl', () => {
    it('should return correct URL with default w500 size', () => {
      const url = getImageUrl('/abc123.jpg');
      expect(url).toContain('w500');
      expect(url).toContain('/abc123.jpg');
    });

    it('should return correct URL with w200 size', () => {
      const url = getImageUrl('/test.jpg', 'w200');
      expect(url).toContain('w200');
      expect(url).toContain('/test.jpg');
    });

    it('should return correct URL with original size', () => {
      const url = getImageUrl('/movie.jpg', 'original');
      expect(url).toContain('original');
      expect(url).toContain('/movie.jpg');
    });

    it('should return placeholder URL for null path', () => {
      const url = getImageUrl(null);
      expect(url).toContain('placeholder');
      expect(url).toContain('No+Image');
    });

    it('should return placeholder URL for empty string', () => {
      const url = getImageUrl('');
      expect(url).toContain('placeholder');
    });
  });
});
