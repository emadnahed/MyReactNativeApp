# Font Usage Guide

This guide explains how to use the custom fonts (Albra family and Gilroy) in your React Native app.

## Installation Complete

All fonts have been successfully linked to both iOS and Android platforms. You can now use them throughout your app.

## Font Families Available

### 1. **AlbraText** - Body Text (Recommended for paragraphs)
Optimized for readability at smaller sizes. Perfect for body text and long-form content.

**Weights:** Light, Regular, Medium, Semi Bold, Bold, Black
**Includes:** Italic variants for all weights

**Usage:**
```typescript
import { AppFonts } from './src/constants/fonts';

<Text style={{ fontFamily: AppFonts.body.regular }}>
  Your paragraph text here
</Text>
```

### 2. **AlbraDisplay** - Display Text (Recommended for headlines)
Optimized for large sizes. Perfect for hero sections, page titles, and large headings.

**Weights:** Light, Regular, Medium, Semi Bold, Bold, Black
**Includes:** Italic variants for all weights

**Usage:**
```typescript
<Text style={{ fontFamily: AppFonts.display.bold, fontSize: 32 }}>
  Page Title
</Text>
```

### 3. **AlbraSans** - UI Elements (Recommended for buttons, labels)
Clean sans-serif perfect for interface elements like buttons, tabs, and labels.

**Weights:** Light, Regular, Medium, Semi Bold, Bold, Black
**Includes:** Italic variants for all weights

**Usage:**
```typescript
<Text style={{ fontFamily: AppFonts.ui.semiBold }}>
  Button Text
</Text>
```

### 4. **Gilroy** - Geometric Sans (Alternative modern option)
Modern geometric sans-serif. Great for tech-focused or minimalist designs.

**Weights:** Light, Regular, Medium, Bold, Heavy

**Usage:**
```typescript
<Text style={{ fontFamily: AppFonts.geometric.bold }}>
  Modern Heading
</Text>
```

### 5. **AlbraGrotesk** - Geometric Sans (Albra variant)
Another geometric option from the Albra family. Clean and modern.

**Weights:** Light, Regular, Medium, Semi Bold, Bold, Black
**Includes:** Italic variants for all weights

**Usage:**
```typescript
<Text style={{ fontFamily: AppFonts.grotesk.medium }}>
  Clean Interface Text
</Text>
```

### 6. **Albra** - Base Family (General purpose)
The original Albra family. Versatile for various uses.

**Weights:** Thin, Light, Regular, Medium, Semi Bold, Bold, Black
**Includes:** Italic variants (except Thin)

---

## Quick Start Examples

### Using Preset Text Styles (Recommended)

The easiest way to use fonts is with the preset `TextStyles`:

```typescript
import { TextStyles } from './src/constants/fonts';

// Hero text
<Text style={TextStyles.hero}>Welcome!</Text>

// Page title
<Text style={TextStyles.title}>Dashboard</Text>

// Section heading
<Text style={TextStyles.heading}>Recent Activity</Text>

// Body text
<Text style={TextStyles.body}>
  This is a paragraph of text that will be easy to read...
</Text>

// Button text
<Text style={TextStyles.button}>Submit</Text>

// Caption
<Text style={TextStyles.caption}>Last updated 2 hours ago</Text>
```

### Custom Font Usage

For more control, use fonts directly:

```typescript
import { AppFonts, FontSizes } from './src/constants/fonts';

<Text style={{
  fontFamily: AppFonts.display.bold,
  fontSize: FontSizes.heading.h1,
  lineHeight: FontSizes.heading.h1 * 1.3,
}}>
  Custom Heading
</Text>
```

---

## Best Practices

### 1. **Choose the Right Family for the Context**

- **Long paragraphs:** AlbraText (optimized for reading)
- **Large headings:** AlbraDisplay (looks great at big sizes)
- **Buttons/UI:** AlbraSans (clean, interface-friendly)
- **Modern aesthetic:** Gilroy or AlbraGrotesk

### 2. **Maintain Hierarchy**

Use different weights and sizes to create visual hierarchy:

```typescript
// Primary heading
<Text style={{ fontFamily: AppFonts.display.bold, fontSize: 32 }}>

// Secondary heading
<Text style={{ fontFamily: AppFonts.display.semiBold, fontSize: 24 }}>

// Body text
<Text style={{ fontFamily: AppFonts.body.regular, fontSize: 16 }}>
```

### 3. **Set Appropriate Line Heights**

For better readability:

- **Headings:** 1.2 - 1.3 × font size
- **Body text:** 1.5 - 1.6 × font size

```typescript
{
  fontFamily: AppFonts.body.regular,
  fontSize: 16,
  lineHeight: 24, // 1.5 × 16
}
```

### 4. **Use Weights Purposefully**

- **Light:** Subtle, minimal
- **Regular:** Default text
- **Medium:** Slight emphasis
- **Semi Bold:** More emphasis
- **Bold:** Strong emphasis
- **Black:** Maximum impact

---

## Typography Scale

Use consistent font sizes throughout your app:

### Display Sizes (Hero sections)
- Large: 48px
- Medium: 40px
- Small: 36px

### Heading Sizes
- H1: 32px (Page titles)
- H2: 28px (Section headings)
- H3: 24px (Subsection headings)
- H4: 20px (Card titles)
- H5: 18px (Small headings)
- H6: 16px (Tiny headings)

### Body Sizes
- Large: 18px (Emphasized paragraphs)
- Regular: 16px (Standard body text)
- Small: 14px (Secondary text)

### UI Sizes
- Large: 16px
- Regular: 14px
- Small: 12px
- Tiny: 10px

---

## Platform-Specific Font Names

When using fonts directly with `fontFamily`, use these exact names:

### iOS & Android
Both platforms use the same font names:

```typescript
// AlbraText
'AlbraText-Regular'
'AlbraText-Bold'
// etc.

// AlbraDisplay
'AlbraDisplay-Regular'
'AlbraDisplay-Bold'
// etc.

// Gilroy
'Gilroy-Regular'
'Gilroy-Bold'
// etc.
```

**Note:** OTF and TTF fonts work identically in React Native CLI. No platform-specific handling needed!

---

## Example Component

See `src/components/FontShowcase.tsx` for a complete example showcasing all available fonts and styles.

To view it, import and use the component:

```typescript
import FontShowcase from './src/components/FontShowcase';

// In your navigator or screen
<FontShowcase />
```

---

## Troubleshooting

### Fonts not showing?

1. **Clean and rebuild:**
   ```bash
   # iOS
   yarn run reset:ios
   yarn ios

   # Android
   yarn run clean:android
   yarn android
   ```

2. **Check font names:** Ensure you're using exact font names from `src/constants/fonts.ts`

3. **Check Info.plist (iOS):** All fonts should be listed under `UIAppFonts` key

4. **Check Android assets:** Fonts should be in `android/app/src/main/assets/fonts/`

### Fonts not displaying on one platform?

- **iOS:** Clean build folder, re-run pod install
  ```bash
  cd ios && pod install && cd ..
  yarn ios
  ```

- **Android:** Clean gradle build
  ```bash
  cd android && ./gradlew clean && cd ..
  yarn android
  ```

---

## Next Steps

1. Update your existing components to use the new fonts
2. Create a theme configuration that includes these font styles
3. Consider creating reusable Text components for consistent typography
4. Test fonts on both iOS and Android devices

---

Happy coding with beautiful typography!
