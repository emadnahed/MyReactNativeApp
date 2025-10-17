# Testing Guide

A practical guide to testing this React Native app with Jest, Detox, and Maestro.

## Quick Start

```bash
npm test                    # Run unit & component tests
npm run test:watch          # Watch mode for development
npm run test:coverage       # See coverage report
npm run test:maestro        # Run Maestro E2E tests
npm run test:e2e:ios        # Run Detox E2E on iOS
```

## Current Test Coverage

**109 tests** across **12 test files** - all passing ✅

### What We're Testing

#### 🎨 UI Components (27 tests)

**MovieCard** - 8 tests
- Renders with correct movie data (title, rating, year)
- Handles missing release dates (shows "N/A")
- Navigation on press
- Doesn't crash without onPress callback
- Truncates long titles
- Memoization optimization (prevents unnecessary re-renders)

**LoadingSpinner** - 4 tests
- Default and custom messages
- Correct color (#FF6B6B)
- ActivityIndicator presence

**ErrorView** - 5 tests
- Default and custom error messages
- Retry button callback
- Conditionally renders retry button
- Error icon display (⚠️)

**ErrorBoundary** - 7 tests
- Catches and displays errors
- Custom fallback UI
- Reset functionality
- Error logging
- Default error messages
- Error icon display (💥)

**SearchScreen** - 8 tests
- Search input rendering
- Query typing and updates
- Clear button (✕) functionality
- Debouncing (500ms delay)
- Header text changes
- Pull-to-refresh configuration
- Pagination setup

**MovieDetailsScreen** - 3 tests
- Loading state display
- Component structure
- Redux action dispatching

**App** - 1 test
- Root app renders correctly

#### 🗃️ State Management (23 tests)

**Redux Movie Slice** - 7 tests
- Initial state (currentMovieTitle: null)
- Setting movie title
- Updating existing title
- Clearing title
- Action creators

**Redux + RTK Query Integration** - 16 tests
- Store configuration and middleware
- State immutability
- API reducer presence
- Query/mutation management
- State selectors
- Rapid state updates (100 consecutive)
- Edge cases: empty strings, special characters, long titles (1000 chars)

#### 🌐 API & Services (5 tests)

**TMDB API Utilities**
- Image URL generation (w200, w500, original sizes)
- Placeholder URLs for missing posters
- Error handling for null/empty paths

#### 🎨 Design System (26 tests)

**Font Constants & Typography**
- FontFamilies: Albra, AlbraText, AlbraDisplay, AlbraGrotesk, AlbraSans, Gilroy
- AppFonts: body, display, UI, geometric, grotesk
- FontSizes: display (48, 40, 36), heading (h1-h6), body, UI
- TextStyles: hero, title, heading, body variants, button, caption, label
- Type safety and immutability
- Line height validation

#### 🔄 User Flow Integration (19 tests)

**Movie Discovery Flow** - 5 tests
- Search interface display
- Typing and debouncing
- Clear button interaction
- Complete search flow

**Movie Card Interaction** - 4 tests
- Information display
- Press navigation
- Missing data handling
- No callback scenarios

**Redux State Management Flow** - 3 tests
- Title updates
- State persistence across renders
- Sequential updates

**Search Results Interaction** - 3 tests
- Pull-to-refresh
- Infinite scroll pagination
- List key extraction

**Complete User Journey** - 2 tests
- End-to-end search-to-view flow
- Error and retry flow

**Performance & Optimization** - 2 tests
- Component memoization (React.memo)
- FlatList getItemLayout optimization

### Test Distribution

```
UI Components     ████████████████████████ 27 (24.8%)
Design System     ███████████████████████  26 (23.9%)
State Management  █████████████████████    23 (21.1%)
User Flows        ███████████████████      19 (17.4%)
API Services      █████                     5 (4.6%)
App Root          █                         1 (0.9%)
```

### Test Files Structure

```
__tests__/
├── App.test.tsx                                    # 1 test
src/
├── components/__tests__/
│   ├── ErrorBoundary.test.tsx                      # 7 tests
│   ├── ErrorView.test.tsx                          # 5 tests
│   ├── LoadingSpinner.test.tsx                     # 4 tests
│   └── MovieCard.test.tsx                          # 8 tests
├── screens/__tests__/
│   ├── MovieDetailsScreen.test.tsx                 # 3 tests
│   └── SearchScreen.test.tsx                       # 8 tests
├── services/__tests__/
│   └── tmdb.api.test.ts                            # 5 tests
├── store/__tests__/
│   └── movieSlice.test.ts                          # 7 tests
├── constants/__tests__/
│   └── fonts.test.ts                               # 26 tests
└── __tests__/integration/
    ├── redux-api.integration.test.ts               # 16 tests
    └── user-flow.integration.test.tsx              # 19 tests
```

### What's NOT Tested (Yet)

These don't have Jest tests yet, but could be added:
- FontShowcase component (if it has logic beyond display)
- Network error scenarios with mocked API failures
- Deep linking navigation
- Animation timings
- Platform-specific behavior differences

## Three Testing Tools, Three Different Jobs

### Jest - Your Daily Driver (70% of tests)

**What it does**: Fast JavaScript tests that run in Node.js

**Use it for**:
- Functions and utilities
- React components
- Redux state
- API configurations

**Why it's great**:
- Runs in milliseconds
- Easy to debug
- Works perfectly with TDD

```javascript
// Example: Testing a component
it('shows movie title', () => {
  const { getByText } = render(<MovieCard movie={mockMovie} />);
  expect(getByText('The Matrix')).toBeTruthy();
});
```

### Maestro - Quick Smoke Tests (20% of tests)

**What it does**: YAML-based UI testing with zero code changes

**Use it for**:
- Critical user flows
- Smoke testing
- Cross-platform tests (same YAML for iOS & Android)
- Tests that non-developers can write

**Why it's great**:
- No testIDs needed
- Dead simple YAML syntax
- Interactive test creation with `maestro studio`

```yaml
# Example: Search flow
- launchApp
- tapOn: "Search movies..."
- inputText: "Matrix"
- assertVisible: "Search Results"
```

### Detox - Complex E2E Scenarios (10% of tests)

**What it does**: Native E2E testing on real simulators/emulators

**Use it for**:
- Complex gesture testing
- Animation testing
- Precise element control
- Network mocking

**Why it's selective**:
- Requires testIDs in code
- Slower to run
- Harder to debug
- But gives you full control when you need it

```javascript
// Example: Navigation test
it('navigates to details', async () => {
  await element(by.id('movie-card')).atIndex(0).tap();
  await expect(element(by.id('movie-details-screen'))).toBeVisible();
});
```

## The Testing Strategy

Think of it as a pyramid:
```
     /\     ← Detox (few, slow, high confidence)
    /  \
   /----\   ← Maestro (some, medium speed)
  /      \
 /________\ ← Jest (many, fast, cheap)
```

**Start with Jest**: Write lots of unit and component tests. They're fast and catch most bugs.

**Add Maestro**: Cover your critical user paths. Keep it simple.

**Use Detox sparingly**: Only when you need precise control or complex scenarios.

## What Can You Test with Jest?

### 1. Pure Functions
```javascript
describe('formatCurrency', () => {
  it('formats numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});
```

### 2. Redux Slices
```javascript
it('sets movie title', () => {
  const state = movieReducer(initialState, setMovieTitle('Matrix'));
  expect(state.currentMovieTitle).toBe('Matrix');
});
```

### 3. Components
```javascript
it('calls onPress when tapped', () => {
  const mockFn = jest.fn();
  const { getByText } = render(<Button onPress={mockFn} />);
  fireEvent.press(getByText('Click'));
  expect(mockFn).toHaveBeenCalled();
});
```

### 4. Async Behavior
```javascript
it('shows loading then content', async () => {
  const { getByText, queryByText } = render(<MovieDetails />);

  expect(getByText('Loading...')).toBeTruthy();

  await waitFor(() => {
    expect(queryByText('Loading...')).toBeNull();
    expect(getByText('The Matrix')).toBeTruthy();
  });
});
```

### 5. Redux Integration
```javascript
it('renders with store', () => {
  const store = configureStore({
    reducer: { movie: movieReducer }
  });

  const { getByText } = render(
    <Provider store={store}>
      <SearchScreen />
    </Provider>
  );

  expect(getByText('Search movies...')).toBeTruthy();
});
```

## Setting Up

### Jest (Already Done!)
Jest is configured and ready. Just run `npm test`.

Coverage thresholds are set at 70% for everything (lines, branches, functions, statements).

### Maestro

Install:
```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Linux
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Create tests in `.maestro/` directory. Check out the existing flows for examples.

### Detox

Install:
```bash
npm install -g detox-cli
brew install applesimutils  # iOS only
```

Build and run:
```bash
npm run build:e2e:ios
npm run test:e2e:ios
```

## Writing Tests

### Decision Tree

```
What are you testing?
│
├─ A function or utility?
│  → Jest unit test
│
├─ A React component?
│  ├─ Just rendering/props?
│  │  → Jest component test
│  └─ Full user flow?
│     ├─ Simple?
│     │  → Maestro
│     └─ Complex?
│        → Detox
│
└─ API integration?
   → Jest with mocked API
```

### Real Example: Login Feature

**Step 1: Test the logic (Jest)**
```javascript
// utils/__tests__/validators.test.ts
describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('not-an-email')).toBe(false);
  });
});
```

**Step 2: Test the component (Jest)**
```javascript
// screens/__tests__/LoginScreen.test.tsx
it('shows error for invalid email', () => {
  const { getByText, getByPlaceholderText } = render(<LoginScreen />);

  fireEvent.changeText(getByPlaceholderText('Email'), 'invalid');
  fireEvent.press(getByText('Login'));

  expect(getByText('Please enter a valid email')).toBeTruthy();
});
```

**Step 3: Test the user flow (Maestro)**
```yaml
# .maestro/login-flow.yaml
appId: com.myapp
---
- launchApp
- tapOn: "Email"
- inputText: "user@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Login"
- assertVisible: "Welcome"
```

**Step 4: Complex scenarios (Detox, if needed)**
```javascript
// e2e/login.e2e.ts
it('retries after failed login', async () => {
  await element(by.id('email-input')).typeText('wrong@email.com');
  await element(by.id('login-btn')).tap();

  await expect(element(by.text('Invalid credentials'))).toBeVisible();

  await element(by.id('email-input')).clearText();
  await element(by.id('email-input')).typeText('correct@email.com');
  await element(by.id('login-btn')).tap();

  await expect(element(by.id('home-screen'))).toBeVisible();
});
```

## Tips & Tricks

### Jest

**Use watch mode during development**
```bash
npm run test:watch
```
It automatically re-runs tests when you change files.

**Test file location**
Put tests next to the code: `src/components/__tests__/MyComponent.test.tsx`

**Mock external dependencies**
```javascript
jest.mock('../api', () => ({
  fetchMovies: jest.fn(() => Promise.resolve([mockMovie]))
}));
```

**Useful queries**
- `getByText` - Find by text content
- `getByTestId` - Find by testID prop
- `getByPlaceholderText` - Find inputs by placeholder
- `queryBy*` - Same but returns null instead of throwing

### Maestro

**Interactive test creation**
```bash
maestro studio
```
Click around your app and Maestro generates the YAML for you!

**Run specific flows**
```bash
maestro test .maestro/login-flow.yaml
```

**Common commands**
- `launchApp` - Start the app
- `tapOn: "text"` - Tap on element with text
- `inputText: "value"` - Type text
- `assertVisible: "text"` - Check element is visible
- `scroll` - Scroll down
- `back` - Go back

### Detox

**Add testIDs to components**
```tsx
<View testID="movie-card">
  {/* ... */}
