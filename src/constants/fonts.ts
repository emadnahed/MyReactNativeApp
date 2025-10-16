/**
 * Font Constants
 *
 * Comprehensive font configuration for the app.
 * This file provides type-safe access to all available fonts.
 */

export const FontFamilies = {
  // ALBRA - Base versatile family
  Albra: {
    Thin: 'Albra-Thin',
    Light: 'Albra-Light',
    LightItalic: 'Albra-LightItalic',
    Regular: 'Albra-Regular',
    RegularItalic: 'Albra-RegularItalic',
    Medium: 'Albra-Medium',
    MediumItalic: 'Albra-MediumItalic',
    Semi: 'Albra-Semi',
    SemiItalic: 'Albra-SemiItalic',
    Bold: 'Albra-Bold',
    BoldItalic: 'Albra-BoldItalic',
    Black: 'Albra-Black',
    BlackItalic: 'Albra-BlackItalic',
  },

  // ALBRA TEXT - Optimized for body text and readability
  AlbraText: {
    Light: 'AlbraText-Light',
    LightItalic: 'AlbraText-LightItalic',
    Regular: 'AlbraText-Regular',
    RegularItalic: 'AlbraText-RegularItalic',
    Medium: 'AlbraText-Medium',
    MediumItalic: 'AlbraText-MediumItalic',
    Semi: 'AlbraText-Semi',
    SemiItalic: 'AlbraText-SemiItalic',
    Bold: 'AlbraText-Bold',
    BoldItalic: 'AlbraText-BoldItalic',
    Black: 'AlbraText-Black',
    BlackItalic: 'AlbraText-BlackItalic',
  },

  // ALBRA DISPLAY - Optimized for large headlines and display text
  AlbraDisplay: {
    Light: 'AlbraDisplay-Light',
    LightItalic: 'AlbraDisplay-LightItalic',
    Regular: 'AlbraDisplay-Regular',
    RegularItalic: 'AlbraDisplay-RegularItalic',
    Medium: 'AlbraDisplay-Medium',
    MediumItalic: 'AlbraDisplay-MediumItalic',
    Semi: 'AlbraDisplay-Semi',
    SemiItalic: 'AlbraDisplay-SemiItalic',
    Bold: 'AlbraDisplay-Bold',
    BoldItalic: 'AlbraDisplay-BoldItalic',
    Black: 'AlbraDisplay-Black',
    BlackItalic: 'AlbraDisplay-BlackItalic',
  },

  // ALBRA GROTESK - Modern geometric sans-serif
  AlbraGrotesk: {
    Light: 'AlbraGrotesk-Light',
    LightItalic: 'AlbraGrotesk-LightItalic',
    Regular: 'AlbraGrotesk-Regular',
    RegularItalic: 'AlbraGrotesk-RegularItalic',
    Medium: 'AlbraGrotesk-Medium',
    MediumItalic: 'AlbraGrotesk-MediumItalic',
    Semi: 'AlbraGrotesk-Semi',
    SemiItalic: 'AlbraGrotesk-SemiItalic',
    Bold: 'AlbraGrotesk-Bold',
    BoldItalic: 'AlbraGrotesk-BoldItalic',
    Black: 'AlbraGrotesk-Black',
    BlackItalic: 'AlbraGrotesk-BlackItalic',
  },

  // ALBRA SANS - Clean sans-serif, excellent for UI elements
  AlbraSans: {
    Light: 'AlbraSans-Light',
    LightItalic: 'AlbraSans-LightItalic',
    Regular: 'AlbraSans-Regular',
    RegularItalic: 'AlbraSans-RegularItalic',
    Medium: 'AlbraSans-Medium',
    MediumItalic: 'AlbraSans-MediumItalic',
    Semi: 'AlbraSans-Semi',
    SemiItalic: 'AlbraSans-SemiItalic',
    Bold: 'AlbraSans-Bold',
    BoldItalic: 'AlbraSans-BoldItalic',
    Black: 'AlbraSans-Black',
    BlackItalic: 'AlbraSans-BlackItalic',
  },

  // GILROY - Modern geometric sans-serif
  Gilroy: {
    Light: 'Gilroy-Light',
    Regular: 'Gilroy-Regular',
    Medium: 'Gilroy-Medium',
    Bold: 'Gilroy-Bold',
    Heavy: 'Gilroy-Heavy',
  },
} as const;

/**
 * Recommended font usage patterns for different contexts
 */
