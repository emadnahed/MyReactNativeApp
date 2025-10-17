# MyReactNativeApp

A movie discovery app built with React Native, featuring search, details, and a comprehensive testing setup.

## Features

- 🎬 Browse popular movies
- 🔍 Search for movies
- 📱 View detailed movie information
- ⚡ Optimized performance with React.memo and FlatList
- 🎨 Custom fonts (Gilroy & Albra)
- 📦 Redux state management
- 🧪 Full testing coverage (Jest, Detox, Maestro)

## Tech Stack

- React Native 0.72.6
- Redux Toolkit (RTK Query)
- React Navigation
- FastImage for optimized images
- TMDb API

## Testing

This project uses a comprehensive testing strategy:

- **Jest** (70%) - Unit and component tests
- **Maestro** (20%) - Quick smoke tests and user flows
- **Detox** (10%) - Complex E2E scenarios

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode for development
npm run test:coverage       # Generate coverage report
npm run test:maestro        # Run Maestro E2E tests
npm run test:e2e:ios        # Run Detox E2E on iOS
```

**Coverage**: 70% minimum across all metrics (lines, branches, functions, statements)

📖 **[Full Testing Guide](./TESTING.md)** - Comprehensive testing documentation

## Getting Started

### Prerequisites

- Node.js 16+
- React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd MyReactNativeApp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. Install iOS dependencies (macOS only)
```bash
cd ios && pod install && cd ..
```

### Running the App

Start Metro bundler:
```bash
npm start
```

Run on iOS:
```bash
npm run ios
```

Run on Android:
```bash
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── MovieCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorView.tsx
├── screens/            # Screen components
│   ├── SearchScreen.tsx
│   └── MovieDetailsScreen.tsx
├── services/           # API services (RTK Query)
│   └── tmdb.api.ts
├── store/              # Redux store & slices
│   ├── index.ts
│   └── movieSlice.ts
├── types/              # TypeScript types
├── constants/          # App constants (fonts, etc.)
└── config/            # App configuration
```

## Available Scripts

### Development
- `npm start` - Start Metro bundler
- `npm run ios` - Run iOS app
- `npm run android` - Run Android app
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:unit` - Run unit tests only
- `npm run test:maestro` - Run Maestro E2E tests
- `npm run test:maestro:studio` - Open Maestro Studio
- `npm run test:e2e:ios` - Run Detox E2E on iOS
- `npm run test:e2e:android` - Run Detox E2E on Android
- `npm run build:e2e:ios` - Build iOS app for E2E testing
- `npm run build:e2e:android` - Build Android app for E2E testing

### Utilities
- `npm run clean:android` - Clean Android build
- `npm run clean:ios` - Clean iOS build
- `npm run clean:pods` - Clean and reinstall CocoaPods
- `npm run reset:ios` - Full iOS environment reset

## Performance Optimizations

This app includes several performance optimizations:

- **React.memo** on MovieCard component with custom comparison
- **FastImage** for optimized image loading with priority levels
- **FlatList optimizations**: getItemLayout, removeClippedSubviews, windowSize
- **Debounced search** (500ms) to reduce API calls
- **Pagination** for efficient data loading

## API Integration

Using TMDb (The Movie Database) API with RTK Query:
- Search movies
- Get popular movies
- Get movie details

All API calls are cached and optimized with RTK Query.

## Troubleshooting

### Common Issues

**iOS build fails**
```bash
npm run reset:ios
```

**Android build issues**
```bash
npm run clean:android
cd android && ./gradlew clean && cd ..
```

**Metro bundler cache issues**
```bash
npm start -- --reset-cache
```

**Tests failing**
```bash
# Make sure all dependencies are installed
npm install

# Run tests in verbose mode
npm test -- --verbose
```

See [TESTING.md](./TESTING.md) for testing-specific troubleshooting.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.

## Resources

- [React Native Docs](https://reactnative.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TMDb API Docs](https://developers.themoviedb.org/3)
- [Testing Guide](./TESTING.md)