</View>
```

**Common matchers**
- `.toBeVisible()` - Element is visible
- `.toExist()` - Element exists (but might not be visible)
- `.toHaveText()` - Has specific text

**Common actions**
- `.tap()` - Tap on element
- `.typeText()` - Type text
- `.scroll()` - Scroll
- `.swipe()` - Swipe gesture

## Troubleshooting

### Jest tests are slow
- Check if you're importing the entire app instead of just what you need
- Make sure you're mocking API calls
- Use `jest.useFakeTimers()` for tests with timers

### Maestro can't find elements
- Add explicit waits: `waitForAnimationToEnd: { timeout: 3000 }`
- Make sure the app is installed: `npm run ios` or `npm run android`
- Check if text matches exactly (case-sensitive!)

### Detox tests are flaky
- Increase timeouts: `.withTimeout(5000)`
- Add more specific testIDs
- Check if animations are interfering
- Use `waitFor()` for elements that appear asynchronously

## Coverage Reports

Run tests with coverage:
```bash
npm run test:coverage
```

View the report:
```bash
open coverage/lcov-report/index.html
```

Current thresholds: **70%** for everything.

## CI/CD Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:coverage
```

## Quick Reference

| Testing... | Use | Command |
|-----------|-----|---------|
| Function logic | Jest | `npm test` |
| Component rendering | Jest | `npm test` |
| Redux state | Jest | `npm test` |
| User flow (simple) | Maestro | `npm run test:maestro` |
| User flow (complex) | Detox | `npm run test:e2e:ios` |
| Everything with coverage | Jest | `npm run test:coverage` |

