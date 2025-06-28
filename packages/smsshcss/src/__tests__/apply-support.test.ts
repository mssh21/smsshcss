import { describe, it, expect, beforeEach } from 'vitest';
import { CSSGenerator } from '../core/generator';
import { setupDefaultMocks } from './setup';
import type { SmsshCSSConfig } from '../core/types';

describe('Apply Support - Detailed Tests', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Apply Configuration', () => {
    it('should generate apply classes with multiple utilities', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'btn-primary': 'p-md bg-blue-500 text-white',
          'card-wrapper': 'm-md p-lg border-gray-100',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      // Generated apply classes should contain the CSS rules
      expect(css).toContain('.btn-primary');
      expect(css).toContain('.card-wrapper');

      // Check basic structure
      expect(css).toBeTruthy();
      expect(typeof css).toBe('string');
    });

    it('should handle spacing utilities in apply', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'spacing-test': 'm-md p-lg mx-xl py-sm',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      expect(css).toContain('.spacing-test');
      expect(css).toBeTruthy();
    });

    it('should handle color utilities in apply', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'color-test': 'text-blue-500 bg-red-500 border-green-500',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      expect(css).toContain('.color-test');
      expect(css).toBeTruthy();
    });

    it('should handle display and layout utilities in apply', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'layout-test': 'flex block w-full h-screen',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      expect(css).toContain('.layout-test');
      expect(css).toBeTruthy();
    });

    it('should handle flexbox utilities in apply', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'flex-test': 'flex justify-center items-center',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      expect(css).toContain('.flex-test');
      expect(css).toBeTruthy();
    });

    it('should handle grid utilities in apply', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'grid-test': 'grid grid-cols-3 gap-md',
        },
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();

      expect(css).toContain('.grid-test');
      expect(css).toBeTruthy();
    });

    it('should handle empty apply configuration', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {},
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();
      expect(css).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined apply configuration', async () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
      };

      const generator = new CSSGenerator(config);
      const css = await generator.generateFullCSS();
      expect(css).toBeTruthy();

      // デフォルトクラスが生成されていることを確認
      expect(css).toContain('.m-xs');
      expect(css).toContain('.w-full');
      expect(css).toContain('.h-full');
    });
  });
});
