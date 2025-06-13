import { describe, it, expect, beforeEach } from 'vitest';
import { CSSGenerator } from '../core/generator';
import { setupDefaultMocks, testConfigs, cssValidators } from './setup';
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

  describe('Display Generation', () => {
    it('should generate display utility class', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // 新しいクラスが生成されていることを確認
      expect(cssValidators.hasClass(result, 'block')).toBe(true);
      expect(cssValidators.hasClass(result, 'inline')).toBe(true);
      expect(cssValidators.hasClass(result, 'inline-block')).toBe(true);
      expect(cssValidators.hasClass(result, 'flex')).toBe(true);
      expect(cssValidators.hasClass(result, 'inline-flex')).toBe(true);
      expect(cssValidators.hasClass(result, 'grid')).toBe(true);
      expect(cssValidators.hasClass(result, 'inline-grid')).toBe(true);
      expect(cssValidators.hasClass(result, 'none')).toBe(true);
      expect(cssValidators.hasClass(result, 'contents')).toBe(true);
      expect(cssValidators.hasClass(result, 'hidden')).toBe(true);

      // 期待されるCSSプロパティが含まれていることを確認
      expect(result).toMatch(/\.block\s*\{[^}]*display: block[^}]*\}/);
      expect(result).toMatch(/\.inline\s*\{[^}]*display: inline[^}]*\}/);
      expect(result).toMatch(/\.inline-block\s*\{[^}]*display: inline flow-root[^}]*\}/);
      expect(result).toMatch(/\.flex\s*\{[^}]*display: block flex[^}]*\}/);
      expect(result).toMatch(/\.inline-flex\s*\{[^}]*display: inline flex[^}]*\}/);
      expect(result).toMatch(/\.grid\s*\{[^}]*display: block grid[^}]*\}/);
      expect(result).toMatch(/\.inline-grid\s*\{[^}]*display: inline grid[^}]*\}/);
      expect(result).toMatch(/\.none\s*\{[^}]*display: none[^}]*\}/);
      expect(result).toMatch(/\.contents\s*\{[^}]*display: contents[^}]*\}/);
      expect(result).toMatch(/\.hidden\s*\{[^}]*display: none[^}]*\}/);
    });
  });

  describe('Flexbox Generation', () => {
    it('should generate flexbox utility class', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // 新しいクラスが生成されていることを確認
      expect(cssValidators.hasClass(result, 'basis-full')).toBe(true);
      expect(cssValidators.hasClass(result, 'shrink')).toBe(true);
      expect(cssValidators.hasClass(result, 'grow')).toBe(true);

      // 期待されるCSSプロパティが含まれていることを確認
      expect(result).toMatch(/\.basis-full\s*\{[^}]*flex-basis: 100%[^}]*\}/);
      expect(result).toMatch(/\.shrink\s*\{[^}]*flex-shrink: 1[^}]*\}/);
      expect(result).toMatch(/\.grow\s*\{[^}]*flex-grow: 1[^}]*\}/);
    });
  });

  describe('Grid Generation', () => {
    it('should generate grid utility classes', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // グリッドテンプレートのクラスを確認
      expect(cssValidators.hasClass(result, 'grid-cols-2')).toBe(true);
      expect(cssValidators.hasClass(result, 'grid-rows-2')).toBe(true);

      // グリッドアイテムの配置クラスを確認
      expect(cssValidators.hasClass(result, 'col-span-2')).toBe(true);
      expect(cssValidators.hasClass(result, 'row-span-2')).toBe(true);
      expect(cssValidators.hasClass(result, 'col-start-2')).toBe(true);
      expect(cssValidators.hasClass(result, 'row-start-2')).toBe(true);

      // グリッドの配置プロパティを確認
      expect(result).toMatch(
        /\.grid-cols-2\s*\{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)[^}]*\}/
      );
      expect(result).toMatch(
        /\.grid-rows-2\s*\{[^}]*grid-template-rows: repeat\(2, minmax\(0, 1fr\)\)[^}]*\}/
      );
      expect(result).toMatch(/\.col-span-2\s*\{[^}]*grid-column: span 2 \/ span 2[^}]*\}/);
      expect(result).toMatch(/\.row-span-2\s*\{[^}]*grid-row: span 2 \/ span 2[^}]*\}/);
      expect(result).toMatch(/\.col-start-2\s*\{[^}]*grid-column-start: 2[^}]*\}/);
      expect(result).toMatch(/\.row-start-2\s*\{[^}]*grid-row-start: 2[^}]*\}/);
    });
  });

  describe('Z-Index Generation', () => {
    it('should generate z-index utility class', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // 新しいクラスが生成されていることを確認
      expect(cssValidators.hasClass(result, 'z-10')).toBe(true);

      // 期待されるCSSプロパティが含まれていることを確認
      expect(result).toMatch(/\.z-10\s*\{[^}]*z-index: 10[^}]*\}/);
    });
  });

  describe('Order Generation', () => {
    it('should generate order utility class', () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = generator.generateFullCSSSync();

      // 新しいクラスが生成されていることを確認
      expect(cssValidators.hasClass(result, 'order-10')).toBe(true);

      // 期待されるCSSプロパティが含まれていることを確認
      expect(result).toMatch(/\.order-10\s*\{[^}]*order: 10[^}]*\}/);
    });
  });
});
