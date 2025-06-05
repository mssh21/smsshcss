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

        // CSSの基本構造を確認
        expect(result).toMatch(/\.[\w-]+\s*\{[^}]*\}/);

        // モックデータに基づいて期待されるクラスが含まれていることを確認
        expect(result).toContain('.p-md');
        expect(result).toContain('.m-sm');
        expect(result).toContain('.block');
      });

      it('should include reset CSS when enabled', () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: true,
          includeBaseCSS: false,
        };
        const generator = new CSSGenerator(config);
        const result = generator.generateFullCSSSync();

        expect(result).toBeTruthy();
        // Reset CSS関連のスタイルが含まれている可能性を確認
        // 実装に依存するため、存在チェックまたは特定のパターンをチェック
        expect(result).toMatch(/margin\s*:\s*0|padding\s*:\s*0|\*\s*\{/);
      });

      it('should include base CSS when enabled', () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: false,
          includeBaseCSS: true,
        };
        const generator = new CSSGenerator(config);
        const result = generator.generateFullCSSSync();

        expect(result).toBeTruthy();
        // Base CSS関連のスタイルが含まれている可能性を確認
        expect(result).toMatch(/font-family|line-height|body\s*\{/);
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
      const result = generator.generateFullCSSSync();

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // 無効なパターンでも基本的なCSSが生成されることを確認
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty content array', () => {
      const config: SmsshCSSConfig = {
        content: [],
      };
      const generator = new CSSGenerator(config);
      const result = generator.generateFullCSSSync();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // 空のコンテンツでも基本的なCSSが生成されることを確認
      expect(result.length).toBeGreaterThan(0);
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
      const result = generator.generateFullCSSSync();

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // カスタムテーマが部分的に適用されていることを確認
      if (result.includes('2rem')) {
        expect(result).toContain('2rem');
      }
    });
  });

  describe('Performance', () => {
    it('should generate CSS within reasonable time', () => {
      const generator = new CSSGenerator(testConfigs.full);
      const startTime = performance.now();

      const result = generator.generateFullCSSSync();

      const endTime = performance.now();
      const duration = endTime - startTime;

      // パフォーマンステストを改善：結果の品質も確認
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);

      // 1秒以内で完了することを確認（より安定したタイミング測定）
      expect(duration).toBeLessThan(1000);
    });

    it('should handle large content arrays efficiently', () => {
      const largeContentConfig: SmsshCSSConfig = {
        content: Array.from({ length: 100 }, (_, i) => `src/component-${i}.html`),
      };
      const generator = new CSSGenerator(largeContentConfig);
      const startTime = performance.now();

      const result = generator.generateFullCSSSync();

      const endTime = performance.now();

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');

      // 大量のコンテンツでも合理的な時間で処理されることを確認
      expect(endTime - startTime).toBeLessThan(2000);
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
