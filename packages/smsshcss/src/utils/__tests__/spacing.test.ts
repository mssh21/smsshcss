import { generateSpacingClasses, generateGapClasses, generateAllSpacingClasses } from '../spacing';

describe('Spacing Utilities', () => {
  // デフォルトのスペーシング設定
  const defaultConfig = {
    '2xs': '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    'sm+': '0.707rem',
    md: '1rem',
    'md+': '1.618rem',
    lg: '1.5rem',
    'lg+': '2.121rem',
    xl: '2rem',
    'xl+': '3.236rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  };

  describe('generateSpacingClasses', () => {
    it('should generate margin classes with default config', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');
      
      // 基本的なマージンクラスが含まれているか確認
      expect(result).toContain('.m-2xs { margin: 0.125rem; }');
      expect(result).toContain('.m-md { margin: 1rem; }');
      expect(result).toContain('.m-4xl { margin: 6rem; }');
    });

    it('should generate padding classes with default config', () => {
      const result = generateSpacingClasses(defaultConfig, 'padding');
      
      // 基本的なパディングクラスが含まれているか確認
      expect(result).toContain('.p-2xs { padding: 0.125rem; }');
      expect(result).toContain('.p-md { padding: 1rem; }');
      expect(result).toContain('.p-4xl { padding: 6rem; }');
    });

    it('should generate directional classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');
      
      // 方向指定のクラスが含まれているか確認
      expect(result).toContain('.mt-md { margin-top: 1rem; }');
      expect(result).toContain('.mr-md { margin-right: 1rem; }');
      expect(result).toContain('.mb-md { margin-bottom: 1rem; }');
      expect(result).toContain('.ml-md { margin-left: 1rem; }');
    });

    it('should generate x and y directional classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');
      
      // x, y方向のクラスが含まれているか確認
      expect(result).toContain('.mx-md { margin-left: 1rem; margin-right: 1rem; }');
      expect(result).toContain('.my-md { margin-top: 1rem; margin-bottom: 1rem; }');
    });

    it('should include arbitrary value classes', () => {
      const result = generateSpacingClasses(defaultConfig, 'margin');
      
      // 任意の値のクラスが含まれているか確認
      expect(result).toContain('.m-\\[\\$\\{value\\}\\] { margin: var(--value); }');
      expect(result).toContain('.mt-\\[\\$\\{value\\}\\] { margin-top: var(--value); }');
      expect(result).toContain('.mx-\\[\\$\\{value\\}\\] { margin-left: var(--value); margin-right: var(--value); }');
    });
  });

  describe('generateGapClasses', () => {
    it('should generate gap classes with default config', () => {
      const result = generateGapClasses(defaultConfig);
      
      // 基本的なギャップクラスが含まれているか確認
      expect(result).toContain('.gap-2xs { gap: 0.125rem; }');
      expect(result).toContain('.gap-md { gap: 1rem; }');
      expect(result).toContain('.gap-4xl { gap: 6rem; }');
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
      expect(result).toContain('.m-md { margin: 1rem; }');
      expect(result).toContain('.p-md { padding: 1rem; }');
      expect(result).toContain('.gap-md { gap: 1rem; }');
    });

    it('should include all directional classes', () => {
      const result = generateAllSpacingClasses(defaultConfig);
      
      // すべての方向指定クラスが含まれているか確認
      expect(result).toContain('.mt-md { margin-top: 1rem; }');
      expect(result).toContain('.pt-md { padding-top: 1rem; }');
      expect(result).toContain('.mx-md { margin-left: 1rem; margin-right: 1rem; }');
      expect(result).toContain('.px-md { padding-left: 1rem; padding-right: 1rem; }');
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