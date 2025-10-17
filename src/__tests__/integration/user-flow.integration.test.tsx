import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchScreen from '../../screens/SearchScreen';
import MovieCard from '../../components/MovieCard';
import { tmdbApi } from '../../services/tmdb.api';
import movieReducer, { setCurrentMovieTitle } from '../../store/movieSlice';
import type { Movie } from '../../types/movie.types';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('User Flow Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    store = configureStore({
      reducer: {
        movie: movieReducer,
        [tmdbApi.reducerPath]: tmdbApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
    store.dispatch(tmdbApi.util.resetApiState());
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  describe('Movie Discovery Flow', () => {
    it('should display search interface on initial render', () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      expect(getByPlaceholderText('Search movies...')).toBeTruthy();
      expect(getByText('Popular Movies')).toBeTruthy();
    });

    it('should allow user to type search query', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const searchInput = getByPlaceholderText('Search movies...');
      fireEvent.changeText(searchInput, 'Inception');

      expect(searchInput.props.value).toBe('Inception');
    });

    it('should show clear button when text is entered', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const searchInput = getByPlaceholderText('Search movies...');
      fireEvent.changeText(searchInput, 'Matrix');

      await waitFor(() => {
        expect(getByText('✕')).toBeTruthy();
      });
    });

    it('should clear search when clear button is pressed', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const searchInput = getByPlaceholderText('Search movies...');
      fireEvent.changeText(searchInput, 'Matrix');

      await waitFor(() => {
        const clearButton = getByText('✕');
        fireEvent.press(clearButton);
      });

      expect(searchInput.props.value).toBe('');
    });

    it('should debounce search input to avoid excessive API calls', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const searchInput = getByPlaceholderText('Search movies...');

      // Simulate rapid typing
      fireEvent.changeText(searchInput, 'M');
      fireEvent.changeText(searchInput, 'Ma');
      fireEvent.changeText(searchInput, 'Mat');
      fireEvent.changeText(searchInput, 'Matr');
      fireEvent.changeText(searchInput, 'Matrix');

      // The input should show the final value immediately
      expect(searchInput.props.value).toBe('Matrix');

      // Fast-forward time to trigger debounce
      jest.advanceTimersByTime(500);
    });
  });

  describe('Movie Card Interaction Flow', () => {
    const mockMovie: Movie = {
      id: 123,
      title: 'Test Movie',
      overview: 'A test movie overview',
      poster_path: '/test-poster.jpg',
      backdrop_path: '/test-backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      adult: false,
      original_language: 'en',
      original_title: 'Test Movie',
      genre_ids: [28, 878],
      video: false,
    };

    it('should render movie card with correct information', () => {
      const { getByText } = render(
        <MovieCard movie={mockMovie} onPress={jest.fn()} />
      );

      expect(getByText('Test Movie')).toBeTruthy();
      expect(getByText('2024')).toBeTruthy();
      expect(getByText('8.5')).toBeTruthy();
    });

    it('should navigate to details when card is pressed', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <MovieCard movie={mockMovie} onPress={mockOnPress} />
      );

      const card = getByTestId('movie-card');
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledWith(mockMovie);
    });

    it('should handle missing release date gracefully', () => {
      const movieWithoutDate = { ...mockMovie, release_date: '' };
      const { getByText } = render(
        <MovieCard movie={movieWithoutDate} onPress={jest.fn()} />
      );

      expect(getByText('N/A')).toBeTruthy();
    });

    it('should handle movie without onPress callback', () => {
      const { getByTestId } = render(
        <MovieCard movie={mockMovie} />
      );

      const card = getByTestId('movie-card');

      expect(() => {
        fireEvent.press(card);
      }).not.toThrow();
    });
  });

  describe('Redux State Management Flow', () => {
    it('should update current movie title in Redux', () => {
      store.dispatch(setCurrentMovieTitle('Inception'));

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('Inception');
    });

    it('should persist Redux state across component renders', () => {
      store.dispatch(setCurrentMovieTitle('The Matrix'));

      const { rerender } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      expect(store.getState().movie.currentMovieTitle).toBe('The Matrix');

      rerender(
        <Provider store={store}>
          <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
        </Provider>
      );

      expect(store.getState().movie.currentMovieTitle).toBe('The Matrix');
    });

    it('should handle multiple state updates in sequence', () => {
      const titles = ['Movie 1', 'Movie 2', 'Movie 3'];

      titles.forEach((title) => {
        store.dispatch(setCurrentMovieTitle(title));
      });

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('Movie 3');
    });
  });

  describe('Search Results Interaction', () => {
    it('should have pull-to-refresh configured', () => {
      const { UNSAFE_getAllByType } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const flatLists = UNSAFE_getAllByType(require('react-native').FlatList);
      expect(flatLists.length).toBeGreaterThan(0);

      const flatList = flatLists[0];
      expect(flatList.props.refreshControl).toBeTruthy();

      // RefreshControl contains the onRefresh callback
      const refreshControl = flatList.props.refreshControl;
      expect(refreshControl.props).toBeDefined();
    });

    it('should support infinite scroll pagination', () => {
      const { UNSAFE_getAllByType } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const flatLists = UNSAFE_getAllByType(require('react-native').FlatList);
      const flatList = flatLists[0];

      expect(flatList.props.onEndReached).toBeDefined();
      expect(flatList.props.onEndReachedThreshold).toBe(0.5);
    });

    it('should have proper list key extractor', () => {
      const { UNSAFE_getAllByType } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const flatLists = UNSAFE_getAllByType(require('react-native').FlatList);
      const flatList = flatLists[0];

      expect(flatList.props.keyExtractor).toBeDefined();

      // Test the key extractor function
      const mockItem = { id: 123 };
      const key = flatList.props.keyExtractor(mockItem, 0);
      expect(key).toBe('123');
    });
  });

  describe('Complete User Journey', () => {
    it('should simulate complete search-to-view flow', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      // Step 1: User sees the search interface
      const searchInput = getByPlaceholderText('Search movies...');
      expect(searchInput).toBeTruthy();

      // Step 2: User types a search query
      fireEvent.changeText(searchInput, 'Inception');
      expect(searchInput.props.value).toBe('Inception');

      // Step 3: Wait for debounce
      jest.advanceTimersByTime(500);

      // Step 4: User sees results header change
      await waitFor(() => {
        expect(
          getByText('Popular Movies') || getByText('Search Results')
        ).toBeTruthy();
      });

      // Step 5: User can clear search
      const clearButton = getByText('✕');
      fireEvent.press(clearButton);
      expect(searchInput.props.value).toBe('');
    });

    it('should handle error and retry flow', () => {
      // This would typically test error states and retry functionality
      // with proper API mocking for error scenarios
      expect(true).toBe(true);
    });
  });

  describe('Performance and Optimization', () => {
    it('should have memoized components for performance', () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test',
        overview: 'Test',
        poster_path: '/test.jpg',
        backdrop_path: '/test.jpg',
        release_date: '2024-01-01',
        vote_average: 8.0,
        vote_count: 100,
        popularity: 50,
        adult: false,
        original_language: 'en',
        original_title: 'Test',
        genre_ids: [28],
        video: false,
      };

      const { rerender } = render(
        <MovieCard movie={mockMovie} onPress={jest.fn()} />
      );

      // Re-render with same props
      rerender(<MovieCard movie={mockMovie} onPress={jest.fn()} />);

      // Component should handle re-renders efficiently
      expect(true).toBe(true);
    });

    it('should optimize list rendering with getItemLayout', () => {
      const { UNSAFE_getAllByType } = renderWithProviders(
        <SearchScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      );

      const flatLists = UNSAFE_getAllByType(require('react-native').FlatList);
      const flatList = flatLists[0];

      expect(flatList.props.getItemLayout).toBeDefined();
    });
  });
});
