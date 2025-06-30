import { describe, it, expect, beforeEach } from 'vitest';
import { generateCSS, generatePurgeReport, init } from '../index';
import { setupDefaultMocks, testConfigs } from './setup';
import type { SmsshCSSConfig } from '../core/types';

describe('SmsshCSS Main API', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('generateCSS (async)', () => {
    it('should generate CSS with minimal configuration', async () => {
      const result = await generateCSS(testConfigs.minimal);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // 基本的なCSSクラスが含まれていることを確認
      expect(result).toMatch(/\.[\w-]+\s*\{[^}]*\}/);
    });

    it('should generate CSS with apply configuration', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
        apply: {
          'btn-primary': 'p-md bg-blue-500 text-white',
        },
      };

      const result = await generateCSS(config);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // Apply関連のCSSが含まれていることを確認
      expect(result).toContain('.btn-primary');
    });

    it('should generate CSS with purging configuration', async () => {
      const result = await generateCSS(testConfigs.withPurge);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should generate CSS with full configuration', async () => {
      const result = await generateCSS(testConfigs.full);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // フル設定でのCSS生成を確認（基本的なチェックのみ）
    });
  });

  describe('generatePurgeReport', () => {
    it('should generate purge report when purging is enabled', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.{html,tsx}'],
        purge: {
          enabled: true,
          content: ['src/**/*.{html,tsx}'],
        },
      };

      const report = await generatePurgeReport(config);

      // パージが有効な場合はレポートが生成される
      expect(report).toBeTruthy();
      if (report) {
        expect(report.totalClasses).toBeGreaterThanOrEqual(0);
        expect(report.usedClasses).toBeGreaterThanOrEqual(0);
        expect(report.purgedClasses).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return null when purging is disabled', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
        purge: {
          enabled: false,
        },
      };

      const report = await generatePurgeReport(config);

      // パージが無効な場合はnullが返される
      expect(report).toBeNull();
    });

    it('should return null when purge config is not provided', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
      };

      const report = await generatePurgeReport(config);

      // パージ設定がない場合はnullが返される
      expect(report).toBeNull();
    });
  });

  describe('init (async convenience function)', () => {
    it('should initialize with default configuration', async () => {
      const result = await init();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should initialize with custom configuration', async () => {
      const result = await init(testConfigs.minimal);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should be equivalent to generateCSS', async () => {
      const initResult = await init(testConfigs.minimal);
      const generateResult = await generateCSS(testConfigs.minimal);

      expect(initResult).toBe(generateResult);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', async () => {
      const config: SmsshCSSConfig = {
        content: ['invalid/**/*.pattern'],
      };

      expect(async () => await generateCSS(config)).not.toThrow();
      const result = await generateCSS(config);
      expect(result).toBeTruthy();
    });

    it('should handle empty content array', async () => {
      const config: SmsshCSSConfig = {
        content: [],
      };

      // 空のコンテンツ配列は設定検証でエラーになることを確認
      await expect(generateCSS(config)).rejects.toThrow(
        /Content array must contain at least one pattern/
      );
    });

    it('should handle malformed apply configuration', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
        apply: {
          'invalid-class': 'nonexistent-utility',
        },
      };

      expect(async () => await generateCSS(config)).not.toThrow();
      const result = await generateCSS(config);
      expect(result).toBeTruthy();
    });
  });

  describe('Type Safety', () => {
    it('should accept valid configuration types', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.{html,js,tsx}'],
        includeResetCSS: true,
        includeBaseCSS: false,
        apply: {
          'test-class': 'p-md m-sm',
        },
        theme: {
          spacing: {
            'custom-lg': '5rem',
          },
        },
        purge: {
          enabled: true,
          content: ['src/**/*.html'],
          safelist: ['safe-class'],
          blocklist: ['blocked-class'],
        },
      };

      const result = await generateCSS(config);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Performance', () => {
    it('should generate CSS within reasonable time (async)', async () => {
      const startTime = Date.now();

      await generateCSS(testConfigs.full);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 2秒以内で完了することを確認（非同期なので若干余裕を持たせる）
      expect(duration).toBeLessThan(2000);
    });

    it('should handle large configurations efficiently', async () => {
      const largeConfig: SmsshCSSConfig = {
        content: Array.from({ length: 50 }, (_, i) => `src/component-${i}/**/*.html`),
        apply: Object.fromEntries(
          Array.from({ length: 20 }, (_, i) => [`class-${i}`, 'p-md m-sm w-full'])
        ),
      };

      const startTime = Date.now();
      const result = await generateCSS(largeConfig);
      const endTime = Date.now();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');

      // 大規模な設定でも合理的な時間で処理されることを確認
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });
});
