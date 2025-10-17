import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MovieDetailsScreen from '../MovieDetailsScreen';
import { tmdbApi } from '../../services/tmdb.api';
import movieReducer from '../../store/movieSlice';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock movie details data
const mockMovieDetails = {
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
  tagline: 'Welcome to the Real World',
  runtime: 136,
  budget: 63000000,
  revenue: 463517383,
  status: 'Released',
  genres: [
    { id: 28, name: 'Action' },
    { id: 878, name: 'Science Fiction' },
  ],
  production_companies: [
    { id: 1, name: 'Warner Bros.', logo_path: null, origin_country: 'US' },
  ],
};

describe('MovieDetailsScreen', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    store = configureStore({
      reducer: {
        movie: movieReducer,
        [tmdbApi.reducerPath]: tmdbApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('should render loading state initially', () => {
    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    expect(getByText('Loading movie details...')).toBeTruthy();
  });

  it('should display movie title and tagline', async () => {
    // Mock the API response
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('The Matrix')).toBeTruthy();
      expect(getByText('"Welcome to the Real World"')).toBeTruthy();
    });
  });

  it('should display movie rating', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('8.7')).toBeTruthy();
    });
  });

  it('should display formatted runtime', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('2h 16m')).toBeTruthy();
    });
  });

  it('should display genres', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('Action')).toBeTruthy();
      expect(getByText('Science Fiction')).toBeTruthy();
    });
  });

  it('should display overview section', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('Overview')).toBeTruthy();
      expect(
        getByText('A computer hacker learns about the true nature of reality.')
      ).toBeTruthy();
    });
  });

  it('should display budget and revenue', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('$63.0M')).toBeTruthy();
      expect(getByText('$463.5M')).toBeTruthy();
    });
  });

  it('should display production companies', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('Production Companies')).toBeTruthy();
      expect(getByText('• Warner Bros.')).toBeTruthy();
    });
  });

  it('should display status', async () => {
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(getByText('Released')).toBeTruthy();
    });
  });

  it('should handle missing tagline gracefully', async () => {
    const movieWithoutTagline = { ...mockMovieDetails, tagline: null };
    const mockQuery = jest.spyOn(tmdbApi.endpoints.getMovieDetails, 'useQuery');
    mockQuery.mockReturnValue({
      data: movieWithoutTagline,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    } as any);

    const { queryByText } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    await waitFor(() => {
      expect(queryByText(/".*"/)).toBeNull();
    });
  });
});
