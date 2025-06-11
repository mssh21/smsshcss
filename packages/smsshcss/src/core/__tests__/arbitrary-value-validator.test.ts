import { describe, it, expect, beforeEach } from 'vitest';
import {
  ArbitraryValueValidator,
  defaultValidator,
  validateArbitraryValue,
  isSafeArbitraryValue,
} from '../arbitrary-value-validator';
import { PerformanceCache } from '../performance-cache';

describe('ArbitraryValueValidator', () => {
  let validator: ArbitraryValueValidator;
  let cache: PerformanceCache;

  beforeEach(() => {
    cache = new PerformanceCache();
    validator = new ArbitraryValueValidator(undefined, cache);
  });

  describe('Basic Validation', () => {
    it('should validate simple values', () => {
      const result = validator.validate('1rem');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedValue).toBe('1rem');
    });

    it('should reject empty values', () => {
      const result = validator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value cannot be empty');
    });

    it('should reject values that are too long', () => {
      const longValue = 'a'.repeat(300);
      const result = validator.validate(longValue);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('exceeds maximum length');
    });

    it('should reject values with line breaks', () => {
      const result = validator.validate('1rem\n2rem');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value cannot contain line breaks');
    });
  });

  describe('Security Validation', () => {
    it('should reject javascript URLs', () => {
      const result = validator.validate('javascript:alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('JavaScript URLs are not allowed');
    });

    it('should reject data URLs', () => {
      const result = validator.validate('data:text/html,<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data URLs are not allowed');
    });

    it('should reject script tags', () => {
      const result = validator.validate('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Script tags are not allowed');
    });

    it('should reject event handlers', () => {
      const result = validator.validate('onclick=alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Event handlers are not allowed');
    });

    it('should reject CSS expressions', () => {
      const result = validator.validate('expression(alert("xss"))');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CSS expressions are not allowed');
    });

    it('should reject dangerous special characters', () => {
      const result1 = validator.validate('value@dangerous');
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Special characters @ and \\ are not allowed');

      const result2 = validator.validate('value\\dangerous');
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Special characters @ and \\ are not allowed');
    });
  });

  describe('CSS Function Validation', () => {
    it('should validate allowed CSS functions', () => {
      const validFunctions = [
        'calc(100% - 20px)',
        'min(100vw, 500px)',
        'max(200px, 50%)',
        'clamp(1rem, 4vw, 3rem)',
        'var(--custom-property)',
      ];

      validFunctions.forEach((func) => {
        const result = validator.validate(func);
        expect(result.isValid).toBe(true);
      });
    });

    it('should warn about unknown CSS functions', () => {
      const result = validator.validate('unknown-function(100px)');
      // 実際の警告内容を確認
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain("CSS function 'unknown-function'");
    });

    it('should detect unbalanced parentheses', () => {
      const result = validator.validate('calc(100% - 20px');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unbalanced parentheses in CSS function');
    });

    it('should handle nested functions', () => {
      const result = validator.validate('calc(min(100vw, 500px) - 20px)');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('calc(min(100vw, 500px) - 20px)');
    });
  });

  describe('Unit Validation', () => {
    it('should warn about unknown units', () => {
      const result = validator.validate('100unknownunit');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain("Unit 'unknownunit'");
    });

    it('should validate common CSS units', () => {
      const validUnits = ['px', 'rem', 'em', '%', 'vh', 'vw', 'dvh', 'dvw'];

      validUnits.forEach((unit) => {
        const result = validator.validate(`100${unit}`);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Value Sanitization', () => {
    it('should trim whitespace', () => {
      const result = validator.validate('  1rem  ');
      expect(result.sanitizedValue).toBe('1rem');
    });

    it('should normalize multiple spaces', () => {
      const result = validator.validate('calc(100%     -    20px)');
      expect(result.sanitizedValue).toBe('calc(100% - 20px)');
    });

    it('should format CSS functions properly', () => {
      const result = validator.validate('calc(100%-20px)');
      expect(result.sanitizedValue).toBe('calc(100% - 20px)');
    });

    it('should handle negative values correctly', () => {
      const result = validator.validate('calc(-100px + 50%)');
      expect(result.sanitizedValue).toBe('calc(-100px + 50%)');
    });

    it('should format comma-separated values', () => {
      const result = validator.validate('clamp(1rem,4vw,3rem)');
      expect(result.sanitizedValue).toBe('clamp(1rem, 4vw, 3rem)');
    });
  });

  describe('Caching', () => {
    it('should cache validation results', () => {
      const value = '1rem';

      // First call
      const result1 = validator.validate(value);
      expect(result1.isValid).toBe(true);

      // Second call should use cache
      const result2 = validator.validate(value);
      expect(result2).toEqual(result1);

      const stats = cache.getStats();
      expect(stats.hits).toBeGreaterThan(0);
    });

    it('should generate different cache keys for different properties', () => {
      const value = '1rem';

      const result1 = validator.validate(value, 'margin');
      const result2 = validator.validate(value, 'padding');

      // Both should be valid but cached separately
      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(true);
    });

    it('should clear cache properly', () => {
      validator.validate('1rem');
      validator.clearCache();

      const stats = validator.getCacheStats();
      expect(stats.cacheSize.validation).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle validator exceptions gracefully', () => {
      // Mock a function that throws
      const mockValidator = new ArbitraryValueValidator({
        maxLength: -1, // Invalid config that might cause issues
      });

      const result = mockValidator.validate('test');
      // Should not throw, should return error result
      expect(typeof result).toBe('object');
      expect(Object.prototype.hasOwnProperty.call(result, 'isValid')).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should respect custom configuration', () => {
      const customValidator = new ArbitraryValueValidator({
        allowedFunctions: ['calc'],
        allowedUnits: ['px'],
        maxLength: 50,
        enableSecurityCheck: false,
      });

      // Should warn about disallowed function
      const result1 = customValidator.validate('min(100px, 200px)');
      expect(result1.warnings.length).toBeGreaterThan(0);
      expect(result1.warnings[0]).toContain("CSS function 'min'");

      // Should warn about disallowed unit
      const result2 = customValidator.validate('100rem');
      expect(result2.warnings.length).toBeGreaterThan(0);
      expect(result2.warnings[0]).toContain("Unit 'rem'");

      // Should reject long values
      const longValue = 'a'.repeat(60);
      const result3 = customValidator.validate(longValue);
      expect(result3.isValid).toBe(false);
    });

    it('should handle disabled security check', () => {
      const insecureValidator = new ArbitraryValueValidator({
        enableSecurityCheck: false,
      });

      // Should not reject javascript URLs when security is disabled
      const result = insecureValidator.validate('javascript:alert("test")');
      expect(result.isValid).toBe(true);
    });
  });
});

describe('Utility Functions', () => {
  describe('validateArbitraryValue', () => {
    it('should use default validator', () => {
      const result = validateArbitraryValue('1rem');
      expect(result.isValid).toBe(true);
    });

    it('should use custom config', () => {
      const result = validateArbitraryValue('1rem', 'margin', {
        maxLength: 2,
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('isSafeArbitraryValue', () => {
    it('should return true for safe values', () => {
      expect(isSafeArbitraryValue('1rem')).toBe(true);
      expect(isSafeArbitraryValue('calc(100% - 20px)')).toBe(true);
    });

    it('should return false for unsafe values', () => {
      expect(isSafeArbitraryValue('javascript:alert("xss")')).toBe(false);
      expect(isSafeArbitraryValue('<script>alert("xss")</script>')).toBe(false);
    });

    it('should return false for invalid values', () => {
      expect(isSafeArbitraryValue('')).toBe(false);
      expect(isSafeArbitraryValue('calc(100% - 20px')).toBe(false);
    });
  });

  describe('defaultValidator', () => {
    it('should be properly initialized', () => {
      expect(defaultValidator).toBeInstanceOf(ArbitraryValueValidator);

      const result = defaultValidator.validate('1rem');
      expect(result.isValid).toBe(true);
    });

    it('should maintain cache across calls', () => {
      // Clear cache first
      defaultValidator.clearCache();

      // Make some calls
      defaultValidator.validate('1rem');
      defaultValidator.validate('2rem');
      defaultValidator.validate('1rem'); // This should be a cache hit

      const stats = defaultValidator.getCacheStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.hits).toBeGreaterThan(0);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complex real-world scenarios', () => {
    const complexValues = [
      'calc(min(100vw, 1200px) - clamp(1rem, 4vw, 2rem))',
      'max(calc(100vh - 4rem), min(600px, 80vh))',
      'clamp(0.875rem, 0.875rem + 0.5vw, 1.125rem)',
      'var(--spacing-dynamic, calc(1rem + 2vw))',
    ];

    complexValues.forEach((value) => {
      const result = validateArbitraryValue(value);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBeTruthy();
    });
  });

  it('should maintain performance with repeated validations', () => {
    // キャッシュを事前にクリア
    defaultValidator.clearCache();

    const testValues = ['calc(100% - 20px)', '1rem', 'clamp(1rem, 4vw, 3rem)'];

    // 最初に各値を一度バリデートしてキャッシュする
    testValues.forEach((value) => {
      validateArbitraryValue(value);
    });

    // 同じ値を大量に検証（キャッシュヒットを期待）
    const iterations = 333; // 999回の検証（3つの値 × 333回）
    for (let i = 0; i < iterations; i++) {
      testValues.forEach((value) => {
        validateArbitraryValue(value);
      });
    }

    const stats = defaultValidator.getCacheStats();

    // キャッシュヒットが発生していることを確認
    expect(stats.hits).toBeGreaterThan(0);
    // 高いヒット率を期待（最初の3回はミス、残りはヒット）
    expect(stats.hitRate).toBeGreaterThan(90);
    // キャッシュサイズが適切であることを確認
    expect(stats.cacheSize.validation).toBe(testValues.length);
  });
});
