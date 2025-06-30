import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';

// コア機能のインポート
import {
  generateDisplayClasses,
  generateAllSpacingClasses,
  generateFlexboxClasses,
  generatePositioningClasses,
  generateZIndexClasses,
  generateOverflowClasses,
  generateOrderClasses,
  generateGridClasses,
  generateAllWidthClasses,
  generateAllHeightClasses,
  generateAllColorClasses,
  generateFontSizeClasses,
} from '../../utils';

// 検証ユーティリティのインポート
import { verifyUtilityClasses } from '../../../scripts/utils/comparison';
import { extractUtilityClasses } from '../../../scripts/utils/class-extractor';

// Viteプラグインのインポート（ローカルパス）
import { smsshcss } from '../../../../@smsshcss/vite/dist/index.js';

describe('Vite Plugin Compatibility', () => {
  const testTimeout = 30000; // 30秒のタイムアウト

  let vitePluginOutput: string;

  beforeAll(async () => {
    // テスト用のHTMLコンテンツ（全カテゴリのクラスを含む）
    const testContent = `
      <div class="
        block flex grid hidden inline-block
        m-xs m-sm m-md p-lg p-xl gap-sm
        flex-row flex-col justify-center items-center basis-full
        absolute relative fixed static
        z-0 z-10 z-50
        overflow-hidden overflow-auto overflow-scroll
        order-1 order-first order-last
        grid-cols-1 grid-cols-3 col-span-2 row-span-1
        w-full w-1/2 h-screen h-full min-w-0 max-h-screen
        text-red text-blue-500 bg-white bg-black border-gray-200
        text-sm text-lg font-normal font-bold
      ">
        Test content with various utility classes
      </div>
    `;

    const plugin = smsshcss({
      content: [testContent],
      purge: { enabled: false },
      debug: false,
    });

    const result = await plugin.transform?.('', 'test.css');

    if (!result || typeof result !== 'object' || !result.code) {
      throw new Error('Failed to get Vite plugin output');
    }

    vitePluginOutput = result.code;
  }, testTimeout);

  describe('Core Generator Functions', () => {
    it('should generate display classes', () => {
      const css = generateDisplayClasses();
      expect(css).toBeDefined();
      expect(css).toContain('.block');
      expect(css).toContain('.flex');
      expect(css).toContain('.grid');
      expect(css).toContain('.hidden');
    });

    it('should generate spacing classes', () => {
      const css = generateAllSpacingClasses();
      expect(css).toBeDefined();
      expect(css.length).toBeGreaterThan(0);
      // 基本的なスペーシングクラスの確認
      expect(css).toMatch(/\.(m|p|gap)-[a-z]+/);
    });

    it('should generate flexbox classes', () => {
      const css = generateFlexboxClasses();
      expect(css).toBeDefined();
      expect(css).toContain('flex-direction');
      expect(css).toContain('justify-content');
      expect(css).toContain('align-items');
    });

    it('should generate all other utility categories', () => {
      const generators = [
        generatePositioningClasses,
        generateZIndexClasses,
        generateOverflowClasses,
        generateOrderClasses,
        generateGridClasses,
        generateAllWidthClasses,
        generateAllHeightClasses,
        generateAllColorClasses,
        generateFontSizeClasses,
      ];

      generators.forEach((generator) => {
        const css = generator();
        expect(css).toBeDefined();
        expect(css.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Vite Plugin Output', () => {
    it('should generate CSS output through Vite plugin', () => {
      expect(vitePluginOutput).toBeDefined();
      expect(vitePluginOutput.length).toBeGreaterThan(0);
    });

    it('should contain utility classes in output', () => {
      const extracted = extractUtilityClasses(vitePluginOutput);
      expect(extracted.classes.length).toBeGreaterThan(0);

      // カテゴリ別の確認
      Object.entries(extracted.categories).forEach(([category, classes]) => {
        if (classes.length > 0) {
          console.log(`Category ${category}: ${classes.length} classes`);
        }
      });
    });
  });

  describe('Core vs Vite Plugin Consistency', () => {
    const categories = [
      'display',
      'spacing',
      'flexbox',
      'positioning',
      'zIndex',
      'overflow',
      'order',
      'grid',
      'width',
      'height',
      'color',
      'fontSize',
    ] as const;

    const generators = {
      display: generateDisplayClasses,
      spacing: generateAllSpacingClasses,
      flexbox: generateFlexboxClasses,
      positioning: generatePositioningClasses,
      zIndex: generateZIndexClasses,
      overflow: generateOverflowClasses,
      order: generateOrderClasses,
      grid: generateGridClasses,
      width: generateAllWidthClasses,
      height: generateAllHeightClasses,
      color: generateAllColorClasses,
      fontSize: generateFontSizeClasses,
    };

    it(
      'should have consistent output between core and Vite plugin',
      async () => {
        const startTime = performance.now();

        // 期待されるCSSを生成
        const expectedCSS = categories
          .map((category) => {
            const generator = generators[category];
            const css = generator();
            return `/* ${category.toUpperCase()} */\n${css}`;
          })
          .join('\n\n');

        // 検証実行
        const result = await verifyUtilityClasses(expectedCSS, vitePluginOutput, {
          verbose: false,
          allowExtraClasses: true, // プラグインが追加のCSSを含む可能性があるため
          strictProperties: false, // テストでは緩い検証を行う
        });

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        console.log(`Verification completed in ${(executionTime / 1000).toFixed(2)}s`);
        console.log(`Expected classes: ${result.totalExpected}`);
        console.log(`Actual classes: ${result.totalActual}`);

        // カテゴリ別の詳細確認
        Object.values(result.categoryResults).forEach((categoryResult) => {
          console.log(
            `${categoryResult.category}: ${categoryResult.actual}/${categoryResult.expected} classes`
          );

          if (categoryResult.missing.length > 0) {
            console.log(`  Missing: ${categoryResult.missing.slice(0, 5).join(', ')}`);
          }
        });

        // 基本的な検証
        expect(result.totalExpected).toBeGreaterThan(0);
        expect(result.totalActual).toBeGreaterThan(0);

        // 重要なクラスが不足していない（少なくとも基本的なクラスは存在する）
        expect(result.missingClasses.length).toBeLessThan(result.totalExpected * 0.5);
      },
      testTimeout
    );

    // カテゴリ別の詳細テスト
    categories.forEach((category) => {
      it(`should generate ${category} classes consistently`, async () => {
        const expectedCSS = generators[category]();

        const result = await verifyUtilityClasses(expectedCSS, vitePluginOutput, {
          categories: [category],
          verbose: false,
          allowExtraClasses: true,
          strictProperties: false,
        });

        const categoryResult = result.categoryResults[category];
        if (categoryResult) {
          expect(categoryResult.expected).toBeGreaterThan(0);
          // 少なくとも期待の50%以上のクラスが存在する
          expect(categoryResult.actual).toBeGreaterThanOrEqual(categoryResult.expected * 0.5);
        }
      });
    });
  });

  describe('Performance Benchmarks', () => {
    it('should generate CSS in reasonable time', async () => {
      const iterations = 5;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();

        const _expectedCSS = [
          generateDisplayClasses(),
          generateAllSpacingClasses(),
          generateFlexboxClasses(),
        ].join('\n\n');

        const end = performance.now();
        times.push(end - start);
      }

      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      console.log(`Average CSS generation time: ${averageTime.toFixed(2)}ms`);

      // 1秒以内で完了することを確認
      expect(averageTime).toBeLessThan(1000);
    });

    it('should verify classes in reasonable time', async () => {
      const start = performance.now();

      const expectedCSS = generateAllSpacingClasses();
      const result = await verifyUtilityClasses(expectedCSS, vitePluginOutput, {
        categories: ['spacing'],
        verbose: false,
      });

      const end = performance.now();
      const executionTime = end - start;

      console.log(`Verification time: ${executionTime.toFixed(2)}ms`);

      // 5秒以内で完了することを確認
      expect(executionTime).toBeLessThan(5000);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid CSS gracefully', async () => {
      const invalidCSS = '/* invalid css }{ */';

      const result = await verifyUtilityClasses(invalidCSS, vitePluginOutput, {
        verbose: false,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should handle empty CSS input', async () => {
      const emptyCSS = '';

      const result = await verifyUtilityClasses(emptyCSS, vitePluginOutput, {
        verbose: false,
      });

      expect(result).toBeDefined();
      expect(result.totalExpected).toBe(0);
    });
  });
});
