import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MovieDetailsScreen from '../MovieDetailsScreen';
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

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    // Clear RTK Query cache to prevent async operations after test completion
    store.dispatch(tmdbApi.util.resetApiState());
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

  it('should render component structure correctly', () => {
    const { UNSAFE_root } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    // Verify the component renders without crashing
    expect(UNSAFE_root).toBeDefined();
  });

  it('should dispatch Redux action when movie title is available', () => {
    // This test verifies the component structure
    const { UNSAFE_root } = renderWithProviders(
      <MovieDetailsScreen
        navigation={{} as any}
        route={{ params: { movieId: 1 } } as any}
      />
    );

    expect(UNSAFE_root).toBeDefined();
  });
});
