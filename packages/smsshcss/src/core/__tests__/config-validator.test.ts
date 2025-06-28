import { describe, it, expect } from 'vitest';
import {
  validateConfig,
  checkVersionCompatibility,
  migrateConfig,
  formatValidationResult,
} from '../config-validator';
import { SmsshCSSConfig } from '../types';

describe('Config Validator', () => {
  describe('validateConfig', () => {
    it('有効な設定を受け入れる', () => {
      const config: SmsshCSSConfig = {
        version: '2.3.0',
        content: ['src/**/*.{html,js,ts}'],
        includeResetCSS: true,
        includeBaseCSS: true,
        safelist: ['btn', 'container'],
      };

      const result = validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('contentが空の場合はエラーを返す', () => {
      const config = {
        content: [],
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TOO_SMALL');
    });

    it('古いバージョンの場合は警告を返す', () => {
      const config = {
        version: '2.0.0',
        content: ['src/**/*.html'],
      } as unknown as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].code).toBe('VERSION_MISMATCH');
    });

    it('パージが有効でcontentがない場合はエラーを返す', () => {
      const config = {
        content: ['src/**/*.html'],
        purge: {
          enabled: true,
        },
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('purge.content is required');
    });

    it('循環参照のあるapply設定で警告を返す', () => {
      const config = {
        content: ['src/**/*.html'],
        apply: {
          btn: '@apply btn text-white',
        },
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.warnings.some((w) => w.code === 'CIRCULAR_APPLY')).toBe(true);
    });

    it('パフォーマンス警告を適切に表示する', () => {
      const config = {
        content: ['**/*'],
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.warnings.some((w) => w.code === 'PERFORMANCE_WARNING')).toBe(true);
    });

    it('大きなセーフリストで警告を返す', () => {
      const config = {
        content: ['src/**/*.html'],
        safelist: Array.from({ length: 150 }, (_, i) => `class-${i}`),
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.warnings.some((w) => w.code === 'LARGE_SAFELIST')).toBe(true);
    });
  });

  describe('checkVersionCompatibility', () => {
    it('現在のバージョンでは互換性がある', () => {
      const result = checkVersionCompatibility('2.3.0');

      expect(result.migrationRequired).toBe(false);
      expect(result.version).toBe('2.3.0');
    });

    it('古いバージョンでは移行が必要', () => {
      const result = checkVersionCompatibility('2.0.0');

      expect(result.migrationRequired).toBe(true);
      expect(result.version).toBe('2.0.0');
    });

    it('サポートされていないバージョンでは移行ガイドを提供', () => {
      const result = checkVersionCompatibility('1.0.0');

      expect(result.migrationRequired).toBe(true);
      expect(result.migrationGuide).toBe('https://smsshcss.com/docs/migration');
    });

    it('バージョンが指定されていない場合はデフォルトを使用', () => {
      const result = checkVersionCompatibility();

      expect(result.version).toBe('2.3.0');
      expect(result.migrationRequired).toBe(false);
    });
  });

  describe('migrateConfig', () => {
    it('バージョン情報を追加する', () => {
      const oldConfig = {
        content: ['src/**/*.html'],
      };

      const result = migrateConfig(oldConfig);

      expect(result.version).toBe('2.3.0');
    });

    it('2.0.xから2.1.xへの移行', () => {
      const oldConfig = {
        version: '2.0.0',
        content: ['src/**/*.html'],
        purgeEnabled: true,
      };

      const result = migrateConfig(oldConfig);

      expect(result.purge?.enabled).toBe(true);
      expect((result as Record<string, unknown>).purgeEnabled).toBeUndefined();
      expect(result.version).toBe('2.3.0');
    });

    it('2.1.xから2.2.xへの移行', () => {
      const oldConfig = {
        version: '2.1.0',
        content: ['src/**/*.html'],
        components: {
          btn: 'px-4 py-2',
        },
      };

      const result = migrateConfig(oldConfig);

      expect(result.apply?.btn).toBe('px-4 py-2');
      expect((result as Record<string, unknown>).components).toBeUndefined();
      expect(result.version).toBe('2.3.0');
    });
  });

  describe('formatValidationResult', () => {
    it('エラーを適切にフォーマットする', () => {
      const result = {
        isValid: false,
        errors: [
          {
            type: 'error' as const,
            code: 'MISSING_CONTENT',
            message: 'content is required',
            path: 'content',
            fix: 'Add content array',
          },
        ],
        warnings: [],
        suggestions: [],
      };

      const formatted = formatValidationResult(result);

      expect(formatted).toContain('❌ Configuration Errors:');
      expect(formatted).toContain('MISSING_CONTENT');
      expect(formatted).toContain('content is required');
      expect(formatted).toContain('💡 Fix: Add content array');
    });

    it('警告と提案を適切にフォーマットする', () => {
      const result = {
        isValid: true,
        errors: [],
        warnings: [
          {
            type: 'warning' as const,
            code: 'VERSION_MISMATCH',
            message: 'Old version detected',
            path: 'version',
            suggestion: 'Update to latest version',
          },
        ],
        suggestions: ['Enable purging for production'],
      };

      const formatted = formatValidationResult(result);

      expect(formatted).toContain('⚠️  Configuration Warnings:');
      expect(formatted).toContain('VERSION_MISMATCH');
      expect(formatted).toContain('💡 Suggestions:');
      expect(formatted).toContain('Enable purging for production');
    });
  });

  describe('Environment-specific validation', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('開発環境でパージが有効な場合は提案を表示', () => {
      process.env.NODE_ENV = 'development';

      const config = {
        content: ['src/**/*.html'],
        purge: { enabled: true, content: ['src/**/*.html'] },
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.suggestions).toContain(
        'Consider disabling purge in development for faster builds'
      );
    });

    it('本番環境でパージが無効な場合は提案を表示', () => {
      process.env.NODE_ENV = 'production';

      const config = {
        content: ['src/**/*.html'],
      } as SmsshCSSConfig;

      const result = validateConfig(config);

      expect(result.suggestions).toContain(
        'Enable purging in production to reduce CSS bundle size'
      );
    });
  });
});
