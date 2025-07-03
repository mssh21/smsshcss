import {
  ArbitraryValue,
  ArbitraryValueValidationResult,
  ArbitraryValueConfig,
  defaultArbitraryValueConfig,
  TypedValidationError,
  ValidationErrorType,
} from '../core/types';
import { globalCache, PerformanceCache } from './performance-cache';

/**
 * Type-safe arbitrary value validator with caching functionality
 */
export class ArbitraryValueValidator {
  private config: ArbitraryValueConfig;
  private cache: PerformanceCache;

  constructor(config: Partial<ArbitraryValueConfig> = {}, cache?: PerformanceCache) {
    this.config = { ...defaultArbitraryValueConfig, ...config };
    this.cache = cache || globalCache;
  }

  /**
   * Validate and sanitize arbitrary values (with caching functionality)
   */
  validate(value: ArbitraryValue, property?: string): ArbitraryValueValidationResult {
    // Generate cache key
    const cacheKey = this.generateCacheKey(value, property);

    // Get result from cache
    const cachedResult = this.cache.getValidationResult(cacheKey);
    if (cachedResult) {
      if (this.config.debug) {
        console.log(`[ArbitraryValueValidator] Cache hit for: ${value}`);
      }
      return cachedResult;
    }

    if (this.config.debug) {
      console.log(`[ArbitraryValueValidator] Cache miss for: ${value}`);
    }

    // If not in cache, perform new validation
    const result = this.performValidation(value, property);

    // Save result to cache
    this.cache.setValidationResult(cacheKey, result);

    return result;
  }

