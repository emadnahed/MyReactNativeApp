// Jest setup file
// Note: @testing-library/react-native v12.4+ includes built-in matchers
// No need to import extend-expect separately

// Mock react-native-config
jest.mock('react-native-config', () => ({
  default: {
    TMDB_API_KEY: 'mock-api-key',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    ENV: 'test',
  },
}));

// Mock react-native-fast-image
jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const { Image } = require('react-native');

  const FastImage = (props) => React.createElement(Image, props);
  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };
  FastImage.priority = {
    low: 'low',
    normal: 'normal',
    high: 'high',
  };

  return FastImage;
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Selectively silence known benign warnings to reduce test output noise
// Allow other console.error and console.warn to surface real issues
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  // Silence specific known benign errors
  const message = args[0]?.toString() || '';

  // Add patterns for known benign errors here
  const benignPatterns = [
    'Warning: ReactDOM.render',
    'Warning: useLayoutEffect',
  ];

  if (benignPatterns.some(pattern => message.includes(pattern))) {
    return;
  }

  originalError(...args);
};

console.warn = (...args) => {
  // Silence specific known benign warnings
  const message = args[0]?.toString() || '';

  // Add patterns for known benign warnings here
  const benignPatterns = [
    'Animated: `useNativeDriver`',
  ];

  if (benignPatterns.some(pattern => message.includes(pattern))) {
    return;
  }

  originalWarn(...args);
};
