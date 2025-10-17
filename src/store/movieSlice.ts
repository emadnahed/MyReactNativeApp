import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MovieState {
  currentMovieTitle: string | null;
}

const initialState: MovieState = {
  currentMovieTitle: null,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setCurrentMovieTitle: (state, action: PayloadAction<string>) => {
      state.currentMovieTitle = action.payload;
    },
    clearCurrentMovieTitle: (state) => {
      state.currentMovieTitle = null;
    },
  },
});

export const { setCurrentMovieTitle, clearCurrentMovieTitle } = movieSlice.actions;
export default movieSlice.reducer;
