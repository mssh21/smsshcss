import { generateColorClasses, defaultColor } from '../color';

describe('Color Utilities', () => {
  describe('generateColorClasses', () => {
    it('should generate basic color classes', () => {
      const result = generateColorClasses();

      // 基本クラスの確認
      Object.keys(defaultColor).forEach((color) => {
        expect(result).toContain(`.text-${color}`);
      });
    });

    it('should generate color classes with default config', () => {
      const result = generateColorClasses(defaultColor);

      // 基本的なcolorクラスが含まれているか確認
      expect(result).toContain('.text-gray-050 { color: hsl(0, 0%, 98% / 1); }');
      expect(result).toContain('.text-gray-900 { color: hsl(0, 0%, 10% / 1); }');
      expect(result).toContain('.text-blue-000 { color: hsl(216, 100%, 98% / 1); }');
      expect(result).toContain('.text-blue-900 { color: hsl(216, 30%, 20% / 1); }');
      expect(result).toContain('.text-red-000 { color: hsl(0, 100%, 98% / 1); }');
      expect(result).toContain('.text-red-900 { color: hsl(0, 30%, 20% / 1); }');
    });
  });
});
