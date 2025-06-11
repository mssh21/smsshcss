import { CSSGenerator } from '../core/generator';
import { SmsshCSSConfig } from '../core/types';

describe('Apply Support - Detailed Tests', () => {
  describe('Apply Configuration', () => {
    it('should generate apply classes from utility combinations', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'main-layout': 'w-lg mx-auto px-lg block',
          card: 'p-md',
          btn: 'inline-block px-md py-sm',
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // applyクラスが生成されていることを確認
      expect(css).toContain('.main-layout {');
      expect(css).toContain('width: calc(var(--size-base) * 3);'); // lg = 3rem
      expect(css).toContain('margin-left: auto;');
      expect(css).toContain('margin-right: auto;');
      expect(css).toContain('padding-left: calc(var(--space-base) * 8);'); // lg
      expect(css).toContain('padding-right: calc(var(--space-base) * 8);'); // lg
      expect(css).toContain('display: block;');

      expect(css).toContain('.card {');
      expect(css).toContain('padding: calc(var(--space-base) * 5);'); // md

      expect(css).toContain('.btn {');
      expect(css).toContain('display: inline-block;');
      expect(css).toContain('padding-left: calc(var(--space-base) * 5);'); // md
      expect(css).toContain('padding-right: calc(var(--space-base) * 5);'); // md
      expect(css).toContain('padding-top: calc(var(--space-base) * 3);'); // sm
      expect(css).toContain('padding-bottom: calc(var(--space-base) * 3);'); // sm
    });

    it('should handle complex utility combinations', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'flex-center': 'flex justify-center items-center',
          'absolute-center': 'absolute top-1/2 left-1/2',
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // Flexboxユーティリティの組み合わせ
      expect(css).toContain('.flex-center {');
      expect(css).toContain('display: flex;');
      expect(css).toContain('justify-content: center;');
      expect(css).toContain('align-items: center;');
    });

    it('should handle apply with custom values', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          'custom-size': 'w-[200px] h-[100px] p-[20px]',
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム値を持つapply
      expect(css).toContain('.custom-size {');
      expect(css).toContain('width: 200px;');
      expect(css).toContain('height: 100px;');
      expect(css).toContain('padding: 20px;');
    });

    it('should ignore unknown utility classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {
          mixed: 'unknown-class w-md valid-class',
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // 有効なクラスのみが処理される
      expect(css).toContain('.mixed {');
      expect(css).toContain('width: calc(var(--size-base) * 2.5);'); // md
      expect(css).not.toContain('unknown-class');
    });

    it('should handle empty apply configuration', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        apply: {},
      };

      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      const css = generator.generateFullCSSSync();
      expect(css).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined apply configuration', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
      };

      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      const css = generator.generateFullCSSSync();
      expect(css).toBeTruthy();

      // デフォルトクラスが生成されていることを確認
      expect(css).toContain('.m-xs');
      expect(css).toContain('.w-full');
      expect(css).toContain('.h-full');
    });
  });
});
