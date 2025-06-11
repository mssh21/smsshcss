import { generateWidthClasses, generateAllWidthClasses } from '../width';
import { defaultSizeConfig } from '../../core/sizeConfig';

describe('Width Utilities', () => {
  // 共通設定から width 設定を取得（width特有の設定も含む）
  const widthConfig = {
    ...defaultSizeConfig,
    screen: '100vw',
    dvw: '100dvw',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  describe('generateWidthClasses', () => {
    it('should generate width classes with default config', () => {
      const result = generateWidthClasses(widthConfig, 'width');

      // 基本的なwidthクラスが含まれているか確認
      expect(result).toContain('.w-none { width: 0; }');
      expect(result).toContain('.w-2xs { width: var(--size-base); }');
      expect(result).toContain('.w-md { width: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.w-5xl { width: calc(var(--size-base) * 16); }');
    });

    it('should generate min-width classes with default config', () => {
      const result = generateWidthClasses(widthConfig, 'min-width');

      // 基本的なmin-widthクラスが含まれているか確認
      expect(result).toContain('.min-w-none { min-width: 0; }');
      expect(result).toContain('.min-w-2xs { min-width: var(--size-base); }');
      expect(result).toContain('.min-w-md { min-width: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.min-w-5xl { min-width: calc(var(--size-base) * 16); }');
    });

    it('should generate max-width classes with default config', () => {
      const result = generateWidthClasses(widthConfig, 'max-width');

      // 基本的なmax-widthクラスが含まれているか確認
      expect(result).toContain('.max-w-none { max-width: 0; }');
      expect(result).toContain('.max-w-2xs { max-width: var(--size-base); }');
      expect(result).toContain('.max-w-md { max-width: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.max-w-5xl { max-width: calc(var(--size-base) * 16); }');
    });

    it('should include arbitrary value classes', () => {
      const result = generateWidthClasses(widthConfig, 'width');

      // 任意の値のクラスが含まれているか確認
      expect(result).toContain('.w-\\[\\$\\{value\\}\\] { width: var(--value); }');
      expect(result).toContain('.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }');
      expect(result).toContain('.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }');
    });
  });

  describe('none width value', () => {
    it('should generate all none width classes correctly', () => {
      const widthResult = generateWidthClasses(widthConfig, 'width');
      const minWidthResult = generateWidthClasses(widthConfig, 'min-width');
      const maxWidthResult = generateWidthClasses(widthConfig, 'max-width');

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
      const result = generateAllWidthClasses();

      // すべての幅クラスが含まれているか確認
      expect(result).toContain('.w-none { width: 0; }');
      expect(result).toContain('.w-full { width: 100%; }');
      expect(result).toContain('.w-2xl { width: calc(var(--size-base) * 6); }');
      expect(result).toContain('.min-w-full { min-width: 100%; }');
      expect(result).toContain('.max-w-full { max-width: 100%; }');
    });

    it('should include custom width classes', () => {
      const result = generateAllWidthClasses();

      // カスタム幅クラスが含まれているか確認
      expect(result).toContain('.w-none { width: 0; }');
      expect(result).toContain('.min-w-none { min-width: 0; }');
      expect(result).toContain('.max-w-none { max-width: 0; }');
    });
  });
});
