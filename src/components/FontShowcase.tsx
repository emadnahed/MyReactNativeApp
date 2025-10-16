import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { AppFonts, TextStyles, FontSizes } from '../constants/fonts';

/**
 * FontShowcase Component
 *
 * This component demonstrates all available font styles in the app.
 * Use this as a reference for implementing typography throughout your app.
 */
const FontShowcase: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display / Hero Text</Text>
          <Text style={TextStyles.hero}>Hero Text</Text>
          <Text style={[TextStyles.title, styles.marginTop]}>Page Title</Text>
        </View>

        {/* Headings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Headings</Text>
          <Text style={TextStyles.heading}>Heading Text (H2)</Text>
          <Text style={[TextStyles.subheading, styles.marginTop]}>
            Subheading Text (H3)
          </Text>
        </View>

        {/* Body Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Text</Text>
          <Text style={TextStyles.bodyLarge}>
            Large body text for emphasis. Perfect for introductions and important
            paragraphs.
          </Text>
          <Text style={[TextStyles.body, styles.marginTop]}>
            Regular body text is optimized for readability. This is your primary
            text style for most content. It uses AlbraText which is specifically
            designed for comfortable reading.
          </Text>
          <Text style={[TextStyles.bodySmall, styles.marginTop]}>
            Small body text for secondary information or less important details.
          </Text>
          <Text style={[TextStyles.bodyBold, styles.marginTop]}>
            Bold body text for emphasis within paragraphs.
          </Text>
        </View>

        {/* UI Elements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UI Elements</Text>
          <View style={styles.button}>
            <Text style={[TextStyles.button, styles.buttonText]}>
              Button Text
            </Text>
          </View>
          <Text style={[TextStyles.label, styles.marginTop]}>Label Text</Text>
          <Text style={[TextStyles.caption, styles.marginTop]}>
            Caption text for helper information
          </Text>
        </View>

        {/* Font Families Showcase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Families</Text>

          {/* AlbraText - Body */}
          <Text style={styles.familyTitle}>AlbraText (Body)</Text>
          <Text style={{ fontFamily: AppFonts.body.light, fontSize: 16 }}>
            Light - Subtle and elegant
          </Text>
          <Text style={{ fontFamily: AppFonts.body.regular, fontSize: 16 }}>
            Regular - Perfect for reading
          </Text>
          <Text style={{ fontFamily: AppFonts.body.medium, fontSize: 16 }}>
            Medium - Slightly emphasized
          </Text>
          <Text style={{ fontFamily: AppFonts.body.semiBold, fontSize: 16 }}>
            Semi Bold - More emphasis
          </Text>
          <Text style={{ fontFamily: AppFonts.body.bold, fontSize: 16 }}>
            Bold - Strong emphasis
          </Text>

          {/* AlbraDisplay - Display */}
          <Text style={[styles.familyTitle, styles.marginTop]}>
            AlbraDisplay (Headlines)
          </Text>
          <Text style={{ fontFamily: AppFonts.display.regular, fontSize: 24 }}>
            Display Regular
          </Text>
          <Text style={{ fontFamily: AppFonts.display.semiBold, fontSize: 24 }}>
            Display Semi Bold
          </Text>
          <Text style={{ fontFamily: AppFonts.display.bold, fontSize: 24 }}>
            Display Bold
          </Text>
          <Text style={{ fontFamily: AppFonts.display.black, fontSize: 24 }}>
            Display Black
          </Text>

          {/* AlbraSans - UI */}
          <Text style={[styles.familyTitle, styles.marginTop]}>
            AlbraSans (UI Elements)
          </Text>
          <Text style={{ fontFamily: AppFonts.ui.light, fontSize: 14 }}>
            UI Light - Minimal
          </Text>
          <Text style={{ fontFamily: AppFonts.ui.regular, fontSize: 14 }}>
            UI Regular - Standard
          </Text>
          <Text style={{ fontFamily: AppFonts.ui.medium, fontSize: 14 }}>
            UI Medium - Balanced
          </Text>
          <Text style={{ fontFamily: AppFonts.ui.semiBold, fontSize: 14 }}>
            UI Semi Bold - Emphasized
          </Text>
          <Text style={{ fontFamily: AppFonts.ui.bold, fontSize: 14 }}>
            UI Bold - Strong
          </Text>

          {/* Gilroy - Geometric */}
          <Text style={[styles.familyTitle, styles.marginTop]}>
            Gilroy (Geometric)
          </Text>
          <Text style={{ fontFamily: AppFonts.geometric.light, fontSize: 16 }}>
            Gilroy Light - Modern & Clean
          </Text>
          <Text style={{ fontFamily: AppFonts.geometric.regular, fontSize: 16 }}>
            Gilroy Regular - Versatile
          </Text>
          <Text style={{ fontFamily: AppFonts.geometric.medium, fontSize: 16 }}>
            Gilroy Medium - Balanced
          </Text>
          <Text style={{ fontFamily: AppFonts.geometric.bold, fontSize: 16 }}>
            Gilroy Bold - Impactful
          </Text>
          <Text style={{ fontFamily: AppFonts.geometric.heavy, fontSize: 16 }}>
            Gilroy Heavy - Maximum Impact
          </Text>

          {/* AlbraGrotesk - Modern */}
          <Text style={[styles.familyTitle, styles.marginTop]}>
            AlbraGrotesk (Modern)
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.light, fontSize: 16 }}>
            Grotesk Light - Minimal
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.regular, fontSize: 16 }}>
            Grotesk Regular - Clean
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.medium, fontSize: 16 }}>
            Grotesk Medium - Balanced
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.semiBold, fontSize: 16 }}>
            Grotesk Semi Bold - Strong
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.bold, fontSize: 16 }}>
            Grotesk Bold - Bold
          </Text>
          <Text style={{ fontFamily: AppFonts.grotesk.black, fontSize: 16 }}>
            Grotesk Black - Heaviest
          </Text>
        </View>

        {/* Usage Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Recommendations</Text>
          <View style={styles.recommendation}>
            <Text style={TextStyles.bodyBold}>Body Text:</Text>
            <Text style={TextStyles.body}>
              Use AlbraText for paragraphs and any long-form content. It's
              optimized for readability at smaller sizes.
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={TextStyles.bodyBold}>Headlines & Titles:</Text>
            <Text style={TextStyles.body}>
              Use AlbraDisplay for large headings and hero text. It's designed to
              look great at large sizes.
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={TextStyles.bodyBold}>Buttons & UI:</Text>
            <Text style={TextStyles.body}>
              Use AlbraSans for buttons, tabs, and UI labels. It's clean and works
              well for interface elements.
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={TextStyles.bodyBold}>Modern Look:</Text>
            <Text style={TextStyles.body}>
              Use Gilroy or AlbraGrotesk for a geometric, modern aesthetic. Great
              for tech-focused or minimalist designs.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: AppFonts.ui.bold,
    fontSize: FontSizes.heading.h4,
    color: '#666666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  familyTitle: {
    fontFamily: AppFonts.ui.semiBold,
    fontSize: FontSizes.heading.h5,
    color: '#333333',
    marginBottom: 8,
    marginTop: 16,
  },
  marginTop: {
    marginTop: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  recommendation: {
    marginBottom: 16,
  },
});

export default FontShowcase;
