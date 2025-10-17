/**
 * Movie Slice
 *
 * Redux slice for managing movie-related state.
 * Currently stores the title of the currently viewed movie.
 *
 * @module movieSlice
 * @example
 * ```tsx
 * import { setCurrentMovieTitle } from './store/movieSlice';
 *
 * // In a component:
 * dispatch(setCurrentMovieTitle('The Matrix'));
 * ```
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * State shape for movie slice
 */
interface MovieState {
  /** Title of the currently viewed movie, or null if no movie selected */
  currentMovieTitle: string | null;
}

/**
 * Initial state for movie slice
 */
const initialState: MovieState = {
  currentMovieTitle: null,
};

/**
 * Movie slice with actions and reducers
 */
const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    /**
     * Set the current movie title
     * @param state - Current state
     * @param action - Action with movie title payload
     */
    setCurrentMovieTitle: (state, action: PayloadAction<string>) => {
      state.currentMovieTitle = action.payload;
    },
    /**
     * Clear the current movie title
     * @param state - Current state
     */
    clearCurrentMovieTitle: (state) => {
      state.currentMovieTitle = null;
    },
  },
});

export const { setCurrentMovieTitle, clearCurrentMovieTitle } = movieSlice.actions;
export default movieSlice.reducer;
