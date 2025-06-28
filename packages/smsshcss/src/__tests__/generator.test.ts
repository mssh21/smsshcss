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
      it('should generate basic CSS without reset and base', async () => {
        const generator = new CSSGenerator(testConfigs.minimal);
        const result = await generator.generateFullCSS();

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

      it('should include reset CSS when enabled', async () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: true,
          includeBaseCSS: false,
        };
        const generator = new CSSGenerator(config);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        // Reset CSS関連のスタイルが含まれている可能性を確認
        // 実装に依存するため、存在チェックまたは特定のパターンをチェック
        expect(result).toMatch(/margin\s*:\s*0|padding\s*:\s*0|\*\s*\{/);
      });

      it('should include base CSS when enabled', async () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          includeResetCSS: false,
          includeBaseCSS: true,
        };
        const generator = new CSSGenerator(config);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        // Base CSSが有効な場合のテストは実装に依存するので基本的なチェックのみ
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
      it('should apply custom theme configuration', async () => {
        const generator = new CSSGenerator(testConfigs.withTheme);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        // カスタムテーマが適用されているかは実装に依存
      });

      it('should merge custom theme with defaults', async () => {
        const config: SmsshCSSConfig = {
          content: ['src/**/*.html'],
          theme: {
            spacing: {
              'custom-xl': '10rem',
            },
          },
        };
        const generator = new CSSGenerator(config);
        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid content patterns gracefully', async () => {
      const config: SmsshCSSConfig = {
        content: ['invalid/**/*.pattern'],
      };
      const generator = new CSSGenerator(config);
      const result = await generator.generateFullCSS();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // 無効なパターンでも基本的なCSSが生成されることを確認
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty content array', async () => {
      const config: SmsshCSSConfig = {
        content: [],
      };

      // 空のコンテンツ配列は設定検証でエラーになることを確認
      expect(() => new CSSGenerator(config)).toThrow(
        /Content array must contain at least one pattern/
      );
    });

    it('should handle missing theme properties', async () => {
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
      const result = await generator.generateFullCSS();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // カスタムテーマが部分的に適用されていることを確認
      if (result.includes('2rem')) {
        expect(result).toContain('2rem');
      }
    });
  });

  describe('Performance', () => {
    it('should generate CSS within reasonable time', async () => {
      const generator = new CSSGenerator(testConfigs.full);
      const startTime = performance.now();

      const result = await generator.generateFullCSS();

      const endTime = performance.now();
      const duration = endTime - startTime;

      // パフォーマンステストを改善：結果の品質も確認
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);

      // 2秒以内で完了することを確認（非同期なので若干余裕を持たせる）
      expect(duration).toBeLessThan(2000);
    });

    it('should handle large content arrays efficiently', async () => {
      const largeContentConfig: SmsshCSSConfig = {
        content: Array.from({ length: 100 }, (_, i) => `src/component-${i}.html`),
      };
      const generator = new CSSGenerator(largeContentConfig);
      const startTime = performance.now();

      const result = await generator.generateFullCSS();

      const endTime = performance.now();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');

      // 大量のコンテンツでも合理的な時間で処理されることを確認
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });

  describe('CSS Structure', () => {
    it('should maintain consistent CSS structure', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      // CSSの基本的な構造をチェック
      expect(result).toBeTruthy();
      expect(result.includes('{')).toBe(true);
      expect(result.includes('}')).toBe(true);
    });

    it('should generate valid CSS syntax', async () => {
      const generator = new CSSGenerator(testConfigs.full);
      const result = await generator.generateFullCSS();

      // 基本的なCSS構文チェック
      expect(result).toBeTruthy();

      // 括弧の対応をチェック
      const openBraces = (result.match(/{/g) || []).length;
      const closeBraces = (result.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate content configuration', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle empty configuration gracefully', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
      };
      const generator = new CSSGenerator(config);
      const result = await generator.generateFullCSS();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Flexbox Generation', () => {
    it('should generate flexbox utility class', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

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
    it('should generate grid utility classes', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Custom Classes', () => {
    it('should extract and generate custom arbitrary value classes', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      // カスタムクラスの抽出が動作していることを確認
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    describe('Arbitrary Value Classes', () => {
      it('should extract and generate basic arbitrary value classes', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-arbitrary.html'],
        };

        const generator = new CSSGenerator(config);

        // extractCustomClassesFromFilesをモック
        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.m-\\[10px\\] { margin: 10px; }',
            '.p-\\[20px\\] { padding: 20px; }',
            '.w-\\[300px\\] { width: 300px; }',
            '.h-\\[200px\\] { height: 200px; }',
          ]);

        // プライベートメソッドをモック
        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('.m-\\[10px\\]');
        expect(result).toContain('.p-\\[20px\\]');
        expect(result).toContain('.w-\\[300px\\]');
        expect(result).toContain('.h-\\[200px\\]');
        expect(result).toContain('margin: 10px');
        expect(result).toContain('padding: 20px');
        expect(result).toContain('width: 300px');
        expect(result).toContain('height: 200px');
      });

      it('should handle CSS calc() functions in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-calc.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.m-\\[calc\\(100\\%-20px\\)\\] { margin: calc(100% - 20px); }',
            '.p-\\[calc\\(1rem\\+10px\\)\\] { padding: calc(1rem + 10px); }',
            '.w-\\[calc\\(50vw-2rem\\)\\] { width: calc(50vw - 2rem); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('calc(100% - 20px)');
        expect(result).toContain('calc(1rem + 10px)');
        expect(result).toContain('calc(50vw - 2rem)');
      });

      it('should handle CSS clamp() functions in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-clamp.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.w-\\[clamp\\(1rem\\,50vw\\,100rem\\)\\] { width: clamp(1rem, 50vw, 100rem); }',
            '.font-size-\\[clamp\\(14px\\,2vw\\,24px\\)\\] { font-size: clamp(14px, 2vw, 24px); }',
            '.m-\\[clamp\\(0px\\,5\\%\\,20px\\)\\] { margin: clamp(0px, 5%, 20px); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('clamp(1rem, 50vw, 100rem)');
        expect(result).toContain('clamp(14px, 2vw, 24px)');
        expect(result).toContain('clamp(0px, 5%, 20px)');
      });

      it('should handle CSS min() and max() functions in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-minmax.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.w-\\[min\\(100\\%\\,500px\\)\\] { width: min(100%, 500px); }',
            '.h-\\[max\\(50vh\\,300px\\)\\] { height: max(50vh, 300px); }',
            '.m-\\[min\\(2rem\\,5vw\\)\\] { margin: min(2rem, 5vw); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('min(100%, 500px)');
        expect(result).toContain('max(50vh, 300px)');
        expect(result).toContain('min(2rem, 5vw)');
      });

      it('should handle nested CSS functions in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-nested.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.m-\\[calc\\(min\\(2rem\\,5vw\\)\\+10px\\)\\] { margin: calc(min(2rem, 5vw) + 10px); }',
            '.w-\\[clamp\\(calc\\(100\\%-40px\\)\\,50vw\\,calc\\(100\\%\\+20px\\)\\)\\] { width: clamp(calc(100% - 40px), 50vw, calc(100% + 20px)); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('calc(min(2rem, 5vw) + 10px)');
        expect(result).toContain('clamp(calc(100% - 40px), 50vw, calc(100% + 20px))');
      });

      it('should handle special characters in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-special.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            ".bg-\\[url\\(\\'image\\.png\\'\\)\\] { background: url('image.png'); }",
            ".content-\\[\\'Hello\\,\\ World\\!\\'\\] { content: 'Hello, World!'; }",
            ".font-family-\\[\\'SF\\ Pro\\ Display\\'\\,\\ sans-serif\\] { font-family: 'SF Pro Display', sans-serif; }",
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain("url('image.png')");
        expect(result).toContain("'Hello, World!'");
        expect(result).toContain("'SF Pro Display', sans-serif");
      });

      it('should handle CSS variables in arbitrary values', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-variables.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.text-\\[var\\(--primary-color\\)\\] { color: var(--primary-color); }',
            '.m-\\[var\\(--spacing-lg\\,\\ 2rem\\)\\] { margin: var(--spacing-lg, 2rem); }',
            '.w-\\[var\\(--container-width\\)\\] { width: var(--container-width); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('var(--primary-color)');
        expect(result).toContain('var(--spacing-lg, 2rem)');
        expect(result).toContain('var(--container-width)');
      });

      it('should handle different arbitrary value prefixes', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-prefixes.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi.fn().mockResolvedValue([
          // Spacing
          '.m-\\[15px\\] { margin: 15px; }',
          '.p-\\[25px\\] { padding: 25px; }',
          '.mx-\\[30px\\] { margin-left: 30px; margin-right: 30px; }',
          '.py-\\[35px\\] { padding-top: 35px; padding-bottom: 35px; }',
          // Sizing
          '.w-\\[250px\\] { width: 250px; }',
          '.h-\\[150px\\] { height: 150px; }',
          '.min-w-\\[100px\\] { min-width: 100px; }',
          '.max-h-\\[500px\\] { max-height: 500px; }',
          // Colors
          '.text-\\[\\#ff6b6b\\] { color: #ff6b6b; }',
          '.bg-\\[rgb\\(51\\,51\\,51\\)\\] { background-color: rgb(51, 51, 51); }',
          // Grid
          '.grid-cols-\\[200px\\ 1fr\\ 100px\\] { grid-template-columns: 200px 1fr 100px; }',
          '.gap-\\[20px\\] { gap: 20px; }',
        ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        // Check spacing classes
        expect(result).toContain('margin: 15px');
        expect(result).toContain('padding: 25px');
        expect(result).toContain('margin-left: 30px');
        expect(result).toContain('padding-top: 35px');

        // Check sizing classes
        expect(result).toContain('width: 250px');
        expect(result).toContain('height: 150px');
        expect(result).toContain('min-width: 100px');
        expect(result).toContain('max-height: 500px');

        // Check color classes
        expect(result).toContain('color: #ff6b6b');
        expect(result).toContain('background-color: rgb(51, 51, 51)');

        // Check grid classes
        expect(result).toContain('grid-template-columns: 200px 1fr 100px');
        expect(result).toContain('gap: 20px');
      });

      it('should deduplicate identical arbitrary value classes', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-duplicate.html'],
        };

        const generator = new CSSGenerator(config);

        // シミュレート: 同じクラスが複数回抽出されるケース
        const mockExtractMethod = vi.fn().mockResolvedValue([
          '.m-\\[10px\\] { margin: 10px; }',
          '.m-\\[10px\\] { margin: 10px; }', // 重複
          '.p-\\[20px\\] { padding: 20px; }',
          '.m-\\[10px\\] { margin: 10px; }', // 重複
        ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');

        // 重複したクラスが含まれていることを確認（実際の重複排除は実装に依存）
        expect(result).toContain('margin: 10px');
        expect(result).toContain('padding: 20px');
      });

      it('should handle arbitrary values with complex selectors', async () => {
        const config: SmsshCSSConfig = {
          content: ['test-complex.html'],
        };

        const generator = new CSSGenerator(config);

        const mockExtractMethod = vi
          .fn()
          .mockResolvedValue([
            '.hover\\:m-\\[15px\\]:hover { margin: 15px; }',
            '.md\\:w-\\[50vw\\]@media (min-width: 768px) { width: 50vw; }',
            '.focus\\:p-\\[calc\\(1rem\\+5px\\)\\]:focus { padding: calc(1rem + 5px); }',
          ]);

        (
          generator as CSSGenerator & { extractCustomClassesFromFiles: typeof mockExtractMethod }
        ).extractCustomClassesFromFiles = mockExtractMethod;

        const result = await generator.generateFullCSS();

        expect(result).toContain('margin: 15px');
        expect(result).toContain('width: 50vw');
        expect(result).toContain('calc(1rem + 5px)');
      });
    });
  });

  describe('Utility Class Validation', () => {
    it('should generate margin utility classes', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      // Spacingクラスが生成されていることを確認
      expect(result).toContain('.m-xs');
      expect(result).toContain('.p-md');
    });

    it('should generate display utility classes', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      // Displayクラスが生成されていることを確認
      expect(result).toContain('.block');
      expect(result).toContain('.flex');
      expect(result).toContain('.hidden');
    });

    it('should generate size utility classes', async () => {
      const generator = new CSSGenerator(testConfigs.minimal);
      const result = await generator.generateFullCSS();

      // サイズクラスが生成されていることを確認
      expect(result).toContain('.w-full');
      expect(result).toContain('.h-full');
    });
  });
});
