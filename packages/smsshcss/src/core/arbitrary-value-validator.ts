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
 * 型安全性を向上させた任意値バリデーター（キャッシュ機能付き）
 */
export class ArbitraryValueValidator {
  private config: ArbitraryValueConfig;
  private cache: PerformanceCache;

  constructor(config: Partial<ArbitraryValueConfig> = {}, cache?: PerformanceCache) {
    this.config = { ...defaultArbitraryValueConfig, ...config };
    this.cache = cache || globalCache;
  }

  /**
   * 任意値を検証し、サニタイズする（キャッシュ機能付き）
   */
  validate(value: ArbitraryValue, property?: string): ArbitraryValueValidationResult {
    // キャッシュキーを生成
    const cacheKey = this.generateCacheKey(value, property);

    // キャッシュから結果を取得
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

    // キャッシュにない場合は新しく検証
    const result = this.performValidation(value, property);

    // 結果をキャッシュに保存
    this.cache.setValidationResult(cacheKey, result);

    return result;
  }

  /**
   * 実際のバリデーション処理
   */
  private performValidation(
    value: ArbitraryValue,
    _property?: string
  ): ArbitraryValueValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    try {
      // 基本的なバリデーション
      const basicValidation = this.performBasicValidation(value);
      if (!basicValidation.isValid) {
        errors.push(...basicValidation.errors);
        return { isValid: false, errors, sanitizedValue: value, warnings };
      }

      // セキュリティチェック
      if (this.config.enableSecurityCheck) {
        const securityResult = this.performSecurityCheck(value);
        if (!securityResult.isValid) {
          errors.push(...securityResult.errors);
          return { isValid: false, errors, sanitizedValue: value, warnings };
        }
      }

      // CSS関数の検証
      const functionValidation = this.validateCSSFunctions(value);
      if (!functionValidation.isValid) {
        errors.push(...functionValidation.errors);
      }
      warnings.push(...functionValidation.warnings);

      // 単位の検証
      const unitValidation = this.validateUnits(value);
      warnings.push(...unitValidation.warnings);

      // 値のサニタイズ
      sanitizedValue = this.sanitizeValue(value);

      // デバッグログ
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
   * キャッシュキーを生成
   */
  private generateCacheKey(value: string, property?: string): string {
    const configHash = this.generateConfigHash();
    return `${value}:${property || 'default'}:${configHash}`;
  }

  /**
   * 設定のハッシュを生成
   */
  private generateConfigHash(): string {
    const configStr = JSON.stringify({
      allowedFunctions: this.config.allowedFunctions.sort(),
      allowedUnits: this.config.allowedUnits.sort(),
      enableSecurityCheck: this.config.enableSecurityCheck,
      maxLength: this.config.maxLength,
    });

    // 簡易ハッシュ生成
    let hash = 0;
    for (let i = 0; i < configStr.length; i++) {
      const char = configStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 基本的なバリデーション
   */
  private performBasicValidation(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 空値チェック
    if (!value || value.trim() === '') {
      errors.push('Value cannot be empty');
      return { isValid: false, errors };
    }

    // 長さチェック
    if (value.length > this.config.maxLength) {
      errors.push(`Value exceeds maximum length of ${this.config.maxLength} characters`);
      return { isValid: false, errors };
    }

    // 基本的な文字チェック
    if (value.includes('\n') || value.includes('\r')) {
      errors.push('Value cannot contain line breaks');
      return { isValid: false, errors };
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * セキュリティチェック
   */
  private performSecurityCheck(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 危険なパターンの検出
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
   * CSS関数の検証
   */
  private validateCSSFunctions(value: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // CSS関数を検出 - ハイフンを含む関数名も適切にキャプチャ
    const functionPattern = /([a-zA-Z][\w-]*)\s*\(/g;
    const matches = [...value.matchAll(functionPattern)];

    for (const match of matches) {
      const functionName = match[1];
      if (!this.config.allowedFunctions.includes(functionName)) {
        warnings.push(`CSS function '${functionName}' is not in the allowed list`);
      }
    }

    // 括弧のバランスチェック
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
