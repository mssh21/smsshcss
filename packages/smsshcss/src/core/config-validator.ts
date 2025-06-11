import { SmsshCSSConfig, SizeConfig } from './types';

/**
 * 設定バリデーションの結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

/**
 * バリデーションエラー
 */
export interface ValidationError {
  type: 'error';
  code: string;
  message: string;
  path?: string;
  fix?: string;
}

/**
 * バリデーション警告
 */
export interface ValidationWarning {
  type: 'warning';
  code: string;
  message: string;
  path?: string;
  suggestion?: string;
}

/**
 * SmsshCSSConfig の妥当性をチェックする
 */
export function validateConfig(config: SmsshCSSConfig): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];

  // 基本的な設定チェック
  validateBasicConfig(config, errors, warnings);

  // テーマ設定のチェック
  if (config.theme) {
    validateThemeConfig(config.theme, errors, warnings);
  }

  // パージ設定のチェック
  if (config.purge) {
    validatePurgeConfig(config.purge, errors, warnings);
  }

  // サジェスションの生成
  generateSuggestions(config, suggestions);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * 基本設定のバリデーション
 */
function validateBasicConfig(
  config: SmsshCSSConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // content フィールドのチェック
  if (!config.content || !Array.isArray(config.content)) {
    errors.push({
      type: 'error',
      code: 'MISSING_CONTENT',
      message: 'content field is required and must be an array',
      path: 'content',
      fix: 'Add content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"]',
    });
  } else if (config.content.length === 0) {
    warnings.push({
      type: 'warning',
      code: 'EMPTY_CONTENT',
      message: 'content array is empty - no CSS will be generated',
      path: 'content',
      suggestion: 'Add file patterns to scan for CSS classes',
    });
  } else {
    // ファイルパターンの妥当性チェック
    config.content.forEach((pattern, index) => {
      if (typeof pattern !== 'string') {
        errors.push({
          type: 'error',
          code: 'INVALID_CONTENT_PATTERN',
          message: `content[${index}] must be a string`,
          path: `content[${index}]`,
        });
      } else if (!pattern.includes('*') && !pattern.includes('.')) {
        warnings.push({
          type: 'warning',
          code: 'SUSPICIOUS_PATTERN',
          message: `content[${index}] doesn't look like a file pattern`,
          path: `content[${index}]`,
          suggestion: 'Consider using glob patterns like "src/**/*.{html,js,ts}"',
        });
      }
    });
  }

  // safelist のチェック
  if (config.safelist && !Array.isArray(config.safelist)) {
    errors.push({
      type: 'error',
      code: 'INVALID_SAFELIST',
      message: 'safelist must be an array of strings',
      path: 'safelist',
    });
  }

  // Boolean フィールドのチェック
  ['includeResetCSS', 'includeBaseCSS'].forEach((field) => {
    const value = (config as Record<string, unknown>)[field];
    if (value !== undefined && typeof value !== 'boolean') {
      errors.push({
        type: 'error',
        code: 'INVALID_BOOLEAN',
        message: `${field} must be a boolean`,
        path: field,
      });
    }
  });
}

/**
 * テーマ設定のバリデーション
 */
function validateThemeConfig(
  theme: NonNullable<SmsshCSSConfig['theme']>,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // SizeConfig の妥当性チェック
  const sizeConfigFields = ['spacing', 'width', 'height'] as const;

  sizeConfigFields.forEach((field) => {
    const config = theme[field] as SizeConfig | undefined;
    if (config) {
      validateSizeConfig(config, `theme.${field}`, errors, warnings);
    }
  });

  // Display config のチェック
  if (theme.display) {
    Object.entries(theme.display).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        errors.push({
          type: 'error',
          code: 'INVALID_DISPLAY_VALUE',
          message: `theme.display.${key} must be a string`,
          path: `theme.display.${key}`,
        });
      }
    });
  }
}

/**
 * SizeConfig の妥当性チェック
 */
function validateSizeConfig(
  config: SizeConfig,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  Object.entries(config).forEach(([key, value]) => {
    if (value === undefined) {
      warnings.push({
        type: 'warning',
        code: 'UNDEFINED_SIZE_VALUE',
        message: `${path}.${key} is undefined`,
        path: `${path}.${key}`,
        suggestion: 'Remove undefined values or set to valid CSS value',
      });
    } else if (typeof value !== 'string') {
      errors.push({
        type: 'error',
        code: 'INVALID_SIZE_VALUE',
        message: `${path}.${key} must be a string`,
        path: `${path}.${key}`,
      });
    } else if (value.trim() === '') {
      warnings.push({
        type: 'warning',
        code: 'EMPTY_SIZE_VALUE',
        message: `${path}.${key} is empty`,
        path: `${path}.${key}`,
      });
    }
  });
}

