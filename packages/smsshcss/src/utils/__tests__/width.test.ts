import { generateWidthClasses, generateAllWidthClasses } from '../width';

describe('Spacing Utilities', () => {
  // フィボナッチ数列ベースのスペーシング設定（直感的な命名）
  const defaultConfig = {
    none: '0', // ゼロスペーシング
    '2xs': 'var(--size-2xs)', // 16px
    xs: 'var(--size-xs)', // 24px
    sm: 'var(--size-sm)', // 32px
    md: 'var(--size-md)', // 40px
    lg: 'var(--size-lg)', // 48px
    xl: 'var(--size-xl)', // 64px
    '2xl': 'var(--size-2xl)', // 96px
    '3xl': 'var(--size-3xl)', // 128px
    '4xl': 'var(--size-4xl)', // 192px
    '5xl': 'var(--size-5xl)', // 256px
    '6xl': 'var(--size-6xl)', // 320px
    '7xl': 'var(--size-7xl)', // 384px
    '8xl': 'var(--size-8xl)', // 512px
    '9xl': 'var(--size-9xl)', // 768px
    '10xl': 'var(--size-10xl)', // 1024px
    '11xl': 'var(--size-11xl)', // 1280px
    '12xl': 'var(--size-12xl)', // 1536px
    full: '100%',
    auto: 'auto',
    fit: 'fit-content',
    min: 'min-content',
    max: 'max-content',
    screen: '100vw',
    dvh: '100dvh',
    dvw: '100dvw',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  describe('generateWidthClasses', () => {
    it('should generate width classes with default config', () => {
      const result = generateWidthClasses(defaultConfig, 'width');

      // 基本的なwidthクラスが含まれているか確認
      expect(result).toContain('.w-none { width: 0; }');
      expect(result).toContain('.w-2xs { width: var(--size-2xs); }');
      expect(result).toContain('.w-md { width: var(--size-md); }');
      expect(result).toContain('.w-5xl { width: var(--size-5xl); }');
    });

    it('should generate min-width classes with default config', () => {
      const result = generateWidthClasses(defaultConfig, 'min-width');

      // 基本的なmin-widthクラスが含まれているか確認
      expect(result).toContain('.min-w-none { min-width: 0; }');
      expect(result).toContain('.min-w-2xs { min-width: var(--size-2xs); }');
      expect(result).toContain('.min-w-md { min-width: var(--size-md); }');
      expect(result).toContain('.min-w-5xl { min-width: var(--size-5xl); }');
    });

    it('should generate max-width classes with default config', () => {
      const result = generateWidthClasses(defaultConfig, 'max-width');

      // 基本的なmax-widthクラスが含まれているか確認
      expect(result).toContain('.max-w-none { max-width: 0; }');
      expect(result).toContain('.max-w-2xs { max-width: var(--size-2xs); }');
      expect(result).toContain('.max-w-md { max-width: var(--size-md); }');
      expect(result).toContain('.max-w-5xl { max-width: var(--size-5xl); }');
    });

    it('should include arbitrary value classes', () => {
      const result = generateWidthClasses(defaultConfig, 'width');

      // 任意の値のクラスが含まれているか確認
      expect(result).toContain('.w-\\[\\$\\{value\\}\\] { width: var(--value); }');
      expect(result).toContain('.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }');
      expect(result).toContain('.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }');
    });
  });

  describe('none width value', () => {
    it('should generate all none width classes correctly', () => {
      const widthResult = generateWidthClasses(defaultConfig, 'width');
      const minWidthResult = generateWidthClasses(defaultConfig, 'min-width');
      const maxWidthResult = generateWidthClasses(defaultConfig, 'max-width');

      // widthのnoneクラス
      expect(widthResult).toContain('.w-none { width: 0; }');
      // min-widthのnoneクラス
      expect(minWidthResult).toContain('.min-w-none { min-width: 0; }');
      // max-widthのnoneクラス
      expect(maxWidthResult).toContain('.max-w-none { max-width: 0; }');
    });
  });

  describe('generateAllWidthClasses', () => {
    it('should generate all width classes', () => {
      const result = generateAllWidthClasses(defaultConfig);

      // width、min-width、max-widthのクラスがすべて含まれているか確認
      expect(result).toContain('.w-none { width: 0; }');
      expect(result).toContain('.min-w-none { min-width: 0; }');
      expect(result).toContain('.max-w-none { max-width: 0; }');
      expect(result).toContain('.w-md { width: var(--size-md); }');
      expect(result).toContain('.min-w-md { min-width: var(--size-md); }');
      expect(result).toContain('.max-w-md { max-width: var(--size-md); }');
    });

    it('should include all arbitrary value classes', () => {
      const result = generateAllWidthClasses(defaultConfig);

      // すべての任意の値クラスが含まれているか確認
      expect(result).toContain('.w-\\[\\$\\{value\\}\\] { width: var(--value); }');
      expect(result).toContain('.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }');
      expect(result).toContain('.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }');
    });
  });
});
