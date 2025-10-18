import { device, element, by, expect as detoxExpect, waitFor } from 'detox';

describe('Movie Search E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display search screen on launch', async () => {
    await detoxExpect(element(by.text('Popular Movies'))).toBeVisible();
  });

  it('should allow typing in search input', async () => {
    const searchInput = element(by.text('Search movies...'));
    await detoxExpect(searchInput).toBeVisible();

    await searchInput.tap();
    await searchInput.typeText('Matrix');

    // Wait for debounce and header to change
    await waitFor(element(by.text('Search Results')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should display clear button when search has text', async () => {
    const searchInput = element(by.text('Search movies...'));
    await searchInput.tap();
    await searchInput.typeText('Matrix');

    // Wait for clear button to appear
    await waitFor(element(by.text('✕')))
      .toBeVisible()
      .withTimeout(1000);
  });

  it('should clear search when clear button is pressed', async () => {
    const searchInput = element(by.text('Search movies...'));
    await searchInput.tap();
    await searchInput.typeText('Matrix');

    await waitFor(element(by.text('✕')))
      .toBeVisible()
      .withTimeout(1000);

    const clearButton = element(by.text('✕'));
    await clearButton.tap();

    // Should return to Popular Movies
    await detoxExpect(element(by.text('Popular Movies'))).toBeVisible();
  });

  it('should display movie cards in grid layout', async () => {
    // Wait for movies to load
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    // Should have multiple movie cards
    await detoxExpect(element(by.id('movie-card')).atIndex(0)).toBeVisible();
    await detoxExpect(element(by.id('movie-card')).atIndex(1)).toBeVisible();
  });

  it('should navigate to movie details when card is tapped', async () => {
    // Wait for movies to load
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    // Tap first movie card
    await element(by.id('movie-card')).atIndex(0).tap();

    // Should navigate to details screen
    await waitFor(element(by.id('movie-details-screen')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should scroll through movie list', async () => {
    // Wait for movies to load
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    // Scroll down
    const movieList = element(by.id('movie-list'));
    await movieList.scroll(500, 'down');

    // Should load more movies (pagination)
    await waitFor(element(by.id('movie-card')).atIndex(10))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should refresh movie list on pull to refresh', async () => {
    // Wait for movies to load
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    // Pull to refresh
    const movieList = element(by.id('movie-list'));
    await movieList.swipe('down', 'fast', 0.9);

    // Should show refreshing and then reload
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe('Movie Details E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();

    // Navigate to first movie
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('movie-card')).atIndex(0).tap();

    await waitFor(element(by.id('movie-details-screen')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should display movie details', async () => {
    // Should show various sections
    await detoxExpect(element(by.id('movie-details-screen'))).toBeVisible();
    await detoxExpect(element(by.text('Overview'))).toBeVisible();
  });

  it('should display movie rating and year', async () => {
    // Rating section should be visible
    await detoxExpect(element(by.text('Rating'))).toBeVisible();
    await detoxExpect(element(by.text('Year'))).toBeVisible();
  });

  it('should be scrollable', async () => {
    const detailsScreen = element(by.id('movie-details-screen'));
    await detailsScreen.scroll(300, 'down');

    // Additional info should be visible after scrolling
    await detoxExpect(element(by.text('Additional Info'))).toBeVisible();
  });

  it('should navigate back to search screen', async () => {
    // Go back (platform-specific)
    if (device.getPlatform() === 'ios') {
      await element(by.traits(['button']).and(by.label('Back'))).tap();
    } else {
      await device.pressBack();
    }

    // Should return to search screen
    await detoxExpect(element(by.text('Popular Movies'))).toBeVisible();
  });
});
