import { generateSpacingClasses, generateGapClasses, generateAllSpacingClasses } from '../spacing';

describe('Spacing Utilities', () => {
  // フィボナッチ数列ベースのスペーシング設定（直感的な命名）
  const defaultConfig = {
    '2xs': '0.25rem', // 4px  (フィボナッチ: 1)
    xs: '0.5rem', // 8px  (フィボナッチ: 2)
    sm: '0.75rem', // 12px (フィボナッチ: 3)
    md: '1.25rem', // 20px (フィボナッチ: 5)
    lg: '2rem', // 32px (フィボナッチ: 8)
    xl: '3.25rem', // 52px (フィボナッチ: 13)
    '2xl': '5.25rem', // 84px (フィボナッチ: 21)
    '3xl': '8.5rem', // 136px (フィボナッチ: 34)
    '4xl': '13.75rem', // 220px (フィボナッチ: 55)
    '5xl': '22.25rem', // 356px (フィボナッチ: 89)
  };

  describe('generateSpacingClasses', () => {
    it('should generate margin classes with default config', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');

      // 基本的なマージンクラスが含まれているか確認
      expect(result).toContain('.m-2xs { margin: 0.25rem; }');
      expect(result).toContain('.m-md { margin: 1.25rem; }');
      expect(result).toContain('.m-5xl { margin: 22.25rem; }');
    });

    it('should generate padding classes with default config', () => {
      const result = generateSpacingClasses(defaultConfig, 'padding');

      // 基本的なパディングクラスが含まれているか確認
      expect(result).toContain('.p-2xs { padding: 0.25rem; }');
      expect(result).toContain('.p-md { padding: 1.25rem; }');
      expect(result).toContain('.p-5xl { padding: 22.25rem; }');
    });

    it('should generate directional classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');

      // 方向指定のクラスが含まれているか確認
      expect(result).toContain('.mt-md { margin-top: 1.25rem; }');
      expect(result).toContain('.mr-md { margin-right: 1.25rem; }');
      expect(result).toContain('.mb-md { margin-bottom: 1.25rem; }');
      expect(result).toContain('.ml-md { margin-left: 1.25rem; }');
    });

    it('should generate x and y directional classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');

      // x, y方向のクラスが含まれているか確認
      expect(result).toContain('.mx-md { margin-left: 1.25rem; margin-right: 1.25rem; }');
      expect(result).toContain('.my-md { margin-top: 1.25rem; margin-bottom: 1.25rem; }');
    });

    it('should include arbitrary value classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');

      // 任意の値のクラスが含まれているか確認
      expect(result).toContain('.m-\\[\\$\\{value\\}\\] { margin: var(--value); }');
      expect(result).toContain('.mt-\\[\\$\\{value\\}\\] { margin-top: var(--value); }');
      expect(result).toContain(
        '.mx-\\[\\$\\{value\\}\\] { margin-left: var(--value); margin-right: var(--value); }'
      );
    });
  });

  describe('generateGapClasses', () => {
    it('should generate gap classes with default config', () => {
      const result = generateGapClasses(defaultConfig);

      // 基本的なギャップクラスが含まれているか確認
      expect(result).toContain('.gap-2xs { gap: 0.25rem; }');
      expect(result).toContain('.gap-md { gap: 1.25rem; }');
      expect(result).toContain('.gap-5xl { gap: 22.25rem; }');
    });

    it('should include arbitrary gap value class', () => {
      const result = generateGapClasses(defaultConfig);

      // 任意の値のギャップクラスが含まれているか確認
      expect(result).toContain('.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }');
    });
  });

  describe('generateAllSpacingClasses', () => {
    it('should generate all spacing classes', () => {
      const result = generateAllSpacingClasses(defaultConfig);

      // マージン、パディング、ギャップのクラスがすべて含まれているか確認
      expect(result).toContain('.m-md { margin: 1.25rem; }');
      expect(result).toContain('.p-md { padding: 1.25rem; }');
      expect(result).toContain('.gap-md { gap: 1.25rem; }');
    });

    it('should include all directional classes', () => {
      const result = generateAllSpacingClasses(defaultConfig);

      // すべての方向指定クラスが含まれているか確認
      expect(result).toContain('.mt-md { margin-top: 1.25rem; }');
      expect(result).toContain('.pt-md { padding-top: 1.25rem; }');
      expect(result).toContain('.mx-md { margin-left: 1.25rem; margin-right: 1.25rem; }');
      expect(result).toContain('.px-md { padding-left: 1.25rem; padding-right: 1.25rem; }');
    });

    it('should include all arbitrary value classes', () => {
      const result = generateAllSpacingClasses(defaultConfig);

      // すべての任意の値クラスが含まれているか確認
      expect(result).toContain('.m-\\[\\$\\{value\\}\\] { margin: var(--value); }');
      expect(result).toContain('.p-\\[\\$\\{value\\}\\] { padding: var(--value); }');
      expect(result).toContain('.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }');
    });
  });
});
