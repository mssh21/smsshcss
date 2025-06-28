import { generateSpacingClasses, generateGapClasses, generateAllSpacingClasses } from '../spacing';
import { defaultSpacingValues } from '../../core/sizeConfig';

describe('Spacing Utilities', () => {
  // 共通設定から spacing 設定を取得
  const spacingConfig = defaultSpacingValues;

  describe('generateSpacingClasses', () => {
    it('should generate margin classes with default config', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

      // 基本的なマージンクラスが含まれているか確認
      expect(result).toContain('.m-none { margin: 0; }');
      expect(result).toContain('.m-auto { margin: auto; }');
      expect(result).toContain('.m-2xs { margin: 0.25rem; }');
      expect(result).toContain('.m-md { margin: 1.25rem; }');
      expect(result).toContain('.m-5xl { margin: 22.25rem; }');
    });

    it('should generate padding classes with default config', () => {
      const result = generateSpacingClasses(spacingConfig, 'padding');

      // 基本的なパディングクラスが含まれているか確認
      expect(result).toContain('.p-none { padding: 0; }');
      expect(result).toContain('.p-auto { padding: auto; }');
      expect(result).toContain('.p-2xs { padding: 0.25rem; }');
      expect(result).toContain('.p-md { padding: 1.25rem; }');
      expect(result).toContain('.p-5xl { padding: 22.25rem; }');
    });

    it('should generate directional classes', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

      // 方向指定のクラスが含まれているか確認
      expect(result).toContain('.mt-none { margin-top: 0; }');
      expect(result).toContain('.mt-auto { margin-top: auto; }');
      expect(result).toContain('.mr-none { margin-right: 0; }');
      expect(result).toContain('.mb-none { margin-bottom: 0; }');
      expect(result).toContain('.ml-none { margin-left: 0; }');
      expect(result).toContain('.mt-md { margin-top: 1.25rem; }');
      expect(result).toContain('.mr-md { margin-right: 1.25rem; }');
      expect(result).toContain('.mb-md { margin-bottom: 1.25rem; }');
      expect(result).toContain('.ml-md { margin-left: 1.25rem; }');
    });

    it('should generate x and y directional classes', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

      // x, y方向のクラスが含まれているか確認
      expect(result).toContain('.mx-none { margin-left: 0; margin-right: 0; }');
      expect(result).toContain('.my-none { margin-top: 0; margin-bottom: 0; }');
      expect(result).toContain('.my-auto { margin-top: auto; margin-bottom: auto; }');
      expect(result).toContain('.mx-md { margin-left: 1.25rem; margin-right: 1.25rem; }');
      expect(result).toContain('.my-md { margin-top: 1.25rem; margin-bottom: 1.25rem; }');
    });
  });

  describe('generateGapClasses', () => {
    it('should generate gap classes with default config', () => {
      const result = generateGapClasses(spacingConfig);

      // 基本的なギャップクラスが含まれているか確認
      expect(result).toContain('.gap-none { gap: 0; }');
      expect(result).toContain('.gap-auto { gap: auto; }');
      expect(result).toContain('.gap-2xs { gap: 0.25rem; }');
      expect(result).toContain('.gap-md { gap: 1.25rem; }');
      expect(result).toContain('.gap-5xl { gap: 22.25rem; }');
    });

    it('should generate gap-x (column-gap) classes with default config', () => {
      const result = generateGapClasses(spacingConfig);

      // gap-x (column-gap) クラスが含まれているか確認
      expect(result).toContain('.gap-x-none { column-gap: 0; }');
      expect(result).toContain('.gap-x-auto { column-gap: auto; }');
      expect(result).toContain('.gap-x-2xs { column-gap: 0.25rem; }');
      expect(result).toContain('.gap-x-md { column-gap: 1.25rem; }');
      expect(result).toContain('.gap-x-lg { column-gap: 2rem; }');
      expect(result).toContain('.gap-x-5xl { column-gap: 22.25rem; }');
    });

    it('should generate gap-y (row-gap) classes with default config', () => {
      const result = generateGapClasses(spacingConfig);

      // gap-y (row-gap) クラスが含まれているか確認
      expect(result).toContain('.gap-y-none { row-gap: 0; }');
      expect(result).toContain('.gap-y-auto { row-gap: auto; }');
      expect(result).toContain('.gap-y-2xs { row-gap: 0.25rem; }');
      expect(result).toContain('.gap-y-md { row-gap: 1.25rem; }');
      expect(result).toContain('.gap-y-lg { row-gap: 2rem; }');
      expect(result).toContain('.gap-y-5xl { row-gap: 22.25rem; }');
    });
  });

  describe('none spacing value', () => {
    it('should generate all none spacing classes correctly', () => {
      const marginResult = generateSpacingClasses(spacingConfig, 'margin');
      const paddingResult = generateSpacingClasses(spacingConfig, 'padding');
      const gapResult = generateGapClasses(spacingConfig);

      // マージンのnoneクラス
      expect(marginResult).toContain('.m-none { margin: 0; }');
      expect(marginResult).toContain('.mt-none { margin-top: 0; }');
      expect(marginResult).toContain('.mr-none { margin-right: 0; }');
      expect(marginResult).toContain('.mb-none { margin-bottom: 0; }');
      expect(marginResult).toContain('.ml-none { margin-left: 0; }');
      expect(marginResult).toContain('.mx-none { margin-left: 0; margin-right: 0; }');
      expect(marginResult).toContain('.my-none { margin-top: 0; margin-bottom: 0; }');

      // パディングのnoneクラス
      expect(paddingResult).toContain('.p-none { padding: 0; }');
      expect(paddingResult).toContain('.pt-none { padding-top: 0; }');
      expect(paddingResult).toContain('.pr-none { padding-right: 0; }');
      expect(paddingResult).toContain('.pb-none { padding-bottom: 0; }');
      expect(paddingResult).toContain('.pl-none { padding-left: 0; }');
      expect(paddingResult).toContain('.px-none { padding-left: 0; padding-right: 0; }');
      expect(paddingResult).toContain('.py-none { padding-top: 0; padding-bottom: 0; }');

      // ギャップのnoneクラス
      expect(gapResult).toContain('.gap-none { gap: 0; }');
      expect(gapResult).toContain('.gap-x-none { column-gap: 0; }');
      expect(gapResult).toContain('.gap-y-none { row-gap: 0; }');
    });
  });

  describe('generateAllSpacingClasses', () => {
    it('should generate all spacing classes', () => {
      const result = generateAllSpacingClasses();

      // マージン、パディング、ギャップのクラスがすべて含まれているか確認
      expect(result).toContain('.m-none { margin: 0; }');
      expect(result).toContain('.p-none { padding: 0; }');
      expect(result).toContain('.gap-none { gap: 0; }');
      expect(result).toContain('.gap-x-none { column-gap: 0; }');
      expect(result).toContain('.gap-y-none { row-gap: 0; }');
      expect(result).toContain('.m-md { margin: 1.25rem; }');
      expect(result).toContain('.p-md { padding: 1.25rem; }');
      expect(result).toContain('.gap-md { gap: 1.25rem; }');
      expect(result).toContain('.gap-x-md { column-gap: 1.25rem; }');
      expect(result).toContain('.gap-y-md { row-gap: 1.25rem; }');
    });

    it('should include all directional classes', () => {
      const result = generateAllSpacingClasses();

      // すべての方向指定クラスが含まれているか確認
      expect(result).toContain('.mt-none { margin-top: 0; }');
      expect(result).toContain('.pt-none { padding-top: 0; }');
      expect(result).toContain('.mx-none { margin-left: 0; margin-right: 0; }');
      expect(result).toContain('.px-none { padding-left: 0; padding-right: 0; }');
      expect(result).toContain('.mt-md { margin-top: 1.25rem; }');
      expect(result).toContain('.pt-md { padding-top: 1.25rem; }');
      expect(result).toContain('.mx-md { margin-left: 1.25rem; margin-right: 1.25rem; }');
      expect(result).toContain('.px-md { padding-left: 1.25rem; padding-right: 1.25rem; }');
    });
  });
});
