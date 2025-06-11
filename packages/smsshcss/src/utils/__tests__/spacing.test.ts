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
      expect(result).toContain('.m-2xs { margin: var(--space-base); }');
      expect(result).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
      expect(result).toContain('.m-5xl { margin: calc(var(--space-base) * 89); }');
    });

    it('should generate padding classes with default config', () => {
      const result = generateSpacingClasses(spacingConfig, 'padding');

      // 基本的なパディングクラスが含まれているか確認
      expect(result).toContain('.p-none { padding: 0; }');
      expect(result).toContain('.p-auto { padding: auto; }');
      expect(result).toContain('.p-2xs { padding: var(--space-base); }');
      expect(result).toContain('.p-md { padding: calc(var(--space-base) * 5); }');
      expect(result).toContain('.p-5xl { padding: calc(var(--space-base) * 89); }');
    });

    it('should generate directional classes', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

      // 方向指定のクラスが含まれているか確認
      expect(result).toContain('.mt-none { margin-top: 0; }');
      expect(result).toContain('.mt-auto { margin-top: auto; }');
      expect(result).toContain('.mr-none { margin-right: 0; }');
      expect(result).toContain('.mb-none { margin-bottom: 0; }');
      expect(result).toContain('.ml-none { margin-left: 0; }');
      expect(result).toContain('.mt-md { margin-top: calc(var(--space-base) * 5); }');
      expect(result).toContain('.mr-md { margin-right: calc(var(--space-base) * 5); }');
      expect(result).toContain('.mb-md { margin-bottom: calc(var(--space-base) * 5); }');
      expect(result).toContain('.ml-md { margin-left: calc(var(--space-base) * 5); }');
    });

    it('should generate x and y directional classes', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

      // x, y方向のクラスが含まれているか確認
      expect(result).toContain('.mx-none { margin-left: 0; margin-right: 0; }');
      expect(result).toContain('.my-none { margin-top: 0; margin-bottom: 0; }');
      expect(result).toContain('.my-auto { margin-top: auto; margin-bottom: auto; }');
      expect(result).toContain(
        '.mx-md { margin-left: calc(var(--space-base) * 5); margin-right: calc(var(--space-base) * 5); }'
      );
      expect(result).toContain(
        '.my-md { margin-top: calc(var(--space-base) * 5); margin-bottom: calc(var(--space-base) * 5); }'
      );
    });

    it('should include arbitrary value classes', () => {
      const result = generateSpacingClasses(spacingConfig, 'margin');

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
      const result = generateGapClasses(spacingConfig);

      // 基本的なギャップクラスが含まれているか確認
      expect(result).toContain('.gap-none { gap: 0; }');
      expect(result).toContain('.gap-auto { gap: auto; }');
      expect(result).toContain('.gap-2xs { gap: var(--space-base); }');
      expect(result).toContain('.gap-md { gap: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-5xl { gap: calc(var(--space-base) * 89); }');
    });

    it('should generate gap-x (column-gap) classes with default config', () => {
      const result = generateGapClasses(spacingConfig);

      // gap-x (column-gap) クラスが含まれているか確認
      expect(result).toContain('.gap-x-none { column-gap: 0; }');
      expect(result).toContain('.gap-x-auto { column-gap: auto; }');
      expect(result).toContain('.gap-x-2xs { column-gap: var(--space-base); }');
      expect(result).toContain('.gap-x-md { column-gap: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-x-lg { column-gap: calc(var(--space-base) * 8); }');
      expect(result).toContain('.gap-x-5xl { column-gap: calc(var(--space-base) * 89); }');
    });

    it('should generate gap-y (row-gap) classes with default config', () => {
      const result = generateGapClasses(spacingConfig);

      // gap-y (row-gap) クラスが含まれているか確認
      expect(result).toContain('.gap-y-none { row-gap: 0; }');
      expect(result).toContain('.gap-y-auto { row-gap: auto; }');
      expect(result).toContain('.gap-y-2xs { row-gap: var(--space-base); }');
      expect(result).toContain('.gap-y-md { row-gap: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-y-lg { row-gap: calc(var(--space-base) * 8); }');
      expect(result).toContain('.gap-y-5xl { row-gap: calc(var(--space-base) * 89); }');
    });

    it('should include arbitrary gap value classes', () => {
      const result = generateGapClasses(spacingConfig);

      // 任意の値のギャップクラスが含まれているか確認
      expect(result).toContain('.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }');
      expect(result).toContain('.gap-x-\\[\\$\\{value\\}\\] { column-gap: var(--value); }');
      expect(result).toContain('.gap-y-\\[\\$\\{value\\}\\] { row-gap: var(--value); }');
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
      expect(result).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
      expect(result).toContain('.p-md { padding: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-md { gap: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-x-md { column-gap: calc(var(--space-base) * 5); }');
      expect(result).toContain('.gap-y-md { row-gap: calc(var(--space-base) * 5); }');
    });

    it('should include all directional classes', () => {
      const result = generateAllSpacingClasses();

      // すべての方向指定クラスが含まれているか確認
      expect(result).toContain('.mt-none { margin-top: 0; }');
      expect(result).toContain('.pt-none { padding-top: 0; }');
      expect(result).toContain('.mx-none { margin-left: 0; margin-right: 0; }');
      expect(result).toContain('.px-none { padding-left: 0; padding-right: 0; }');
      expect(result).toContain('.mt-md { margin-top: calc(var(--space-base) * 5); }');
      expect(result).toContain('.pt-md { padding-top: calc(var(--space-base) * 5); }');
      expect(result).toContain(
        '.mx-md { margin-left: calc(var(--space-base) * 5); margin-right: calc(var(--space-base) * 5); }'
      );
      expect(result).toContain(
        '.px-md { padding-left: calc(var(--space-base) * 5); padding-right: calc(var(--space-base) * 5); }'
      );
    });

    it('should include all arbitrary value classes', () => {
      const result = generateAllSpacingClasses();

      // すべての任意の値クラスが含まれているか確認
      expect(result).toContain('.m-\\[\\$\\{value\\}\\] { margin: var(--value); }');
      expect(result).toContain('.p-\\[\\$\\{value\\}\\] { padding: var(--value); }');
      expect(result).toContain('.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }');
      expect(result).toContain('.gap-x-\\[\\$\\{value\\}\\] { column-gap: var(--value); }');
      expect(result).toContain('.gap-y-\\[\\$\\{value\\}\\] { row-gap: var(--value); }');
    });
  });
});
