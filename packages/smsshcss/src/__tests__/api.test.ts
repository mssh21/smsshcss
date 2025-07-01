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

      // Verify that basic CSS classes are included
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

      // Verify that Apply-related CSS is included
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

      // Verify CSS generation with full configuration (basic check only)
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

      // Report is generated when purging is enabled
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

      // Returns null when purging is disabled
      expect(report).toBeNull();
    });

    it('should return null when purge config is not provided', async () => {
      const config: SmsshCSSConfig = {
        content: ['src/**/*.html'],
      };

      const report = await generatePurgeReport(config);

      // Returns null when purge config is not provided
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

      // Verify that empty content array causes error in configuration validation
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

      // Verify completion within 2 seconds (allow some margin for async operations)
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

      // Verify that large configurations are processed in reasonable time
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });
});
