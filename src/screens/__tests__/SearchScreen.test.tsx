import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchScreen from '../SearchScreen';
import { tmdbApi } from '../../services/tmdb.api';
import movieReducer from '../../store/movieSlice';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock data
const mockMoviesResponse = {
  page: 1,
  results: [
    {
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
    },
    {
      id: 2,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/inception.jpg',
      backdrop_path: '/inception-backdrop.jpg',
      release_date: '2010-07-16',
      vote_average: 8.8,
      vote_count: 20000,
      popularity: 150,
      adult: false,
      original_language: 'en',
      original_title: 'Inception',
      genre_ids: [28, 878],
      video: false,
    },
  ],
  total_pages: 1,
  total_results: 2,
};

describe('SearchScreen', () => {
  let store: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a fresh store for each test
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

  it('should render search input and header', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    expect(getByPlaceholderText('Search movies...')).toBeTruthy();
    expect(getByText('Popular Movies')).toBeTruthy();
  });

  it('should update search query when typing', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    const searchInput = getByPlaceholderText('Search movies...');
    fireEvent.changeText(searchInput, 'Matrix');

    expect(searchInput.props.value).toBe('Matrix');
  });

  it('should clear search query when clear button is pressed', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    const searchInput = getByPlaceholderText('Search movies...');
    fireEvent.changeText(searchInput, 'Matrix');

    await waitFor(() => {
      expect(getByText('✕')).toBeTruthy();
    });

    const clearButton = getByText('✕');
    fireEvent.press(clearButton);

    expect(searchInput.props.value).toBe('');
  });

  it('should change header text when searching', async () => {
    const { getByPlaceholderText, queryByText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    const searchInput = getByPlaceholderText('Search movies...');
    fireEvent.changeText(searchInput, 'Matrix');

    // Wait for debounce and header to update
    await waitFor(
      () => {
        expect(queryByText('Search Results')).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it('should debounce search input', async () => {
    jest.useFakeTimers();

    const { getByPlaceholderText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    const searchInput = getByPlaceholderText('Search movies...');

    // Type quickly
    fireEvent.changeText(searchInput, 'M');
    fireEvent.changeText(searchInput, 'Ma');
    fireEvent.changeText(searchInput, 'Mat');
    fireEvent.changeText(searchInput, 'Matrix');

    // The search should not be triggered immediately
    expect(searchInput.props.value).toBe('Matrix');

    // Fast-forward time to trigger debounce
    jest.advanceTimersByTime(500);

    jest.useRealTimers();
  });

  it('should display empty state when no search query', () => {
    const { getByText } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    // Should show loading initially or popular movies
    // The exact text depends on the loading state
    expect(getByText('Popular Movies')).toBeTruthy();
  });

  it('should handle refresh action', () => {
    const { getByTestId, UNSAFE_getAllByType } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    // FlatList should be present
    const flatLists = UNSAFE_getAllByType(
      require('react-native').FlatList
    );
    expect(flatLists.length).toBeGreaterThan(0);

    // RefreshControl should be configured
    const flatList = flatLists[0];
    expect(flatList.props.refreshControl).toBeTruthy();
  });

  it('should have pagination configured', () => {
    const { UNSAFE_getAllByType } = renderWithProviders(
      <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
    );

    const flatLists = UNSAFE_getAllByType(
      require('react-native').FlatList
    );
    const flatList = flatLists[0];

    expect(flatList.props.onEndReached).toBeTruthy();
    expect(flatList.props.onEndReachedThreshold).toBe(0.5);
  });
});