/**
 * パージ設定のバリデーション
 */
function validatePurgeConfig(
  purge: NonNullable<SmsshCSSConfig['purge']>,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // パージが明示的に有効な場合のみcontentをチェック
  if (purge.enabled === true) {
    if (!purge.content || !Array.isArray(purge.content)) {
      errors.push({
        type: 'error',
        code: 'MISSING_PURGE_CONTENT',
        message: 'purge.content is required when purge is enabled',
        path: 'purge.content',
        fix: 'Set purge.content to file patterns array',
      });
    } else if (purge.content.length === 0) {
      warnings.push({
        type: 'warning',
        code: 'EMPTY_PURGE_CONTENT',
        message: 'purge.content is empty',
        path: 'purge.content',
      });
    }
  }

  // safelist と blocklist の型チェック
  ['safelist', 'blocklist'].forEach((field) => {
    const list = (purge as Record<string, unknown>)[field];
    if (list && !Array.isArray(list)) {
      errors.push({
        type: 'error',
        code: 'INVALID_LIST_TYPE',
        message: `purge.${field} must be an array`,
        path: `purge.${field}`,
      });
    } else if (list) {
      (list as unknown[]).forEach((item: unknown, index: number) => {
        if (typeof item !== 'string' && !(item instanceof RegExp)) {
          errors.push({
            type: 'error',
            code: 'INVALID_LIST_ITEM',
            message: `purge.${field}[${index}] must be a string or RegExp`,
            path: `purge.${field}[${index}]`,
          });
        }
      });
    }
  });
}

/**
 * 設定改善の提案を生成
 */
function generateSuggestions(config: SmsshCSSConfig, suggestions: string[]): void {
  // パフォーマンス改善の提案
  if (!config.purge?.enabled) {
    suggestions.push('Enable purge for smaller CSS bundle size: set purge.enabled to true');
  }

  // 設定の最適化提案
  if (config.includeResetCSS === undefined) {
    suggestions.push('Consider explicitly setting includeResetCSS to true or false');
  }

  if (config.includeBaseCSS === undefined) {
    suggestions.push('Consider explicitly setting includeBaseCSS to true or false');
  }

  // テーマカスタマイズの提案
  if (!config.theme || Object.keys(config.theme).length === 0) {
    suggestions.push('Consider customizing the theme to match your design system');
  }

  // 開発体験の改善提案
  if (
    config.content &&
    Array.isArray(config.content) &&
    config.content.some((pattern) => pattern.includes('node_modules'))
  ) {
    suggestions.push('Avoid scanning node_modules for better performance');
  }
}

/**
 * バリデーション結果を分かりやすく表示
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.isValid) {
    lines.push('✅ Configuration is valid!');
  } else {
    lines.push('❌ Configuration has errors:');
  }

  // エラーの表示
  if (result.errors.length > 0) {
    lines.push('\n🚨 Errors:');
    result.errors.forEach((error) => {
      lines.push(`  • ${error.message}`);
      if (error.path) lines.push(`    Path: ${error.path}`);
      if (error.fix) lines.push(`    Fix: ${error.fix}`);
    });
  }

  // 警告の表示
  if (result.warnings.length > 0) {
    lines.push('\n⚠️  Warnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  • ${warning.message}`);
      if (warning.path) lines.push(`    Path: ${warning.path}`);
      if (warning.suggestion) lines.push(`    Suggestion: ${warning.suggestion}`);
    });
  }

  // 提案の表示
  if (result.suggestions.length > 0) {
    lines.push('\n💡 Suggestions:');
    result.suggestions.forEach((suggestion) => {
      lines.push(`  • ${suggestion}`);
    });
  }

  return lines.join('\n');
}

/**
 * 開発モード用の詳細バリデーション
 */
export function validateConfigDetailed(config: SmsshCSSConfig): void {
  const result = validateConfig(config);
  const formatted = formatValidationResult(result);

  console.log('\n📋 SmsshCSS Configuration Validation:');
  console.log(formatted);

  if (!result.isValid) {
    console.log('\n❌ Fix the errors above before proceeding.');
    process.exit(1);
  }
}
