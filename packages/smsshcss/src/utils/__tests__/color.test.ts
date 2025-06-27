import {
  generateColorClasses,
  generateBgClasses,
  generateBorderClasses,
  generateFillClasses,
  generateAllColorClasses,
  defaultColor,
} from '../color';

describe('Color Utilities', () => {
  describe('generateColorClasses', () => {
    it('should generate basic color classes', () => {
      const textResult = generateColorClasses();
      const bgResult = generateBgClasses();
      const borderResult = generateBorderClasses();
      const fillResult = generateFillClasses();

      // 基本クラスの確認
      Object.keys(defaultColor).forEach((color) => {
        expect(textResult).toContain(`.text-${color}`);
        expect(bgResult).toContain(`.bg-${color}`);
        expect(borderResult).toContain(`.border-${color}`);
        expect(fillResult).toContain(`.fill-${color}`);
      });
    });

    it('should generate color classes with default config', () => {
      const textResult = generateColorClasses(defaultColor);
      const bgResult = generateBgClasses(defaultColor);
      const borderResult = generateBorderClasses(defaultColor);
      const fillResult = generateFillClasses(defaultColor);

      // 基本的なtextクラスが含まれているか確認
      expect(textResult).toContain('.text-black { color: hsl(0 0% 0% / 1); }');
      expect(textResult).toContain('.text-white { color: hsl(0 0% 100% / 1); }');
      expect(textResult).toContain('.text-gray-050 { color: hsl(210 8% 98% / 1); }');
      expect(textResult).toContain('.text-gray-900 { color: hsl(210 6% 10% / 1); }');
      expect(textResult).toContain('.text-blue-050 { color: hsl(214 100% 98% / 1); }');
      expect(textResult).toContain('.text-blue-900 { color: hsl(214 100% 15% / 1); }');
      expect(textResult).toContain('.text-red-050 { color: hsl(358 100% 98% / 1); }');
      expect(textResult).toContain('.text-red-900 { color: hsl(358 100% 15% / 1); }');
      expect(textResult).toContain('.text-green-050 { color: hsl(125 100% 98% / 1); }');
      expect(textResult).toContain('.text-green-900 { color: hsl(125 100% 12% / 1); }');
      expect(textResult).toContain('.text-yellow-050 { color: hsl(55 100% 98% / 1); }');
      expect(textResult).toContain('.text-yellow-900 { color: hsl(55 70% 12% / 1); }');
      expect(textResult).toContain('.text-purple-050 { color: hsl(280 100% 98% / 1); }');
      expect(textResult).toContain('.text-purple-900 { color: hsl(280 100% 15% / 1); }');
      expect(textResult).toContain('.text-orange-050 { color: hsl(24 100% 98% / 1); }');
      expect(textResult).toContain('.text-orange-900 { color: hsl(24 65% 15% / 1); }');
      expect(textResult).toContain('.text-pink-050 { color: hsl(330 100% 98% / 1); }');
      expect(textResult).toContain('.text-pink-900 { color: hsl(330 100% 20% / 1); }');
      expect(textResult).toContain('.text-indigo-050 { color: hsl(235 100% 98% / 1); }');
      expect(textResult).toContain('.text-indigo-900 { color: hsl(235 100% 15% / 1); }');
      expect(textResult).toContain('.text-sky-050 { color: hsl(195 100% 98% / 1); }');
      expect(textResult).toContain('.text-sky-900 { color: hsl(195 100% 15% / 1); }');
      expect(textResult).toContain('.text-teal-050 { color: hsl(175 100% 98% / 1); }');
      expect(textResult).toContain('.text-teal-900 { color: hsl(175 100% 12% / 1); }');
      expect(textResult).toContain('.text-emerald-050 { color: hsl(155 100% 98% / 1); }');
      expect(textResult).toContain('.text-emerald-900 { color: hsl(155 100% 12% / 1); }');
      expect(textResult).toContain('.text-amber-050 { color: hsl(35 100% 98% / 1); }');
      expect(textResult).toContain('.text-amber-900 { color: hsl(35 70% 12% / 1); }');

      expect(bgResult).toContain('.bg-black { background-color: hsl(0 0% 0% / 1); }');
      expect(bgResult).toContain('.bg-white { background-color: hsl(0 0% 100% / 1); }');
      expect(borderResult).toContain('.border-black { border-color: hsl(0 0% 0% / 1); }');
      expect(borderResult).toContain('.border-white { border-color: hsl(0 0% 100% / 1); }');
      expect(fillResult).toContain('.fill-black { fill: hsl(0 0% 0% / 1); }');
      expect(fillResult).toContain('.fill-white { fill: hsl(0 0% 100% / 1); }');
    });

    it('should generate all color classes', () => {
      const result = generateAllColorClasses();

      // 全ての色クラスが含まれているか確認
      expect(result).toContain('.text-black { color: hsl(0 0% 0% / 1); }');
      expect(result).toContain('.bg-black { background-color: hsl(0 0% 0% / 1); }');
      expect(result).toContain('.border-black { border-color: hsl(0 0% 0% / 1); }');
      expect(result).toContain('.fill-black { fill: hsl(0 0% 0% / 1); }');
    });
  });
});
