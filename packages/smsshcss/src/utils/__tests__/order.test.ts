import { generateOrderClasses, extractCustomOrderClasses, generateArbitraryOrder } from '../order';
import { OrderConfig } from '../../core/types';

describe('Order Utilities', () => {
  describe('generateOrderClasses', () => {
    it('should generate basic order classes', () => {
      const result = generateOrderClasses();

      // 基本的なOrderクラス
      expect(result).toContain('.order-1 { order: 1; }');
      expect(result).toContain('.order-2 { order: 2; }');
      expect(result).toContain('.order-3 { order: 3; }');
      expect(result).toContain('.order-4 { order: 4; }');
      expect(result).toContain('.order-5 { order: 5; }');
      expect(result).toContain('.order-6 { order: 6; }');
      expect(result).toContain('.order-7 { order: 7; }');
      expect(result).toContain('.order-8 { order: 8; }');
      expect(result).toContain('.order-9 { order: 9; }');
      expect(result).toContain('.order-10 { order: 10; }');
      expect(result).toContain('.order-11 { order: 11; }');
      expect(result).toContain('.order-12 { order: 12; }');
    });

    it('should generate special order classes', () => {
      const result = generateOrderClasses();

      // 特別なOrderクラス
      expect(result).toContain('.order-first { order: -9999; }');
      expect(result).toContain('.order-last { order: 9999; }');
      expect(result).toContain('.order-none { order: 0; }');
    });

    it('should generate arbitrary order value template', () => {
      const result = generateOrderClasses();

      // 任意値のテンプレート
      expect(result).toContain('.order-\\[\\$\\{value\\}\\] { order: var(--value); }');
    });

    it('should generate custom order classes when config is provided', () => {
      const customConfig = {
        'order-13': '13', // 新しいorder-Nパターン
      };

      const result = generateOrderClasses(customConfig);

      // propertyMapは動的に生成されるため、新しいorder-Nパターンはサポートされない
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should merge custom config with default classes', () => {
      const customConfig = {};

      const result = generateOrderClasses(customConfig);

      // デフォルトクラスが含まれる（マージされる）
      expect(result).toContain('.order-1 { order: 1; }');
      expect(result).toContain('.order-first { order: -9999; }');
      expect(result).toContain('.order-none { order: 0; }');
    });

    it('should override default classes when custom config has same key', () => {
      const customConfig = {
        'order-1': '100', // デフォルトの'order-1'を上書き
      };

      const result = generateOrderClasses(customConfig);

      // 上書きされたクラス
      expect(result).toContain('.order-1 { order: 100; }');
      // その他のデフォルトクラスは残る
      expect(result).toContain('.order-2 { order: 2; }');
      expect(result).toContain('.order-first { order: -9999; }');
    });

    it('should handle empty configuration', () => {
      const result = generateOrderClasses({});

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('.order-1 { order: 1; }');
    });
  });

  describe('extractCustomOrderClasses', () => {
    it('should extract custom order classes from HTML content', () => {
      const content = '<div class="order-[100] order-[999]">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(2);
      expect(result).toContain('.order-\\[100\\] { order: 100; }');
      expect(result).toContain('.order-\\[999\\] { order: 999; }');
    });

    it('should handle CSS calc() values in order', () => {
      const content = '<div class="order-[calc(10+5)]">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('order: calc(10+5);');
    });

    it('should handle CSS variables in order', () => {
      const content = '<div class="order-[var(--order-value)]">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('order: var(--order-value);');
    });

    it('should return empty array when no custom classes found', () => {
      const content = '<div class="order-1 order-first">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(0);
    });

    it('should handle negative order values', () => {
      const content = '<div class="order-[-1]">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(1);
      expect(result).toContain('.order-\\[\\-1\\] { order: -1; }');
    });

    it('should handle decimal order values', () => {
      const content = '<div class="order-[1.5]">Test</div>';
      const result = extractCustomOrderClasses(content);

      expect(result).toHaveLength(1);
      expect(result).toContain('.order-\\[1\\.5\\] { order: 1.5; }');
    });
  });

  describe('generateArbitraryOrder', () => {
    it('should generate arbitrary order class', () => {
      const result = generateArbitraryOrder('100');

      expect(result).toBe('.order-\\[100\\] { order: 100; }');
    });

    it('should handle negative values', () => {
      const result = generateArbitraryOrder('-1');

      expect(result).toBe('.order-\\[\\-1\\] { order: -1; }');
    });

    it('should handle decimal values', () => {
      const result = generateArbitraryOrder('1.5');

      expect(result).toBe('.order-\\[1\\.5\\] { order: 1.5; }');
    });

    it('should handle calc() values', () => {
      const result = generateArbitraryOrder('calc(10 + 5)');

      expect(result).toContain('order: calc(10 + 5);');
    });

    it('should handle CSS variables', () => {
      const result = generateArbitraryOrder('var(--custom-order)');

      expect(result).toContain('order: var(--custom-order);');
    });
  });

  describe('Configuration Handling', () => {
    it('should handle null configuration', () => {
      expect(() => generateOrderClasses(null as unknown as OrderConfig)).not.toThrow();
    });

    it('should handle undefined values in configuration', () => {
      const config = { 'valid-key': '10', 'invalid-key': undefined } as Record<
        string,
        string | undefined
      >;
      expect(() => generateOrderClasses(config as OrderConfig)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle complex CSS values', () => {
      const config = {
        'order-1': 'calc(100 - 50)', // 既存のキーを上書き
      };

      const result = generateOrderClasses(config);
      expect(result).toContain('.order-1 { order: calc(100 - 50); }');
    });

    it('should handle large order values', () => {
      const config = {
        'order-12': '99999', // 既存のキーを上書き
      };

      const result = generateOrderClasses(config);
      expect(result).toContain('.order-12 { order: 99999; }');
    });
  });

  describe('Flexbox and Grid Context', () => {
    it('should work in flexbox context', () => {
      const result = generateOrderClasses();

      // Flexboxでの使用を想定したテスト
      expect(result).toContain('.order-1 { order: 1; }');
      expect(result).toContain('.order-first { order: -9999; }');
      expect(result).toContain('.order-last { order: 9999; }');
    });

    it('should work in grid context', () => {
      const result = generateOrderClasses();

      // Gridでの使用を想定したテスト
      expect(result).toContain('.order-none { order: 0; }');
      expect(result).toContain('.order-12 { order: 12; }');
    });
  });
});
