# Font Constants Quick Reference

## Quick Import

```typescript
import { AppFonts, TextStyles, FontSizes } from './src/constants/fonts';
```

## Most Common Usage

### 1. Use Preset Styles (Easiest)

```typescript
<Text style={TextStyles.title}>Page Title</Text>
<Text style={TextStyles.body}>Paragraph text</Text>
<Text style={TextStyles.button}>Button Label</Text>
```

### 2. Direct Font Access

```typescript
<Text style={{ fontFamily: AppFonts.body.regular, fontSize: 16 }}>
  Custom Text
</Text>
```

## Font Recommendations

| Use Case | Recommended Font | Reason |
|----------|------------------|---------|
| Paragraphs | `AppFonts.body.regular` (AlbraText) | Optimized for readability |
| Headlines | `AppFonts.display.bold` (AlbraDisplay) | Great at large sizes |
| Buttons | `AppFonts.ui.semiBold` (AlbraSans) | Clean UI appearance |
| Modern UI | `AppFonts.geometric.bold` (Gilroy) | Geometric, modern look |
| Labels | `AppFonts.ui.medium` (AlbraSans) | Clear and legible |

## Font Weights Guide

- **Light**: Subtle, elegant (use sparingly)
- **Regular**: Default for body text
- **Medium**: Slight emphasis (good for labels)
- **Semi Bold**: More emphasis (good for subheadings)
- **Bold**: Strong emphasis (headings, buttons)
- **Black**: Maximum impact (hero text)

## Example Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppFonts, TextStyles } from './src/constants/fonts';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={TextStyles.title}>Welcome Back</Text>
      <Text style={TextStyles.body}>
        This is body text that's easy to read.
      </Text>
      <Text style={[TextStyles.button, styles.buttonText]}>
        Get Started
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonText: {
    color: '#007AFF',
  },
});

export default MyComponent;
```

## Font Family Overview

### AppFonts.body (AlbraText)
- **Purpose**: Body text, paragraphs
- **Weights**: light, regular, medium, semiBold, bold
- **Best for**: Reading comfort at 14-18px

### AppFonts.display (AlbraDisplay)
- **Purpose**: Large headings, hero text
- **Weights**: light, regular, medium, semiBold, bold, black
- **Best for**: Impact at 24-48px

### AppFonts.ui (AlbraSans)
- **Purpose**: Interface elements
- **Weights**: light, regular, medium, semiBold, bold
- **Best for**: Buttons, tabs, labels at 12-16px

### AppFonts.geometric (Gilroy)
- **Purpose**: Modern, geometric style
- **Weights**: light, regular, medium, bold, heavy
- **Best for**: Tech/modern aesthetic at any size

### AppFonts.grotesk (AlbraGrotesk)
- **Purpose**: Clean, modern interfaces
- **Weights**: light, regular, medium, semiBold, bold, black
- **Best for**: Minimalist designs at any size

## Need More Details?

See `FONT_USAGE_GUIDE.md` in the root directory for comprehensive documentation.

To view all fonts visually, use the `FontShowcase` component:

```typescript
import FontShowcase from './src/components/FontShowcase';
```
