import { generatePositioningClasses, extractCustomPositioningClasses } from '../positioning';
import { PositioningConfig } from '../../core/types';

describe('Positioning Utilities', () => {
  describe('generatePositioningClasses', () => {
    it('should generate basic positioning classes', () => {
      const result = generatePositioningClasses();

      // Position関連のクラス
      expect(result).toContain('.static { position: static; }');
      expect(result).toContain('.fixed { position: fixed; }');
      expect(result).toContain('.absolute { position: absolute; }');
      expect(result).toContain('.relative { position: relative; }');
      expect(result).toContain('.sticky { position: sticky; }');
    });

    it('should merge custom config with default classes', () => {
      const customConfig = {};

      const result = generatePositioningClasses(customConfig);

      // デフォルトクラスは含まれる（マージされる）
      expect(result).toContain('.static { position: static; }');
      expect(result).toContain('.absolute { position: absolute; }');
    });

    it('should override default classes when custom config has same key', () => {
      const customConfig = {
        static: 'relative', // デフォルトの'static'を上書き
      };

      const result = generatePositioningClasses(customConfig);

      // 上書きされたクラス
      expect(result).toContain('.static { position: relative; }');
      // その他のデフォルトクラスは残る
      expect(result).toContain('.fixed { position: fixed; }');
      expect(result).toContain('.absolute { position: absolute; }');
    });

    it('should handle empty configuration', () => {
      const result = generatePositioningClasses({});

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('.static { position: static; }');
    });

    it('should handle null configuration', () => {
      expect(() => generatePositioningClasses(null as unknown as PositioningConfig)).not.toThrow();
    });

    it('should handle undefined values in configuration', () => {
      const config = { 'valid-key': 'static', 'invalid-key': undefined } as Record<
        string,
        string | undefined
      >;
      expect(() => generatePositioningClasses(config as PositioningConfig)).not.toThrow();
    });
  });

  describe('Position Values', () => {
    it('should support all standard position values', () => {
      const result = generatePositioningClasses();

      expect(result).toContain('.static { position: static; }');
      expect(result).toContain('.relative { position: relative; }');
      expect(result).toContain('.absolute { position: absolute; }');
      expect(result).toContain('.fixed { position: fixed; }');
      expect(result).toContain('.sticky { position: sticky; }');
    });

    it('should handle custom position values', () => {
      const config = {
        'custom-pos': 'sticky',
      };

      const result = generatePositioningClasses(config);

      // propertyMapに含まれていないキーは処理されない
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Use Cases', () => {
    it('should support modal positioning', () => {
      const result = generatePositioningClasses();

      // モーダル用の固定配置
      expect(result).toContain('.fixed { position: fixed; }');
    });

    it('should support dropdown positioning', () => {
      const result = generatePositioningClasses();

      // ドロップダウン用の絶対配置
      expect(result).toContain('.absolute { position: absolute; }');
      expect(result).toContain('.relative { position: relative; }');
    });

    it('should support sticky header positioning', () => {
      const result = generatePositioningClasses();

      // スティッキーヘッダー用
      expect(result).toContain('.sticky { position: sticky; }');
    });

    it('should support normal flow positioning', () => {
      const result = generatePositioningClasses();

      // 通常のフロー内配置
      expect(result).toContain('.static { position: static; }');
      expect(result).toContain('.relative { position: relative; }');
    });
  });

  describe('extractCustomPositioningClasses', () => {
    it('should extract basic position classes', () => {
      const html = '<div class="relative absolute fixed">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(3);
      expect(result).toContain('.relative { position: relative; }');
      expect(result).toContain('.absolute { position: absolute; }');
      expect(result).toContain('.fixed { position: fixed; }');
    });

    it('should extract custom top/right/bottom/left values', () => {
      const html = '<div class="top-[10px] right-[20px] bottom-[30px] left-[40px]">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(4);
      expect(result).toContain('.top-[10px] { top: 10px; }');
      expect(result).toContain('.right-[20px] { right: 20px; }');
      expect(result).toContain('.bottom-[30px] { bottom: 30px; }');
      expect(result).toContain('.left-[40px] { left: 40px; }');
    });

    it('should extract inset custom values', () => {
      const html = '<div class="inset-[5px]">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('top: 5px; right: 5px; bottom: 5px; left: 5px;');
    });

    it('should extract inset-x custom values', () => {
      const html = '<div class="inset-x-[15px]">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('left: 15px; right: 15px;');
    });

    it('should extract inset-y custom values', () => {
      const html = '<div class="inset-y-[25px]">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('top: 25px; bottom: 25px;');
    });

    it('should handle complex CSS values', () => {
      const html = '<div class="top-[calc(100%-2rem)] left-[var(--custom-offset)]">test</div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(2);
      expect(result).toContain('.top-[calc(100%-2rem)] { top: calc(100%-2rem); }');
      expect(result).toContain('.left-[var(--custom-offset)] { left: var(--custom-offset); }');
    });

    it('should not extract duplicate classes', () => {
      const html = '<div class="relative absolute"><span class="relative">test</span></div>';
      const result = extractCustomPositioningClasses(html);

      expect(result).toHaveLength(2);
      expect(result.filter((cls) => cls.includes('relative')).length).toBe(1);
    });

    it('should handle empty content', () => {
      const result = extractCustomPositioningClasses('');
      expect(result).toHaveLength(0);
    });

    it('should handle content without position classes', () => {
      const html = '<div class="text-red-500 bg-blue-200">test</div>';
      const result = extractCustomPositioningClasses(html);
      expect(result).toHaveLength(0);
    });
  });
});
