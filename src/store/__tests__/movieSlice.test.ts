import movieReducer, {
  setCurrentMovieTitle,
  clearCurrentMovieTitle,
} from '../movieSlice';

describe('movieSlice', () => {
  const initialState = {
    currentMovieTitle: null,
  };

  it('should return the initial state', () => {
    expect(movieReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setCurrentMovieTitle', () => {
    it('should set the current movie title', () => {
      const title = 'The Matrix';
      const actual = movieReducer(initialState, setCurrentMovieTitle(title));
      expect(actual.currentMovieTitle).toBe(title);
    });

    it('should update existing movie title', () => {
      const previousState = {
        currentMovieTitle: 'The Matrix',
      };
      const newTitle = 'The Matrix Reloaded';
      const actual = movieReducer(previousState, setCurrentMovieTitle(newTitle));
      expect(actual.currentMovieTitle).toBe(newTitle);
    });
  });

  describe('clearCurrentMovieTitle', () => {
    it('should clear the current movie title', () => {
      const previousState = {
        currentMovieTitle: 'The Matrix',
      };
      const actual = movieReducer(previousState, clearCurrentMovieTitle());
      expect(actual.currentMovieTitle).toBeNull();
    });

    it('should remain null if already null', () => {
      const actual = movieReducer(initialState, clearCurrentMovieTitle());
      expect(actual.currentMovieTitle).toBeNull();
    });
  });

  describe('action creators', () => {
    it('setCurrentMovieTitle should create an action with the title', () => {
      const title = 'The Matrix';
      const expectedAction = {
        type: 'movie/setCurrentMovieTitle',
        payload: title,
      };
      expect(setCurrentMovieTitle(title)).toEqual(expectedAction);
    });

    it('clearCurrentMovieTitle should create an action', () => {
      const expectedAction = {
        type: 'movie/clearCurrentMovieTitle',
      };
      expect(clearCurrentMovieTitle()).toEqual(expectedAction);
    });
  });
});
