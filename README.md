# MyReactNativeApp

A movie discovery app built with React Native, featuring search, details, and a comprehensive testing setup.

## Features

- 🎬 Browse popular movies
- 🔍 **Smart Search** with automatic API routing (text, filters, genres, ratings, years)
- 📱 View detailed movie information
- ⚡ Optimized performance with React.memo and FlatList
- 🔄 **Infinite Scroll Pagination** - Automatically loads more results
- 🎯 **Custom Hooks** - Reusable hooks for search, debouncing, caching, performance
- 📊 **Performance Monitoring** - FPS tracking, performance markers, memory monitoring
- 🎨 Custom fonts (Gilroy & Albra)
- 📦 Redux state management (RTK Query)
- 🧪 Comprehensive testing coverage (Jest, Detox, Maestro)
- 💀 Skeleton loading states for better UX
- ♿ Full accessibility support (VoiceOver & TalkBack)
- 🔄 Error handling with retry mechanisms
- 🎭 Empty states for all scenarios

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
│   ├── MovieCard.tsx           # Movie card with accessibility
│   ├── SkeletonMovieCard.tsx   # Skeleton loading state
│   ├── LoadingSpinner.tsx      # Loading indicator
│   ├── ErrorView.tsx           # Error state with retry
│   ├── ErrorBoundary.tsx       # React error boundary
│   ├── PerformanceOverlay.tsx  # FPS monitoring overlay (DEV only)
│   └── FontShowcase.tsx        # Font display component
├── screens/            # Screen components
│   ├── SearchScreen.tsx        # Search & popular movies (with smart search)
│   └── MovieDetailsScreen.tsx  # Movie details view
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts          # Debouncing hook
│   ├── useMovieSearch.ts       # Basic movie search hook
│   ├── useSmartMovieSearch.ts  # Smart search with auto-routing
│   ├── useCachedImages.ts      # FastImage cache management
│   ├── usePerformanceMonitor.ts # Performance tracking hook
│   └── index.ts                # Centralized exports
├── services/           # API services (RTK Query)
│   └── tmdb.api.ts             # TMDb API integration
├── utils/              # Utility functions
│   ├── queryParser.ts          # Smart query parsing
│   └── PerformanceMonitor.ts   # Performance monitoring class
├── store/              # Redux store & slices
│   ├── index.ts                # Store configuration
│   └── movieSlice.ts           # Movie state slice
├── types/              # TypeScript types
│   ├── movie.types.ts
│   ├── discover.types.ts       # Discover API types
│   └── navigation.types.ts
├── constants/          # App constants
│   ├── fonts.ts                # Typography system
│   └── genres.ts               # Genre mappings & detection
└── __tests__/          # Test files (109 tests)
    ├── integration/            # Integration tests
    └── ...                     # Component & unit tests
