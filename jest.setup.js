// Jest setup file
// Note: @testing-library/react-native v12.4+ includes built-in matchers
// No need to import extend-expect separately

// Mock react-native-dotenv
jest.mock('react-native-dotenv', () => ({
  TMDB_API_KEY: 'mock-api-key',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
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

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
