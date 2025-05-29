import { describe, it, expect, beforeEach } from 'vitest';
import { generateCSS, generateCSSSync, generatePurgeReport, init, initSync } from '../index';
import { setupDefaultMocks, testConfigs } from './setup';

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
    });

    it('should generate CSS with purging enabled', async () => {
      const result = await generateCSS(testConfigs.withPurge);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should generate CSS with custom theme', async () => {
      const result = await generateCSS(testConfigs.withTheme);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should generate CSS with full configuration', async () => {
      const result = await generateCSS(testConfigs.full);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('generateCSSSync (sync)', () => {
    it('should generate CSS synchronously with minimal config', () => {
      const result = generateCSSSync(testConfigs.minimal);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should generate CSS synchronously with full config', () => {
      const result = generateCSSSync(testConfigs.full);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should be consistent with async version', async () => {
      const syncResult = generateCSSSync(testConfigs.minimal);
      const asyncResult = await generateCSS(testConfigs.minimal);

      // 同期版と非同期版で同じ結果が得られることを確認
      expect(syncResult).toBe(asyncResult);
    });
  });

  describe('generatePurgeReport', () => {
    it('should generate purge report when purging is enabled', async () => {
      const report = await generatePurgeReport(testConfigs.withPurge);

      expect(report).toBeTruthy();
      expect(report!.totalClasses).toBeGreaterThanOrEqual(0);
      expect(report!.usedClasses).toBeGreaterThanOrEqual(0);
      expect(report!.buildTime).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(report!.fileAnalysis)).toBe(true);
    });

    it('should return null when purging is disabled', async () => {
      const report = await generatePurgeReport(testConfigs.minimal);

      expect(report).toBeNull();
    });

    it('should include file analysis in report', async () => {
      const report = await generatePurgeReport(testConfigs.withPurge);

      if (report) {
        expect(report.fileAnalysis).toBeTruthy();
        expect(Array.isArray(report.fileAnalysis)).toBe(true);

        if (report.fileAnalysis.length > 0) {
          const fileAnalysis = report.fileAnalysis[0];
          expect(fileAnalysis).toHaveProperty('file');
          expect(fileAnalysis).toHaveProperty('classesFound');
          expect(fileAnalysis).toHaveProperty('size');
          expect(Array.isArray(fileAnalysis.classesFound)).toBe(true);
        }
      }
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

  describe('initSync (sync convenience function)', () => {
    it('should initialize synchronously with default configuration', () => {
      const result = initSync();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should initialize synchronously with custom configuration', () => {
      const result = initSync(testConfigs.minimal);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should be equivalent to generateCSSSync', () => {
      const initResult = initSync(testConfigs.minimal);
      const generateResult = generateCSSSync(testConfigs.minimal);

      expect(initResult).toBe(generateResult);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configurations gracefully', async () => {
      const invalidConfig = {
        content: null as unknown,
      };

      await expect(generateCSS(invalidConfig)).resolves.toBeTruthy();
    });

    it('should handle empty content arrays', async () => {
      const emptyConfig = {
        content: [],
      };

      const result = await generateCSS(emptyConfig);
      expect(result).toBeTruthy();
    });

    it('should handle missing configuration properties', async () => {
      const partialConfig = {
        content: ['src/**/*.html'],
        // 他の設定は省略
      };

      const result = await generateCSS(partialConfig);
      expect(result).toBeTruthy();
    });
  });

  describe('Type Safety', () => {
    it('should accept valid SmsshCSSConfig', async () => {
      const validConfig = {
        content: ['src/**/*.html'],
        includeResetCSS: true,
        includeBaseCSS: true,
        purge: {
          enabled: true,
          content: ['src/**/*.html'],
          safelist: ['safe-class'],
          blocklist: ['blocked-class'],
        },
        theme: {
          spacing: {
            custom: '2rem',
          },
          display: {
            'custom-flex': 'flex',
          },
          flexbox: {
            'custom-direction': 'column',
          },
        },
      };

      const result = await generateCSS(validConfig);
      expect(result).toBeTruthy();
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

    it('should generate CSS within reasonable time (sync)', () => {
      const startTime = Date.now();

      generateCSSSync(testConfigs.full);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 1秒以内で完了することを確認
      expect(duration).toBeLessThan(1000);
    });
  });
});
