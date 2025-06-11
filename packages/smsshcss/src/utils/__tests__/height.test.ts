import { generateHeightClasses, generateAllHeightClasses } from '../height';
import { defaultSizeConfig } from '../../core/sizeConfig';

describe('Height Utilities', () => {
  // 共通設定から height 設定を取得（height特有の設定も含む）
  const heightConfig = {
    ...defaultSizeConfig,
    screen: '100vh',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    cqw: '100cqh',
    cqi: '100cqb',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  describe('generateHeightClasses', () => {
    it('should generate height classes with default config', () => {
      const result = generateHeightClasses(heightConfig);

      // 基本的なheightクラスが含まれているか確認
      expect(result).toContain('.h-none { height: 0; }');
      expect(result).toContain('.h-2xs { height: var(--size-base); }');
      expect(result).toContain('.h-md { height: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.h-5xl { height: calc(var(--size-base) * 16); }');
    });

    it('should generate min-height classes with default config', () => {
      const result = generateHeightClasses(heightConfig);

      // 基本的なmin-heightクラスが含まれているか確認
      expect(result).toContain('.min-h-none { min-height: 0; }');
      expect(result).toContain('.min-h-2xs { min-height: var(--size-base); }');
      expect(result).toContain('.min-h-md { min-height: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.min-h-5xl { min-height: calc(var(--size-base) * 16); }');
    });

    it('should generate max-height classes with default config', () => {
      const result = generateHeightClasses(heightConfig);

      // 基本的なmax-heightクラスが含まれているか確認
      expect(result).toContain('.max-h-none { max-height: 0; }');
      expect(result).toContain('.max-h-2xs { max-height: var(--size-base); }');
      expect(result).toContain('.max-h-md { max-height: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.max-h-5xl { max-height: calc(var(--size-base) * 16); }');
    });

    it('should generate height-specific viewport classes', () => {
      const result = generateHeightClasses(heightConfig);

      // height特有のビューポート単位のクラスが含まれているか確認
      expect(result).toContain('.h-screen { height: 100vh; }');
      expect(result).toContain('.h-svh { height: 100svh; }');
      expect(result).toContain('.h-lvh { height: 100lvh; }');
      expect(result).toContain('.h-dvh { height: 100dvh; }');
    });

    it('should include arbitrary value classes', () => {
      const result = generateHeightClasses(heightConfig);

      // 任意の値のクラスが含まれているか確認
      expect(result).toContain('.h-\\[\\$\\{value\\}\\] { height: var(--value); }');
      expect(result).toContain('.min-h-\\[\\$\\{value\\}\\] { min-height: var(--value); }');
      expect(result).toContain('.max-h-\\[\\$\\{value\\}\\] { max-height: var(--value); }');
    });
  });

  describe('none height value', () => {
    it('should generate all none height classes correctly', () => {
      const result = generateHeightClasses(heightConfig);

      // heightのnoneクラス
      expect(result).toContain('.h-none { height: 0; }');
      // min-heightのnoneクラス
      expect(result).toContain('.min-h-none { min-height: 0; }');
      // max-heightのnoneクラス
      expect(result).toContain('.max-h-none { max-height: 0; }');
    });
  });

  describe('generateAllHeightClasses', () => {
    it('should generate all height classes', () => {
      const result = generateAllHeightClasses();

      // すべての高さクラスが含まれているか確認
      expect(result).toContain('.h-none { height: 0; }');
      expect(result).toContain('.h-full { height: 100%; }');
      expect(result).toContain('.h-2xl { height: calc(var(--size-base) * 6); }');
      expect(result).toContain('.min-h-full { min-height: 100%; }');
      expect(result).toContain('.max-h-full { max-height: 100%; }');
    });

    it('should include special viewport height classes', () => {
      const result = generateAllHeightClasses();

      // ビューポート高さクラスが含まれているか確認
      expect(result).toContain('.h-dvh { height: 100dvh; }');
      expect(result).toContain('.h-svh { height: 100svh; }');
      expect(result).toContain('.h-lvh { height: 100lvh; }');
    });

    it('should include custom height classes', () => {
      const result = generateAllHeightClasses();

      // カスタム高さクラスが含まれているか確認
      expect(result).toContain('.h-none { height: 0; }');
      expect(result).toContain('.min-h-none { min-height: 0; }');
      expect(result).toContain('.max-h-none { max-height: 0; }');
    });
  });
});