export const AppFonts = {
  // For body text and paragraphs (optimized for readability)
  body: {
    light: FontFamilies.AlbraText.Light,
    regular: FontFamilies.AlbraText.Regular,
    medium: FontFamilies.AlbraText.Medium,
    semiBold: FontFamilies.AlbraText.Semi,
    bold: FontFamilies.AlbraText.Bold,
  },

  // For large headings and hero text
  display: {
    light: FontFamilies.AlbraDisplay.Light,
    regular: FontFamilies.AlbraDisplay.Regular,
    medium: FontFamilies.AlbraDisplay.Medium,
    semiBold: FontFamilies.AlbraDisplay.Semi,
    bold: FontFamilies.AlbraDisplay.Bold,
    black: FontFamilies.AlbraDisplay.Black,
  },

  // For UI elements (buttons, tabs, labels)
  ui: {
    light: FontFamilies.AlbraSans.Light,
    regular: FontFamilies.AlbraSans.Regular,
    medium: FontFamilies.AlbraSans.Medium,
    semiBold: FontFamilies.AlbraSans.Semi,
    bold: FontFamilies.AlbraSans.Bold,
  },

  // Alternative modern geometric font
  geometric: {
    light: FontFamilies.Gilroy.Light,
    regular: FontFamilies.Gilroy.Regular,
    medium: FontFamilies.Gilroy.Medium,
    bold: FontFamilies.Gilroy.Bold,
    heavy: FontFamilies.Gilroy.Heavy,
  },

  // For modern, clean interfaces
  grotesk: {
    light: FontFamilies.AlbraGrotesk.Light,
    regular: FontFamilies.AlbraGrotesk.Regular,
    medium: FontFamilies.AlbraGrotesk.Medium,
    semiBold: FontFamilies.AlbraGrotesk.Semi,
    bold: FontFamilies.AlbraGrotesk.Bold,
    black: FontFamilies.AlbraGrotesk.Black,
  },
} as const;

/**
 * Typography scale with recommended font sizes
 */
export const FontSizes = {
  // Display sizes (for hero sections and large headings)
  display: {
    large: 48,
    medium: 40,
    small: 36,
  },

  // Heading sizes
  heading: {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
  },

  // Body text sizes
  body: {
    large: 18,
    regular: 16,
    small: 14,
  },

  // UI element sizes
  ui: {
    large: 16,
    regular: 14,
    small: 12,
    tiny: 10,
  },
} as const;

/**
 * Quick preset text styles combining font families and sizes
 */
export const TextStyles = {
  // Hero/Display text
  hero: {
    fontFamily: AppFonts.display.bold,
    fontSize: FontSizes.display.large,
    lineHeight: FontSizes.display.large * 1.2,
  },

  // Page titles
  title: {
    fontFamily: AppFonts.display.bold,
    fontSize: FontSizes.heading.h1,
    lineHeight: FontSizes.heading.h1 * 1.3,
  },

  // Section headings
  heading: {
    fontFamily: AppFonts.display.semiBold,
    fontSize: FontSizes.heading.h2,
    lineHeight: FontSizes.heading.h2 * 1.3,
  },

  // Subheadings
  subheading: {
    fontFamily: AppFonts.display.medium,
    fontSize: FontSizes.heading.h3,
    lineHeight: FontSizes.heading.h3 * 1.3,
  },

  // Body text
  bodyLarge: {
    fontFamily: AppFonts.body.regular,
    fontSize: FontSizes.body.large,
    lineHeight: FontSizes.body.large * 1.5,
  },

  body: {
    fontFamily: AppFonts.body.regular,
    fontSize: FontSizes.body.regular,
    lineHeight: FontSizes.body.regular * 1.5,
  },

  bodySmall: {
    fontFamily: AppFonts.body.regular,
    fontSize: FontSizes.body.small,
    lineHeight: FontSizes.body.small * 1.5,
  },

  // Emphasized body text
  bodyBold: {
    fontFamily: AppFonts.body.bold,
    fontSize: FontSizes.body.regular,
    lineHeight: FontSizes.body.regular * 1.5,
  },

  // Button text
  button: {
    fontFamily: AppFonts.ui.semiBold,
    fontSize: FontSizes.ui.regular,
    lineHeight: FontSizes.ui.regular * 1.2,
  },

  // Caption/helper text
  caption: {
    fontFamily: AppFonts.body.regular,
    fontSize: FontSizes.ui.small,
    lineHeight: FontSizes.ui.small * 1.4,
  },

  // Labels
  label: {
    fontFamily: AppFonts.ui.medium,
    fontSize: FontSizes.ui.regular,
    lineHeight: FontSizes.ui.regular * 1.3,
  },
} as const;

export default {
  FontFamilies,
  AppFonts,
  FontSizes,
  TextStyles,
};
