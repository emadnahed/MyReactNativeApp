/**
 * TMDb Genre Constants
 *
 * Official TMDb genre IDs and mapping for intelligent search parsing.
 * https://developers.themoviedb.org/3/genres/get-movie-list
 */

import type { GenreInfo } from '../types/discover.types';

/**
 * Official TMDb Genre IDs
 */
export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

/**
 * Genre Information with Keywords
 * Maps genre names and common keywords to TMDb genre IDs
 */
export const GENRE_INFO: GenreInfo[] = [
  {
    id: GENRE_IDS.ACTION,
    name: 'Action',
    keywords: ['action', 'action-packed', 'fights', 'fighting', 'martial arts'],
  },
  {
    id: GENRE_IDS.ADVENTURE,
    name: 'Adventure',
    keywords: ['adventure', 'quest', 'journey', 'exploration'],
  },
  {
    id: GENRE_IDS.ANIMATION,
    name: 'Animation',
    keywords: ['animation', 'animated', 'cartoon', 'anime'],
  },
  {
    id: GENRE_IDS.COMEDY,
    name: 'Comedy',
    keywords: ['comedy', 'funny', 'humor', 'humorous', 'laugh', 'hilarious'],
  },
  {
    id: GENRE_IDS.CRIME,
    name: 'Crime',
    keywords: ['crime', 'criminal', 'heist', 'robbery', 'detective', 'mafia', 'gangster'],
  },
  {
    id: GENRE_IDS.DOCUMENTARY,
    name: 'Documentary',
    keywords: ['documentary', 'doc', 'real', 'true story', 'based on'],
  },
  {
    id: GENRE_IDS.DRAMA,
    name: 'Drama',
    keywords: ['drama', 'dramatic', 'emotional', 'serious'],
  },
  {
    id: GENRE_IDS.FAMILY,
    name: 'Family',
    keywords: ['family', 'kids', 'children', 'family-friendly'],
  },
  {
    id: GENRE_IDS.FANTASY,
    name: 'Fantasy',
    keywords: ['fantasy', 'magic', 'magical', 'wizard', 'supernatural', 'mythical'],
  },
  {
    id: GENRE_IDS.HISTORY,
    name: 'History',
    keywords: ['history', 'historical', 'period', 'era', 'wwii', 'war'],
  },
  {
    id: GENRE_IDS.HORROR,
    name: 'Horror',
    keywords: ['horror', 'scary', 'terror', 'terrifying', 'zombie', 'haunted', 'ghost'],
  },
  {
    id: GENRE_IDS.MUSIC,
    name: 'Music',
    keywords: ['music', 'musical', 'concert', 'band', 'singer'],
  },
  {
    id: GENRE_IDS.MYSTERY,
    name: 'Mystery',
    keywords: ['mystery', 'mysterious', 'whodunit', 'suspense'],
  },
  {
    id: GENRE_IDS.ROMANCE,
    name: 'Romance',
    keywords: ['romance', 'romantic', 'love', 'relationship', 'dating'],
  },
  {
    id: GENRE_IDS.SCIENCE_FICTION,
    name: 'Science Fiction',
    keywords: ['sci-fi', 'science fiction', 'scifi', 'space', 'alien', 'future', 'dystopia'],
  },
  {
    id: GENRE_IDS.TV_MOVIE,
    name: 'TV Movie',
    keywords: ['tv movie', 'television'],
  },
  {
    id: GENRE_IDS.THRILLER,
    name: 'Thriller',
    keywords: ['thriller', 'suspense', 'intense', 'gripping'],
  },
  {
    id: GENRE_IDS.WAR,
    name: 'War',
    keywords: ['war', 'military', 'battle', 'soldier', 'combat'],
  },
  {
    id: GENRE_IDS.WESTERN,
    name: 'Western',
    keywords: ['western', 'cowboy', 'wild west', 'frontier'],
  },
];

/**
 * Map genre names to IDs (case-insensitive)
 */
export const GENRE_NAME_TO_ID: Record<string, number> = GENRE_INFO.reduce(
  (acc, genre) => {
    // Add main name
    acc[genre.name.toLowerCase()] = genre.id;

    // Add all keywords
    genre.keywords.forEach(keyword => {
      acc[keyword.toLowerCase()] = genre.id;
    });

    return acc;
  },
  {} as Record<string, number>
);

/**
 * Get genre ID from a string (case-insensitive)
 */
export function getGenreId(genreName: string): number | undefined {
  return GENRE_NAME_TO_ID[genreName.toLowerCase()];
}

/**
 * Get genre name from ID
 */
export function getGenreName(genreId: number): string | undefined {
  return GENRE_INFO.find(g => g.id === genreId)?.name;
}

/**
 * Find all matching genres in a text string
 */
export function findGenresInText(text: string): number[] {
  const lowerText = text.toLowerCase();
  const foundGenres = new Set<number>();

  GENRE_INFO.forEach(genre => {
    // Check main name
    if (lowerText.includes(genre.name.toLowerCase())) {
      foundGenres.add(genre.id);
    }

    // Check keywords
    genre.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        foundGenres.add(genre.id);
      }
    });
  });

  return Array.from(foundGenres);
}
