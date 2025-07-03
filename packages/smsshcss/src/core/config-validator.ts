import { SmsshCSSConfig } from './types';
import { z } from 'zod';

/**
 * Configuration validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

/**
 * Validation error
 */
export interface ValidationError {
  type: 'error';
  code: string;
  message: string;
  path?: string;
  fix?: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: 'warning';
  code: string;
  message: string;
  path?: string;
  suggestion?: string;
}

/**
 * Configuration file version management
 */
export interface ConfigVersionInfo {
  version: string;
  compatibleVersions: string[];
  migrationRequired: boolean;
  migrationGuide?: string;
}

/**
 * SmsshCSS configuration Zod schema
 */
const SmsshCSSConfigSchema = z
  .object({
    // Version information (newly added)
    version: z.string().optional().default('2.3.0'),

    // Required items
    content: z.array(z.string()).min(1, 'Content array must contain at least one pattern'),

    // Optional items
    includeResetCSS: z.boolean().optional().default(true),
    includeBaseCSS: z.boolean().optional().default(true),

    // Safelist
    safelist: z
      .array(z.union([z.string(), z.instanceof(RegExp)]))
      .optional()
      .default([]),

    // Apply configuration
    apply: z.record(z.string(), z.string()).optional(),

    // Purge configuration
    purge: z
      .object({
        enabled: z.boolean().optional().default(false),
        content: z.array(z.string()).optional(),
        safelist: z
          .array(z.union([z.string(), z.instanceof(RegExp)]))
          .optional()
          .default([]),
        blocklist: z
          .array(z.union([z.string(), z.instanceof(RegExp)]))
          .optional()
          .default([]),
        keyframes: z.boolean().optional().default(true),
        fontFace: z.boolean().optional().default(true),
        variables: z.boolean().optional().default(true),
        extractors: z
          .array(
            z.object({
              extensions: z.array(z.string()),
              extractor: z.function().args(z.string()).returns(z.array(z.string())),
            })
          )
          .optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Content is required when purge is enabled
      if (data.purge?.enabled === true) {
        return data.purge.content && data.purge.content.length > 0;
      }
      return true;
    },
    {
      message: 'purge.content is required when purge is enabled',
      path: ['purge', 'content'],
    }
  );

/**
 * Check compatibility with supported versions
 */
export function checkVersionCompatibility(configVersion?: string): ConfigVersionInfo {
  const currentVersion = '2.3.0';
  const supportedVersions = ['2.0.0', '2.1.0', '2.2.0', '2.3.0'];
  const version = configVersion || currentVersion;

  const isCompatible = supportedVersions.includes(version);
  const isOlder = version < currentVersion;

  return {
    version,
    compatibleVersions: supportedVersions,
    migrationRequired: !isCompatible || isOlder,
    migrationGuide: !isCompatible ? 'https://smsshcss.com/docs/migration' : undefined,
  };
}

/**
 * Check SmsshCSSConfig validity using Zod
 */
export function validateConfig(config: SmsshCSSConfig): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];

  // Version compatibility check
  const versionInfo = checkVersionCompatibility(
    (config as Record<string, unknown>).version as string | undefined
  );
  if (versionInfo.migrationRequired) {
    if (versionInfo.version !== '2.3.0') {
      warnings.push({
        type: 'warning',
        code: 'VERSION_MISMATCH',
        message: `Configuration version ${versionInfo.version} is outdated. Current version: 2.3.0`,
        path: 'version',
        suggestion: versionInfo.migrationGuide
          ? `See migration guide: ${versionInfo.migrationGuide}`
          : 'Consider updating your configuration',
      });
    }
  }

  try {
    // Validate with Zod schema
    const result = SmsshCSSConfigSchema.parse(config);

    // Additional custom validation
    validateAdvancedRules(result, warnings, suggestions);
  } catch (zodError) {
    if (zodError instanceof z.ZodError) {
      // Convert Zod errors
      zodError.errors.forEach((error) => {
        errors.push({
          type: 'error',
          code: error.code.toUpperCase(),
          message: error.message,
          path: error.path.join('.'),
          fix: generateFixSuggestion(error),
        });
      });
    } else {
      errors.push({
        type: 'error',
        code: 'UNKNOWN_ERROR',
        message: 'An unknown validation error occurred',
        fix: 'Check your configuration syntax',
      });
    }
  }

  // Basic best practices check
  validateBestPractices(config, warnings, suggestions);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Advanced validation rules
 */
function validateAdvancedRules(
  config: z.infer<typeof SmsshCSSConfigSchema>,
  warnings: ValidationWarning[],
  _suggestions: string[]
): void {
  // Content pattern validity check
  config.content.forEach((pattern, index) => {
    if (!pattern.includes('*') && !pattern.includes('.')) {
      warnings.push({
        type: 'warning',
        code: 'SUSPICIOUS_PATTERN',
        message: `content[${index}] doesn't look like a file pattern`,
        path: `content[${index}]`,
        suggestion: 'Consider using glob patterns like "src/**/*.{html,js,ts}"',
      });
    }

    // Performance warning
    if (pattern === '**/*' || pattern === '**/*.*') {
      warnings.push({
        type: 'warning',
        code: 'PERFORMANCE_WARNING',
        message: `content[${index}] is too broad and may impact performance`,
        path: `content[${index}]`,
        suggestion: 'Use more specific patterns to improve performance',
      });
    }
  });

  // Detailed Apply configuration check
  if (config.apply) {
    Object.entries(config.apply).forEach(([key, value]) => {
      if (value.trim() === '') {
        warnings.push({
          type: 'warning',
          code: 'EMPTY_APPLY_VALUE',
          message: `apply.${key} is empty`,
          path: `apply.${key}`,
        });
      }

      // Circular reference check
      if (value.includes(`@apply ${key}`)) {
        warnings.push({
          type: 'warning',
          code: 'CIRCULAR_APPLY',
          message: `apply.${key} contains circular reference`,
          path: `apply.${key}`,
          suggestion: 'Remove circular @apply references',
        });
      }
    });
  }
}

/**
 * ベストプラクティスのバリデーション
 */
function validateBestPractices(
  config: SmsshCSSConfig,
  warnings: ValidationWarning[],
  suggestions: string[]
): void {
  // 開発環境での推奨設定
  if (process.env.NODE_ENV === 'development') {
    if (config.purge?.enabled === true) {
      suggestions.push('Consider disabling purge in development for faster builds');
    }
  }

  // 本番環境での推奨設定
  if (process.env.NODE_ENV === 'production') {
    if (!config.purge?.enabled) {
      suggestions.push('Enable purging in production to reduce CSS bundle size');
    }
  }

  // セーフリストの妥当性
  if (config.safelist && config.safelist.length > 100) {
    warnings.push({
      type: 'warning',
      code: 'LARGE_SAFELIST',
      message: 'Large safelist may impact purging effectiveness',
      path: 'safelist',
      suggestion: 'Consider using more specific patterns or regular expressions',
    });
  }
}

/**
 * Zodエラーから修正提案を生成
 */
function generateFixSuggestion(error: z.ZodIssue): string {
  switch (error.code) {
    case 'invalid_type':
      return `Expected ${error.expected}, received ${error.received}`;
    case 'too_small':
      return `Must contain at least ${error.minimum} items`;
    case 'invalid_string':
      return 'Must be a valid string';
    default:
      return 'Check the configuration format';
  }
}

/**
 * バリデーション結果を分かりやすく表示
 */
export function formatValidationResult(result: ValidationResult): string {
  let output = '';

  if (result.errors.length > 0) {
    output += '❌ Configuration Errors:\n';
    result.errors.forEach((error, index) => {
      output += `  ${index + 1}. [${error.code}] ${error.message}`;
      if (error.path) output += ` (at: ${error.path})`;
      if (error.fix) output += `\n     💡 Fix: ${error.fix}`;
      output += '\n';
    });
    output += '\n';
  }

  if (result.warnings.length > 0) {
    output += '⚠️  Configuration Warnings:\n';
    result.warnings.forEach((warning, index) => {
      output += `  ${index + 1}. [${warning.code}] ${warning.message}`;
      if (warning.path) output += ` (at: ${warning.path})`;
      if (warning.suggestion) output += `\n     💡 Suggestion: ${warning.suggestion}`;
      output += '\n';
    });
    output += '\n';
  }

  if (result.suggestions.length > 0) {
    output += '💡 Suggestions:\n';
    result.suggestions.forEach((suggestion, index) => {
      output += `  ${index + 1}. ${suggestion}\n`;
    });
    output += '\n';
  }

  return output.trim();
}

/**
 * 開発モード用の詳細バリデーション
 */
export function validateConfigDetailed(config: SmsshCSSConfig): void {
  const result = validateConfig(config);

  if (!result.isValid) {
    const message = formatValidationResult(result);
    throw new Error(`SmsshCSS Configuration Validation Failed:\n\n${message}`);
  }
}

/**
 * 設定ファイルの移行支援
 */
export function migrateConfig(
  config: Record<string, unknown>,
  targetVersion: string = '2.3.0'
): SmsshCSSConfig {
  const migrated = { ...config };

  // バージョン情報の追加（存在しない場合）
  if (!migrated.version) {
    migrated.version = targetVersion;
  }

  // 2.0.x から 2.1.x への移行
  if (migrated.version.startsWith('2.0')) {
    // 古いプロパティ名の変換
    if (migrated.purgeEnabled !== undefined) {
      migrated.purge = { enabled: migrated.purgeEnabled };
      delete migrated.purgeEnabled;
    }
  }

  // 2.1.x から 2.2.x への移行
  if (migrated.version.startsWith('2.1')) {
    // apply設定の正規化
    if (migrated.components) {
      migrated.apply = migrated.components;
      delete migrated.components;
    }
  }

  // 最新バージョンに更新
  migrated.version = targetVersion;

  return migrated as SmsshCSSConfig;
}