  /**
   * Actual validation processing
   */
  private performValidation(
    value: ArbitraryValue,
    _property?: string
  ): ArbitraryValueValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    try {
      // Basic validation
      const basicValidation = this.performBasicValidation(value);
      if (!basicValidation.isValid) {
        errors.push(...basicValidation.errors);
        return { isValid: false, errors, sanitizedValue: value, warnings };
      }

      // Security check
      if (this.config.enableSecurityCheck) {
        const securityResult = this.performSecurityCheck(value);
        if (!securityResult.isValid) {
          errors.push(...securityResult.errors);
          return { isValid: false, errors, sanitizedValue: value, warnings };
        }
      }

      // CSS function validation
      const functionValidation = this.validateCSSFunctions(value);
      if (!functionValidation.isValid) {
        errors.push(...functionValidation.errors);
      }
      warnings.push(...functionValidation.warnings);

      // Unit validation
      const unitValidation = this.validateUnits(value);
      warnings.push(...unitValidation.warnings);

      // Value sanitization
      sanitizedValue = this.sanitizeValue(value);

      // Debug log
      if (this.config.debug) {
        console.log(`[ArbitraryValueValidator] Validated: ${value} -> ${sanitizedValue}`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue,
        warnings,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      return {
        isValid: false,
        errors: [`Validation failed: ${errorMessage}`],
        sanitizedValue: value,
        warnings,
      };
    }
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(value: string, property?: string): string {
    const configHash = this.generateConfigHash();
    return `${value}:${property || 'default'}:${configHash}`;
  }

  /**
   * Generate configuration hash
   */
  private generateConfigHash(): string {
    const configStr = JSON.stringify({
      allowedFunctions: this.config.allowedFunctions.sort(),
      allowedUnits: this.config.allowedUnits.sort(),
      enableSecurityCheck: this.config.enableSecurityCheck,
      maxLength: this.config.maxLength,
    });

    // Simple hash generation
    let hash = 0;
    for (let i = 0; i < configStr.length; i++) {
      const char = configStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Basic validation
   */
  private performBasicValidation(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Empty value check
    if (!value || value.trim() === '') {
      errors.push('Value cannot be empty');
      return { isValid: false, errors };
    }

    // Length check
    if (value.length > this.config.maxLength) {
      errors.push(`Value exceeds maximum length of ${this.config.maxLength} characters`);
      return { isValid: false, errors };
    }

    // Basic character check
    if (value.includes('\n') || value.includes('\r')) {
      errors.push('Value cannot contain line breaks');
      return { isValid: false, errors };
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Security check
   */
  private performSecurityCheck(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Detect dangerous patterns
    const dangerousPatterns = [
      {
        pattern: /javascript:/i,
        message: 'JavaScript URLs are not allowed',
      },
      {
        pattern: /data:/i,
        message: 'Data URLs are not allowed',
      },
      {
        pattern: /vbscript:/i,
        message: 'VBScript URLs are not allowed',
      },
      {
        pattern: /<script/i,
        message: 'Script tags are not allowed',
      },
      {
        pattern: /on\w+\s*=/i,
        message: 'Event handlers are not allowed',
      },
      {
        pattern: /expression\s*\(/i,
        message: 'CSS expressions are not allowed',
      },
      {
        pattern: /[@\\]/,
        message: 'Special characters @ and \\ are not allowed',
      },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (pattern.test(value)) {
        errors.push(message);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * CSS function validation
   */
  private validateCSSFunctions(value: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Detect CSS functions - properly capture function names including hyphens
    const functionPattern = /([a-zA-Z][\w-]*)\s*\(/g;
    const matches = [...value.matchAll(functionPattern)];

    for (const match of matches) {
      const functionName = match[1];
      if (!this.config.allowedFunctions.includes(functionName)) {
        warnings.push(`CSS function '${functionName}' is not in the allowed list`);
      }
    }

    // Parentheses balance check
    const openParens = (value.match(/\(/g) || []).length;
    const closeParens = (value.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      errors.push('Unbalanced parentheses in CSS function');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 単位の検証
   */
  private validateUnits(value: string): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // 数値と単位のパターンを検出
    const unitPattern = /(\d+(?:\.\d+)?)([a-zA-Z%]+)/g;
    const matches = [...value.matchAll(unitPattern)];

    for (const match of matches) {
      const unit = match[2];
      if (!this.config.allowedUnits.includes(unit)) {
        warnings.push(`Unit '${unit}' is not in the allowed list`);
      }
    }

    return { isValid: true, warnings };
  }

  /**
   * 値のサニタイズ
   */
  private sanitizeValue(value: string): string {
    // 余分な空白を除去
    let sanitized = value.trim();

    // 連続する空白を単一の空白に変換
    sanitized = sanitized.replace(/\s+/g, ' ');

    // CSS関数内の空白を適切にフォーマット
    sanitized = this.formatCSSFunctions(sanitized);

    return sanitized;
  }

  /**
   * CSS関数のフォーマット
   */
  private formatCSSFunctions(value: string): string {
    // calc, min, max, clamp関数の空白を適切にフォーマット
    return value.replace(
      /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
      (match, funcName, inner) => {
        // 内部の空白をフォーマット
        const formattedInner = inner
          .replace(/\s*,\s*/g, ', ')
          .replace(/\s*([+\-*/])\s*/g, (match, operator, offset, str) => {
            // マイナス記号が負の値かどうかを判定
            if (operator === '-') {
              const beforeMatch = str.substring(0, offset);
              const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
              const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';

              if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/]/.test(prevChar)) {
                return '-';
              }
            }
            return ` ${operator} `;
          });

        return `${funcName}(${formattedInner})`;
      }
    );
  }

  /**
   * キャッシュをクリア
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * キャッシュ統計を取得
   */
  getCacheStats(): {
    hits: number;
    misses: number;
    evictions: number;
    total: number;
    hitRate: number;
    cacheSize: {
      validation: number;
      cssClass: number;
      contentExtraction: number;
    };
  } {
    return this.cache.getStats();
  }

  /**
   * 型付きエラーの生成
   */
  createTypedError(
    type: ValidationErrorType,
    message: string,
    value: string,
    property?: string,
    suggestion?: string
  ): TypedValidationError {
    return {
      type,
      message,
      value,
      property,
      suggestion,
    };
  }

  /**
   * バリデーション結果のフォーマット
   */
  formatValidationResult(result: ArbitraryValueValidationResult, property?: string): string {
    const lines: string[] = [];

    if (result.isValid) {
      lines.push('✅ Arbitrary value is valid');
    } else {
      lines.push('❌ Arbitrary value validation failed');
    }

    if (property) {
      lines.push(`🏷️  Property: ${property}`);
    }

    if (result.errors.length > 0) {
      lines.push('\n🚨 Errors:');
      result.errors.forEach((error) => {
        lines.push(`  • ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      lines.push('\n⚠️  Warnings:');
      result.warnings.forEach((warning) => {
        lines.push(`  • ${warning}`);
      });
    }

    if (result.sanitizedValue && result.sanitizedValue !== result.sanitizedValue) {
      lines.push(`\n🧹 Sanitized: ${result.sanitizedValue}`);
    }

    return lines.join('\n');
  }
}

/**
 * デフォルトのバリデーターインスタンス（キャッシュ機能付き）
 */
export const defaultValidator = new ArbitraryValueValidator();

/**
 * 簡易バリデーション関数（キャッシュ機能付き）
 */
export function validateArbitraryValue(
  value: ArbitraryValue,
  property?: string,
  config?: Partial<ArbitraryValueConfig>
): ArbitraryValueValidationResult {
  const validator = config ? new ArbitraryValueValidator(config) : defaultValidator;
  return validator.validate(value, property);
}

/**
 * 安全な任意値かどうかをチェック（キャッシュ機能付き）
 */
export function isSafeArbitraryValue(value: ArbitraryValue): boolean {
  const result = defaultValidator.validate(value);
  return result.isValid && result.errors.length === 0;
}

/**
 * バリデーターのキャッシュ統計を表示
 */
export function logValidatorStats(): void {
  const stats = defaultValidator.getCacheStats();
  console.log('📊 Validator Cache Statistics:');
  console.log(`  Hit Rate: ${stats.hitRate}%`);
  console.log(`  Cache Size: ${stats.cacheSize.validation}`);
}
