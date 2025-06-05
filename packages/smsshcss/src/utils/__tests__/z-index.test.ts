import {
  generateZIndexClasses,
  extractCustomZIndexClasses,
  generateArbitraryZIndex,
} from '../z-index';
import { ZIndexConfig } from '../../core/types';

describe('Z-Index Utilities', () => {
  describe('generateZIndexClasses', () => {
    it('should generate basic z-index classes', () => {
      const result = generateZIndexClasses();

      // Z-index関連のクラス
      expect(result).toContain('.z-0 { z-index: 0; }');
      expect(result).toContain('.z-10 { z-index: 10; }');
      expect(result).toContain('.z-20 { z-index: 20; }');
      expect(result).toContain('.z-30 { z-index: 30; }');
      expect(result).toContain('.z-40 { z-index: 40; }');
      expect(result).toContain('.z-50 { z-index: 50; }');
      expect(result).toContain('.z-auto { z-index: auto; }');
    });

    it('should generate arbitrary z-index value template', () => {
      const result = generateZIndexClasses();

      // 任意値のテンプレート
      expect(result).toContain('.z-\\[\\$\\{value\\}\\] { z-index: var(--value); }');
    });

    it('should merge custom config with default classes', () => {
      const customConfig = {
        'z-100': '100',
      };

      const result = generateZIndexClasses(customConfig);

      // デフォルトクラスも含まれる（マージされる）
      expect(result).toContain('.z-10 { z-index: 10; }');
      expect(result).toContain('.z-20 { z-index: 20; }');
    });

    it('should override default classes when custom config has same key', () => {
      const customConfig = {
        'z-10': '15', // デフォルトの'z-10'を上書き
      };

      const result = generateZIndexClasses(customConfig);

      // 上書きされたクラス
      expect(result).toContain('.z-10 { z-index: 15; }');
      // その他のデフォルトクラスは残る
      expect(result).toContain('.z-20 { z-index: 20; }');
      expect(result).toContain('.z-auto { z-index: auto; }');
    });

    it('should handle empty configuration', () => {
      const result = generateZIndexClasses({});

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('.z-0 { z-index: 0; }');
    });
  });

  describe('extractCustomZIndexClasses', () => {
    it('should extract custom z-index classes from HTML content', () => {
      const content = '<div class="z-[100] z-[999]">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(2);
      expect(result).toContain('.z-\\[100\\] { z-index: 100; }');
      expect(result).toContain('.z-\\[999\\] { z-index: 999; }');
    });

    it('should handle CSS calc() values in z-index', () => {
      const content = '<div class="z-[calc(100+50)]">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('z-index: calc(100+50);');
    });

    it('should handle CSS variables in z-index', () => {
      const content = '<div class="z-[var(--z-index)]">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('z-index: var(--z-index);');
    });

    it('should return empty array when no custom classes found', () => {
      const content = '<div class="z-10 z-auto">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(0);
    });

    it('should handle negative z-index values', () => {
      const content = '<div class="z-[-1]">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(1);
      expect(result).toContain('.z-\\[\\-1\\] { z-index: -1; }');
    });

    it('should handle large z-index values', () => {
      const content = '<div class="z-[9999]">Test</div>';
      const result = extractCustomZIndexClasses(content);

      expect(result).toHaveLength(1);
      expect(result).toContain('.z-\\[9999\\] { z-index: 9999; }');
    });
  });

  describe('generateArbitraryZIndex', () => {
    it('should generate arbitrary z-index class', () => {
      const result = generateArbitraryZIndex('100');

      expect(result).toBe('.z-\\[100\\] { z-index: 100; }');
    });

    it('should handle negative values', () => {
      const result = generateArbitraryZIndex('-1');

      expect(result).toBe('.z-\\[\\-1\\] { z-index: -1; }');
    });

    it('should handle calc() values', () => {
      const result = generateArbitraryZIndex('calc(100 + 50)');

      expect(result).toContain('z-index: calc(100 + 50);');
    });

    it('should handle CSS variables', () => {
      const result = generateArbitraryZIndex('var(--custom-z)');

      expect(result).toContain('z-index: var(--custom-z);');
    });

    it('should handle large values', () => {
      const result = generateArbitraryZIndex('99999');

      expect(result).toBe('.z-\\[99999\\] { z-index: 99999; }');
    });
  });

  describe('Configuration Handling', () => {
    it('should handle null configuration', () => {
      expect(() => generateZIndexClasses(null as unknown as ZIndexConfig)).not.toThrow();
    });

    it('should handle undefined values in configuration', () => {
      const config = { 'valid-key': '10', 'invalid-key': undefined } as Record<
        string,
        string | undefined
      >;
      expect(() => generateZIndexClasses(config as ZIndexConfig)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle complex CSS values', () => {
      const config = {
        'z-50': 'calc(100vh - 50px)', // 既存のキーを上書き
      };

      const result = generateZIndexClasses(config);
      expect(result).toContain('.z-50 { z-index: calc(100vh - 50px); }');
    });

    it('should handle CSS custom properties', () => {
      const config = {
        'z-auto': 'var(--z-index-modal)',
      };

      const result = generateZIndexClasses(config);
      expect(result).toContain('.z-auto { z-index: var(--z-index-modal); }');
    });
  });

  describe('Layering Use Cases', () => {
    it('should support modal layering', () => {
      const result = generateZIndexClasses();

      // モーダル用の高い値
      expect(result).toContain('.z-50 { z-index: 50; }');
    });

    it('should support dropdown layering', () => {
      const result = generateZIndexClasses();

      // ドロップダウン用の中程度の値
      expect(result).toContain('.z-10 { z-index: 10; }');
      expect(result).toContain('.z-20 { z-index: 20; }');
    });

    it('should support background layering', () => {
      const result = generateZIndexClasses();

      // 背景用の低い値
      expect(result).toContain('.z-0 { z-index: 0; }');
    });

    it('should support auto layering', () => {
      const result = generateZIndexClasses();

      // 自動レイヤリング
      expect(result).toContain('.z-auto { z-index: auto; }');
    });
  });
});