```

## Custom Hooks

The app includes several reusable custom hooks for common functionality:

### `useDebounce`
Delays value updates to reduce API calls and improve performance.
```typescript
const debouncedSearch = useDebounce(searchQuery, 500); // 500ms delay
```

### `useSmartMovieSearch`
Intelligent search hook that automatically routes to the best TMDb API:
- **Empty query** → Popular Movies API
- **Simple text** (e.g., "inception") → Search API
- **Filters detected** (e.g., "action 2020 rating>7") → Discover API

```typescript
const {
  movies,              // All accumulated results
  isLoading,           // Loading state
  searchQuery,         // Current query
  setSearchQuery,      // Update query
  loadMore,            // Load next page
  hasMore,             // More pages available
  apiMode,             // 'popular' | 'search' | 'discover'
  queryDescription,    // Human-readable query info
} = useSmartMovieSearch({ debounceDelay: 500 });
```

### `useCachedImages`
Manages FastImage cache for optimized image loading.
```typescript
const { preloadImages, clearCache } = useCachedImages();
preloadImages(imageUrls, 'high'); // Preload with priority
```

### `usePerformanceMonitor`
Tracks component performance, FPS, and memory usage.
```typescript
const { fps, measureAsync, logMemory } = usePerformanceMonitor('MyComponent');
```

## Smart Search

The search feature intelligently parses user queries and routes to the optimal API endpoint.

### Supported Query Patterns

**Years**: `2020`, `2023` (any 4-digit year 1900-2099)
**Ratings**: `rating>7`, `>8`, `8+`, `rating>=8.5`
**Genres**: `action`, `sci-fi`, `comedy`, `thriller`, etc.
**Combined**: `action 2023 rating>7` (action movies from 2023, rated 7+)

### Example Queries

| Query | API Used | Result |
|-------|----------|--------|
| `inception` | Search | Movies with "inception" in title |
| `2023` | Discover | All movies from 2023 |
| `action` | Discover | Action movies by popularity |
| `sci-fi rating>8` | Discover | Sci-fi movies rated 8+ |
| `action 2020 >7` | Discover | 2020 action movies rated 7+ |

### Genre Keywords

Supports natural language genre detection:
- **Action**: action, action-packed, fights, martial arts
- **Sci-Fi**: sci-fi, science fiction, space, alien, futuristic
- **Horror**: horror, scary, zombie, supernatural
- **Romance**: romance, romantic, love
- And 14+ more genres with multiple keywords each

### Debug Mode (DEV only)

In development, a debug indicator shows which API is being used:
```
Search Results
Mode: DISCOVER • from 2020, genre: 28, rating ≥ 7
```

## Pagination

All search modes support infinite scroll pagination with automatic page loading.

### How It Works

1. User scrolls to bottom of list
2. FlatList triggers `onEndReached` at 50% from bottom
3. Hook automatically fetches next page (page 2, 3, etc.)
4. Results are accumulated (no duplicates)
5. Loading spinner shows while fetching
6. Continues until all pages loaded (up to 500 pages per endpoint)

### Features

- ✅ **Automatic accumulation** - Pages append to existing results
- ✅ **Duplicate prevention** - Filters out movies with existing IDs
- ✅ **Smart reset** - Clears results when query changes
- ✅ **Pull-to-refresh** - Resets to page 1
- ✅ **Loading indicators** - Footer spinner while loading more

### Performance

Each page returns ~20 movies. The FlatList uses:
- `removeClippedSubviews` - Unmounts off-screen items
- `getItemLayout` - Pre-calculated positions for smooth scrolling
- `windowSize={21}` - Keeps 21 screens in memory
- Image preloading via `useCachedImages`

## Performance Monitoring

Built-in performance monitoring tools help track app performance in development.

### Features

- **FPS Tracking** - Real-time frames per second monitoring
- **Performance Markers** - Mark specific points in code
- **Performance Measures** - Calculate duration between markers
- **Memory Monitoring** - Track JavaScript heap usage
- **Component Timing** - Measure component render times

### Performance Overlay (DEV only)

Visual FPS indicator in the corner of the screen:
- **Green (55+ FPS)** - Excellent performance
- **Yellow (45-54 FPS)** - Good performance
- **Orange (30-44 FPS)** - Fair performance
- **Red (<30 FPS)** - Poor performance

Tap to minimize/expand the overlay.

### Usage Example

```typescript
const { fps, measureAsync } = usePerformanceMonitor('SearchScreen');

// Measure async operations
const results = await measureAsync('fetchMovies', async () => {
  return await fetchMovies(query);
});

