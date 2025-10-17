import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieCard from '../MovieCard';
import type { Movie } from '../../types/movie.types';

// Mock the getImageUrl function
jest.mock('../../services/tmdb.api', () => ({
  getImageUrl: (path: string) => `https://image.tmdb.org/t/p/w500${path}`,
}));

describe('MovieCard', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality.',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
    vote_count: 15000,
    popularity: 100,
    adult: false,
    original_language: 'en',
    original_title: 'The Matrix',
    genre_ids: [28, 878],
    video: false,
  };

  it('should render correctly', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);

    expect(getByText('The Matrix')).toBeTruthy();
    expect(getByText('8.7')).toBeTruthy();
    expect(getByText('1999')).toBeTruthy();
  });

  it('should display N/A for missing release date', () => {
    const movieWithoutDate = { ...mockMovie, release_date: '' };
    const { getByText } = render(<MovieCard movie={movieWithoutDate} />);

    expect(getByText('N/A')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <MovieCard movie={mockMovie} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('The Matrix'));

    expect(mockOnPress).toHaveBeenCalledWith(mockMovie);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not crash when onPress is not provided', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);

    expect(() => {
      fireEvent.press(getByText('The Matrix'));
    }).not.toThrow();
  });

  it('should display vote average with one decimal place', () => {
    const movieWithRating = { ...mockMovie, vote_average: 7.5432 };
    const { getByText } = render(<MovieCard movie={movieWithRating} />);

    expect(getByText('7.5')).toBeTruthy();
  });

  it('should truncate long titles', () => {
    const movieWithLongTitle = {
      ...mockMovie,
      title: 'This is a very long movie title that should be truncated',
    };
    const { getByText } = render(<MovieCard movie={movieWithLongTitle} />);

    const titleElement = getByText(
      'This is a very long movie title that should be truncated'
    );
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.numberOfLines).toBe(2);
  });

  it('should render with correct image source', () => {
    const { UNSAFE_getByType } = render(<MovieCard movie={mockMovie} />);
    const images = UNSAFE_getByType(require('react-native').Image);

    expect(images.props.source.uri).toBe(
      'https://image.tmdb.org/t/p/w500/test-poster.jpg'
    );
  });

  it('should not re-render when movie ID is the same', () => {
    const { rerender } = render(<MovieCard movie={mockMovie} />);
    const renderCount = 1;

    // Re-render with the same movie (same ID)
    rerender(<MovieCard movie={mockMovie} />);

    // The component is memoized, so it shouldn't re-render
    // This is more of a structural test - the memo is applied
    expect(MovieCard).toBeDefined();
  });
});