## Files & Folders

```
MyReactNativeApp/
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup & mocks
├── .detoxrc.js              # Detox configuration
├── .maestro/                # Maestro test flows
│   ├── movie-search-flow.yaml
│   └── movie-details-flow.yaml
├── e2e/                     # Detox tests
│   └── movieSearch.e2e.ts
└── src/
    ├── components/
    │   └── __tests__/       # Component tests
    ├── screens/
    │   └── __tests__/       # Screen tests
    ├── services/
    │   └── __tests__/       # API tests
    └── store/
        └── __tests__/       # Redux tests
```

## Best Practices

1. **Write tests as you code** - Don't leave it for later
2. **Test behavior, not implementation** - Focus on what users see
3. **Keep tests simple** - One test, one thing
4. **Use descriptive names** - `it('shows error when email is invalid')`
5. **Don't test libraries** - Trust that React, Redux, etc. work
6. **Mock external dependencies** - Keep tests fast and reliable
7. **Run tests before pushing** - Catch bugs early
8. **Maintain your tests** - Update them when features change

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Docs](https://wix.github.io/Detox/)
- [Maestro Docs](https://maestro.mobile.dev/)

---

**Remember**: More Jest tests, fewer E2E tests. Keep it simple, keep it fast. Happy testing! 🎯
