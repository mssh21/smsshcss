import { generatePositioningClasses } from '../positioning';
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
});
