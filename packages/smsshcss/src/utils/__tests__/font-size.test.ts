import { generateFontSizeClasses, defaultFontSize } from '../font-size';

describe('Typography Utilities', () => {
  describe('generateFontSizeClasses', () => {
    it('should generate basic font size classes', () => {
      const result = generateFontSizeClasses();

      // 基本クラスの確認
      Object.keys(defaultFontSize).forEach((size) => {
        expect(result).toContain(`.font-size-${size}`);
      });
    });
  });
});