// FPS is automatically tracked
console.log(`Current FPS: ${fps}`);
```

## API Endpoints

The app uses TMDb (The Movie Database) API v3 with three main endpoints:

### 1. Popular Movies
Get trending/popular movies sorted by popularity.

```bash
curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY&page=1"
```

**Response**: 20 movies per page, up to 500 pages
**Used when**: Search bar is empty

### 2. Search Movies
Text search across movie titles and overviews.

```bash
curl "https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=inception&page=1"
```

**Response**: Matching movies, 20 per page
**Used when**: Simple text query without filters

### 3. Discover Movies
Advanced filtering by year, genre, rating, runtime, etc.

```bash
# All action movies from 2023 rated 7+
curl "https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&primary_release_year=2023&with_genres=28&vote_average.gte=7&vote_count.gte=100&sort_by=popularity.desc&page=1"
```

**Parameters**:
- `primary_release_year` - Year filter (e.g., 2023)
- `with_genres` - Genre IDs comma-separated (e.g., 28=Action, 878=Sci-Fi)
- `vote_average.gte` - Minimum rating (0-10)
- `vote_average.lte` - Maximum rating (0-10)
- `vote_count.gte` - Minimum vote count (ensures reliable ratings)
- `with_runtime.gte` - Minimum runtime in minutes
- `with_runtime.lte` - Maximum runtime in minutes
- `sort_by` - Sort order (popularity.desc, release_date.desc, vote_average.desc)
- `page` - Page number (1-500)

**Used when**: Query contains filters (year, genre, rating)

### 4. Movie Details
Get detailed information for a specific movie.

```bash
curl "https://api.themoviedb.org/3/movie/550?api_key=YOUR_API_KEY"
```

**Response**: Full movie details including overview, cast, runtime, budget, etc.
**Used when**: User taps on a movie card

### Genre IDs Reference

| ID | Genre | Keywords |
|----|-------|----------|
| 28 | Action | action, action-packed, fights |
| 12 | Adventure | adventure, quest, journey |
| 16 | Animation | animation, animated, cartoon, anime |
| 35 | Comedy | comedy, funny, humor |
| 80 | Crime | crime, criminal, heist, detective |
| 18 | Drama | drama, dramatic, emotional |
| 14 | Fantasy | fantasy, magic, wizard |
| 27 | Horror | horror, scary, zombie |
| 9648 | Mystery | mystery, whodunit |
| 10749 | Romance | romance, romantic, love |
| 878 | Sci-Fi | sci-fi, science fiction, space, alien |
| 53 | Thriller | thriller, suspense |
| 10752 | War | war, military, battle |
| 37 | Western | western, cowboy |

### API Response Format

All list endpoints return this structure:
```json
{
  "page": 1,
  "results": [
    {
      "id": 123,
      "title": "Movie Title",
      "poster_path": "/path.jpg",
      "backdrop_path": "/backdrop.jpg",
      "overview": "Plot summary...",
      "vote_average": 8.5,
      "vote_count": 12345,
      "release_date": "2023-01-15",
      "genre_ids": [28, 878]
    }
  ],
  "total_pages": 500,
  "total_results": 10000
}
```

### Rate Limits

- **40 requests per 10 seconds** per IP address
- **500 pages maximum** per endpoint
- Automatic caching via RTK Query reduces redundant requests

## Available Scripts

### Development
- `npm start` - Start Metro bundler
- `npm run ios` - Run iOS app
- `npm run android` - Run Android app
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run Jest tests
- `npm run test:jest` - Run Jest tests only
- `npm run test:jest:watch` - Run Jest in watch mode
- `npm run test:jest:coverage` - Generate coverage report
- `npm run test:maestro` - Run Maestro E2E tests
- `npm run test:maestro:studio` - Open Maestro Studio
- `npm run test:detox:ios` - Run Detox E2E on iOS
- `npm run test:detox:android` - Run Detox E2E on Android
- `npm run test:all` - Run all test frameworks

**Test Coverage includes:**
- UI Components (MovieCard, LoadingSpinner, ErrorView, ErrorBoundary, Screens)
- State Management (Redux slices, RTK Query integration)
- Design System (Typography, fonts, text styles)
- User Flows (Search, navigation, interactions)
- API Services (TMDb API utilities)
- Integration tests (End-to-end user journeys)

Run `npm run test:jest:coverage` to see detailed coverage metrics.

### Utilities
- `npm run clean:android` - Clean Android build
- `npm run clean:ios` - Clean iOS build
- `npm run clean:pods` - Clean and reinstall CocoaPods
- `npm run reset:ios` - Full iOS environment reset

## Performance Optimizations

This app includes comprehensive performance optimizations:

### Rendering Optimizations
- **React.memo** on MovieCard component with custom comparison
- **FlatList optimizations**: getItemLayout, removeClippedSubviews, windowSize=21, batch rendering
- **Skeleton loaders** instead of spinners for better perceived performance

### Network Optimizations
- **Redux RTK Query** for automatic caching and request deduplication
- **Debounced search** (500ms) to reduce API calls
- **Infinite scroll pagination** for efficient data loading
- **Image preloading** via `useCachedImages` hook

### Image Optimizations
- **FastImage** for optimized image loading with priority levels
- **Automatic cache management** with `useCachedImages` hook
- **Preload upcoming images** before they're visible

### Monitoring & Tracking
- **FPS monitoring** with visual overlay (DEV mode)
- **Performance markers** to measure code execution
- **Memory tracking** to detect leaks
- **Component render counting** via `usePerformanceMonitor`

See [Performance Monitoring](#performance-monitoring) section for details.

## Accessibility Features

Built with accessibility in mind:

- ✅ **Screen reader support** - VoiceOver (iOS) and TalkBack (Android)
- ✅ **Descriptive labels** - All interactive elements have meaningful labels
- ✅ **Semantic roles** - Proper roles (button, search, alert, progressbar)
- ✅ **Hints and feedback** - Context-aware hints for user actions
- ✅ **Keyboard navigation** - Full keyboard accessibility
- ✅ **Focus management** - Logical focus order

Test with VoiceOver: `Settings > Accessibility > VoiceOver` (iOS)
Test with TalkBack: `Settings > Accessibility > TalkBack` (Android)

## Error Handling

Robust error handling throughout:

- **Network errors** - Automatic retry with user feedback
- **Loading states** - Skeleton loaders and spinners
- **Empty states** - Helpful messages for all scenarios
- **Error boundaries** - Catches React errors gracefully
- **API errors** - Clear error messages with retry buttons

## API Integration

Using TMDb (The Movie Database) API v3 with RTK Query for automatic caching and request deduplication:

**Endpoints Used:**
- **Popular Movies** - Trending movies (`/movie/popular`)
- **Search Movies** - Text search (`/search/movie`)
- **Discover Movies** - Advanced filtering (`/discover/movie`)
- **Movie Details** - Full movie info (`/movie/{id}`)

See [API Endpoints](#api-endpoints) section for full curl examples and parameters.

All API calls are automatically cached via RTK Query, reducing redundant network requests and improving performance.

## TestFlight Deployment

To distribute the app via Apple's TestFlight beta testing platform:

### Requirements

- ✅ **Apple Developer Account** ($99/year subscription required)
- ✅ **Xcode** with valid signing certificates
- ✅ **App Store Connect** access

### Quick Steps

1. **Prepare the app**:
   ```bash
   # Update version/build number in ios/MyReactNativeApp/Info.plist
   # Increment CFBundleShortVersionString (e.g., 1.0.0 -> 1.0.1)
   # Increment CFBundleVersion (e.g., 1 -> 2)
   ```

2. **Archive the build**:
   - Open `ios/MyReactNativeApp.xcworkspace` in Xcode
   - Select "Any iOS Device" as target
   - Product → Archive
   - Wait for archive to complete

3. **Upload to App Store Connect**:
   - Window → Organizer
   - Select your archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow the upload wizard

4. **Configure in App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Select your app → TestFlight
   - Wait for processing (10-30 minutes)
   - Add internal/external testers
   - Submit for beta review (external testers only)

5. **Invite testers**:
   - Add testers via email
   - They'll receive TestFlight invite
   - Testers install via TestFlight app

### Notes

- Internal testing (up to 100 users) - No review required
- External testing (up to 10,000 users) - Requires Apple review
- Builds expire after 90 days
- Can have multiple builds active simultaneously

For detailed instructions, see `TESTFLIGHT_DEPLOYMENT_GUIDE.md` and `QUICK_TESTFLIGHT_STEPS.md`.

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
