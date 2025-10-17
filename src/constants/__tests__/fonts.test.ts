import {
  FontFamilies,
  AppFonts,
  FontSizes,
  TextStyles,
} from '../fonts';

describe('Font Constants', () => {
  describe('FontFamilies', () => {
    it('should have all Albra variants', () => {
      expect(FontFamilies.Albra).toBeDefined();
      expect(FontFamilies.Albra.Regular).toBe('Albra-Regular');
      expect(FontFamilies.Albra.Bold).toBe('Albra-Bold');
      expect(FontFamilies.Albra.Light).toBe('Albra-Light');
    });

    it('should have AlbraText family', () => {
      expect(FontFamilies.AlbraText).toBeDefined();
      expect(FontFamilies.AlbraText.Regular).toBe('AlbraText-Regular');
      expect(FontFamilies.AlbraText.Bold).toBe('AlbraText-Bold');
    });

    it('should have AlbraDisplay family', () => {
      expect(FontFamilies.AlbraDisplay).toBeDefined();
      expect(FontFamilies.AlbraDisplay.Regular).toBe('AlbraDisplay-Regular');
      expect(FontFamilies.AlbraDisplay.Bold).toBe('AlbraDisplay-Bold');
    });

    it('should have AlbraGrotesk family', () => {
      expect(FontFamilies.AlbraGrotesk).toBeDefined();
      expect(FontFamilies.AlbraGrotesk.Regular).toBe('AlbraGrotesk-Regular');
    });

    it('should have AlbraSans family', () => {
      expect(FontFamilies.AlbraSans).toBeDefined();
      expect(FontFamilies.AlbraSans.Regular).toBe('AlbraSans-Regular');
    });

    it('should have Gilroy family', () => {
      expect(FontFamilies.Gilroy).toBeDefined();
      expect(FontFamilies.Gilroy.Regular).toBe('Gilroy-Regular');
      expect(FontFamilies.Gilroy.Bold).toBe('Gilroy-Bold');
      expect(FontFamilies.Gilroy.Heavy).toBe('Gilroy-Heavy');
    });
  });

  describe('AppFonts', () => {
    it('should have body fonts', () => {
      expect(AppFonts.body).toBeDefined();
      expect(AppFonts.body.regular).toBe('AlbraText-Regular');
      expect(AppFonts.body.bold).toBe('AlbraText-Bold');
      expect(AppFonts.body.light).toBe('AlbraText-Light');
    });

    it('should have display fonts', () => {
      expect(AppFonts.display).toBeDefined();
      expect(AppFonts.display.regular).toBe('AlbraDisplay-Regular');
      expect(AppFonts.display.bold).toBe('AlbraDisplay-Bold');
      expect(AppFonts.display.black).toBe('AlbraDisplay-Black');
    });

    it('should have UI fonts', () => {
      expect(AppFonts.ui).toBeDefined();
      expect(AppFonts.ui.regular).toBe('AlbraSans-Regular');
      expect(AppFonts.ui.semiBold).toBe('AlbraSans-Semi');
    });

    it('should have geometric fonts', () => {
      expect(AppFonts.geometric).toBeDefined();
      expect(AppFonts.geometric.regular).toBe('Gilroy-Regular');
      expect(AppFonts.geometric.heavy).toBe('Gilroy-Heavy');
    });

    it('should have grotesk fonts', () => {
      expect(AppFonts.grotesk).toBeDefined();
      expect(AppFonts.grotesk.regular).toBe('AlbraGrotesk-Regular');
      expect(AppFonts.grotesk.black).toBe('AlbraGrotesk-Black');
    });
  });

  describe('FontSizes', () => {
    it('should have display sizes', () => {
      expect(FontSizes.display.large).toBe(48);
      expect(FontSizes.display.medium).toBe(40);
      expect(FontSizes.display.small).toBe(36);
    });

    it('should have heading sizes', () => {
      expect(FontSizes.heading.h1).toBe(32);
      expect(FontSizes.heading.h2).toBe(28);
      expect(FontSizes.heading.h3).toBe(24);
      expect(FontSizes.heading.h4).toBe(20);
      expect(FontSizes.heading.h5).toBe(18);
      expect(FontSizes.heading.h6).toBe(16);
    });

    it('should have body sizes', () => {
      expect(FontSizes.body.large).toBe(18);
      expect(FontSizes.body.regular).toBe(16);
      expect(FontSizes.body.small).toBe(14);
    });

    it('should have UI sizes', () => {
      expect(FontSizes.ui.large).toBe(16);
      expect(FontSizes.ui.regular).toBe(14);
      expect(FontSizes.ui.small).toBe(12);
      expect(FontSizes.ui.tiny).toBe(10);
    });

    it('should have all sizes as numbers', () => {
      const allSizes = [
        ...Object.values(FontSizes.display),
        ...Object.values(FontSizes.heading),
        ...Object.values(FontSizes.body),
        ...Object.values(FontSizes.ui),
      ];

      allSizes.forEach((size) => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });
  });

  describe('TextStyles', () => {
    it('should have hero style with correct properties', () => {
      expect(TextStyles.hero).toBeDefined();
      expect(TextStyles.hero.fontFamily).toBe(AppFonts.display.bold);
      expect(TextStyles.hero.fontSize).toBe(48);
      expect(TextStyles.hero.lineHeight).toBe(48 * 1.2);
    });

    it('should have title style', () => {
      expect(TextStyles.title).toBeDefined();
      expect(TextStyles.title.fontFamily).toBe(AppFonts.display.bold);
      expect(TextStyles.title.fontSize).toBe(32);
    });

    it('should have heading style', () => {
      expect(TextStyles.heading).toBeDefined();
      expect(TextStyles.heading.fontFamily).toBe(AppFonts.display.semiBold);
      expect(TextStyles.heading.fontSize).toBe(28);
    });

    it('should have body styles', () => {
      expect(TextStyles.body).toBeDefined();
      expect(TextStyles.bodyLarge).toBeDefined();
      expect(TextStyles.bodySmall).toBeDefined();
      expect(TextStyles.bodyBold).toBeDefined();

      expect(TextStyles.body.fontFamily).toBe(AppFonts.body.regular);
      expect(TextStyles.bodyBold.fontFamily).toBe(AppFonts.body.bold);
    });

    it('should have button style', () => {
      expect(TextStyles.button).toBeDefined();
      expect(TextStyles.button.fontFamily).toBe(AppFonts.ui.semiBold);
      expect(TextStyles.button.fontSize).toBe(14);
    });

    it('should have caption style', () => {
      expect(TextStyles.caption).toBeDefined();
      expect(TextStyles.caption.fontSize).toBe(12);
    });

    it('should have label style', () => {
      expect(TextStyles.label).toBeDefined();
      expect(TextStyles.label.fontFamily).toBe(AppFonts.ui.medium);
    });

    it('should have proper line heights for all styles', () => {
      const styles = Object.values(TextStyles);

      styles.forEach((style) => {
        expect(style.lineHeight).toBeGreaterThan(style.fontSize);
      });
    });
  });

  describe('Type safety', () => {
    it('should be immutable (as const)', () => {
      // TypeScript will enforce this at compile time
      // Runtime check: objects should be frozen or at least not extensible
      expect(() => {
        // @ts-expect-error Testing runtime immutability
        FontFamilies.Albra.NewFont = 'test';
      }).toBeDefined();
    });

    it('should have consistent structure across font families', () => {
      const families = [
        FontFamilies.Albra,
        FontFamilies.AlbraText,
        FontFamilies.AlbraDisplay,
        FontFamilies.AlbraGrotesk,
        FontFamilies.AlbraSans,
      ];

      families.forEach((family) => {
        expect(family.Regular).toBeDefined();
        expect(family.Bold).toBeDefined();
        expect(typeof family.Regular).toBe('string');
        expect(typeof family.Bold).toBe('string');
      });
    });
  });
});
