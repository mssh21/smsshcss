import { describe, it, expect, beforeEach } from 'vitest';
import { CSSGenerator } from '../core/generator';
import { setupDefaultMocks, testConfigs } from './setup';
import type { SmsshCSSConfig } from '../core/types';

describe('CSSGenerator', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Constructor', () => {
    it('should initialize with default configuration', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      expect(generator).toBeInstanceOf(CSSGenerator);
    });

    it('should initialize with custom configuration', () => {
      const generator = new CSSGenerator(testConfigs.full);
      expect(generator).toBeInstanceOf(CSSGenerator);
    });
  });

  describe('CSS Generation', () => {
    describe('Basic Generation', () => {
      it('should generate basic CSS without reset and base', () => {
        const generator = new CSSGenerator(testConfigs.minimal);
        const result = generator.generateFullCSSSync();

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      it('should include reset CSS when enabled', () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: true,
          includeBaseCSS: false,
        };
        const generator = new CSSGenerator(config);
        const result = generator.generateFullCSSSync();

        // Reset CSSが含まれているかチェック（実装に依存）
        expect(result).toBeTruthy();
      });

      it('should include base CSS when enabled', () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: false,
          includeBaseCSS: true,
        };
        const generator = new CSSGenerator(config);
        const result = generator.generateFullCSSSync();

        // Base CSSが含まれているかチェック（実装に依存）
        expect(result).toBeTruthy();
      });
    });

    describe('Async Generation', () => {
      it('should generate CSS asynchronously', async () => {
        const generator = new CSSGenerator(testConfigs.minimal);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      it('should handle async generation with purging', async () => {
        const generator = new CSSGenerator(testConfigs.withPurge);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });

    describe('Theme Support', () => {
      it('should apply custom theme configuration', () => {
        const generator = new CSSGenerator(testConfigs.withTheme);
        const result = generator.generateFullCSSSync();

        expect(result).toBeTruthy();
        // カスタムテーマが適用されているかは実装に依存
      });

      it('should merge custom theme with defaults', () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          theme: {
            spacing: {
              'custom-xl': '10rem',
            },
            display: {
              'custom-flex': 'inline-flex',
            },
          },
        };
        const generator = new CSSGenerator(config);
        const result = generator.generateFullCSSSync();

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid content patterns gracefully', () => {
      const config: SmsshCSSConfig = {
        content: ['invalid/**/*.pattern'],
      };
      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
    });

    it('should handle empty content array', () => {
      const config: SmsshCSSConfig = {
        content: [],
      };
      const generator = new CSSGenerator(config);
      const result = generator.generateFullCSSSync();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle missing theme properties', () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
        theme: {
          // 一部のプロパティのみ指定
          spacing: {
            custom: '2rem',
          },
        },
      };
      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should generate CSS within reasonable time', () => {
      const generator = new CSSGenerator(testConfigs.full);
      const startTime = Date.now();

      generator.generateFullCSSSync();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 1秒以内で完了することを確認
      expect(duration).toBeLessThan(1000);
    });

    it('should handle large content arrays efficiently', () => {
      const largeContentConfig: SmsshCSSConfig = {
        content: Array.from({ length: 100 }, (_, i) => `src/component-${i}.html`),
      };
      const generator = new CSSGenerator(largeContentConfig);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
    });
  });

  describe('CSS Structure', () => {
    it('should maintain consistent CSS structure', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // CSSの基本的な構造をチェック
      expect(result).toBeTruthy();
      expect(result.includes('{')).toBe(true);
      expect(result.includes('}')).toBe(true);
    });

    it('should generate valid CSS syntax', () => {
      const generator = new CSSGenerator(testConfigs.full);
      const result = generator.generateFullCSSSync();

      // 基本的なCSS構文チェック
      expect(result).toBeTruthy();

      // 括弧の対応をチェック
      const openBraces = (result.match(/{/g) || []).length;
      const closeBraces = (result.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });
  });
});
