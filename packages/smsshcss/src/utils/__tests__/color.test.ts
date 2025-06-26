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
      expect(result).toContain('.text-black { color: hsl(0, 0%, 0% / 1); }');
      expect(result).toContain('.text-white { color: hsl(0, 0%, 100% / 1); }');
      expect(result).toContain('.text-gray-050 { color: hsl(210, 8%, 98% / 1); }');
      expect(result).toContain('.text-gray-900 { color: hsl(210, 6%, 10% / 1); }');
      expect(result).toContain('.text-blue-050 { color: hsl(214, 100%, 98% / 1); }');
      expect(result).toContain('.text-blue-900 { color: hsl(214, 100%, 15% / 1); }');
      expect(result).toContain('.text-red-050 { color: hsl(358, 100%, 98% / 1); }');
      expect(result).toContain('.text-red-900 { color: hsl(358, 100%, 15% / 1); }');
      expect(result).toContain('.text-green-050 { color: hsl(125, 100%, 98% / 1); }');
      expect(result).toContain('.text-green-900 { color: hsl(125, 100%, 12% / 1); }');
      expect(result).toContain('.text-yellow-050 { color: hsl(55, 100%, 98% / 1); }');
      expect(result).toContain('.text-yellow-900 { color: hsl(55, 70%, 12% / 1); }');
      expect(result).toContain('.text-purple-050 { color: hsl(280, 100%, 98% / 1); }');
      expect(result).toContain('.text-purple-900 { color: hsl(280, 100%, 15% / 1); }');
      expect(result).toContain('.text-orange-050 { color: hsl(24, 100%, 98% / 1); }');
      expect(result).toContain('.text-orange-900 { color: hsl(24, 65%, 15% / 1); }');
      expect(result).toContain('.text-pink-050 { color: hsl(330, 100%, 98% / 1); }');
      expect(result).toContain('.text-pink-900 { color: hsl(330, 100%, 20% / 1); }');
      expect(result).toContain('.text-indigo-050 { color: hsl(235, 100%, 98% / 1); }');
      expect(result).toContain('.text-indigo-900 { color: hsl(235, 100%, 15% / 1); }');
      expect(result).toContain('.text-sky-050 { color: hsl(195, 100%, 98% / 1); }');
      expect(result).toContain('.text-sky-900 { color: hsl(195, 100%, 15% / 1); }');
      expect(result).toContain('.text-teal-050 { color: hsl(175, 100%, 98% / 1); }');
      expect(result).toContain('.text-teal-900 { color: hsl(175, 100%, 12% / 1); }');
      expect(result).toContain('.text-emerald-050 { color: hsl(155, 100%, 98% / 1); }');
      expect(result).toContain('.text-emerald-900 { color: hsl(155, 100%, 12% / 1); }');
      expect(result).toContain('.text-amber-050 { color: hsl(35, 100%, 98% / 1); }');
      expect(result).toContain('.text-amber-900 { color: hsl(35, 70%, 12% / 1); }');
    });
  });
});
