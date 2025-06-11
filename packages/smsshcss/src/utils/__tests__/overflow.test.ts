import { generateOverflowClasses } from '../overflow';
import { OverflowConfig } from '../../core/types';

describe('Overflow Utilities', () => {
  describe('generateOverflowClasses', () => {
    it('should generate basic overflow classes', () => {
      const result = generateOverflowClasses();

      // 基本的なOverflowクラス
      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result).toContain('.overflow-visible { overflow: visible; }');
      expect(result).toContain('.overflow-scroll { overflow: scroll; }');
      expect(result).toContain('.overflow-clip { overflow: clip; }');
    });

    it('should generate overflow-x classes', () => {
      const result = generateOverflowClasses();

      // Overflow-x関連のクラス
      expect(result).toContain('.overflow-x-auto { overflow-x: auto; }');
      expect(result).toContain('.overflow-x-hidden { overflow-x: hidden; }');
      expect(result).toContain('.overflow-x-visible { overflow-x: visible; }');
      expect(result).toContain('.overflow-x-scroll { overflow-x: scroll; }');
      expect(result).toContain('.overflow-x-clip { overflow-x: clip; }');
    });

    it('should generate overflow-y classes', () => {
      const result = generateOverflowClasses();

      // Overflow-y関連のクラス
      expect(result).toContain('.overflow-y-auto { overflow-y: auto; }');
      expect(result).toContain('.overflow-y-hidden { overflow-y: hidden; }');
      expect(result).toContain('.overflow-y-visible { overflow-y: visible; }');
      expect(result).toContain('.overflow-y-scroll { overflow-y: scroll; }');
      expect(result).toContain('.overflow-y-clip { overflow-y: clip; }');
    });

    it('should generate custom overflow classes when config is provided', () => {
      const customConfig = {
        'overflow-auto': 'overlay', // 既存のキーを上書き
      };

      const result = generateOverflowClasses(customConfig);

      // propertyMapに含まれているキーのみが処理される
      expect(result).toContain('.overflow-auto { overflow: overlay; }');
    });

    it('should merge custom config with default classes', () => {
      const customConfig = {};

      const result = generateOverflowClasses(customConfig);

      // デフォルトクラスが含まれる（マージされる）
      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-x-auto { overflow-x: auto; }');
      expect(result).toContain('.overflow-y-auto { overflow-y: auto; }');
    });

    it('should override default classes when custom config has same key', () => {
      const customConfig = {
        'overflow-auto': 'overlay', // デフォルトの'overflow-auto'を上書き
        'overflow-x-hidden': 'overlay', // デフォルトの'overflow-x-hidden'を上書き
      };

      const result = generateOverflowClasses(customConfig);

      // 上書きされたクラス
      expect(result).toContain('.overflow-auto { overflow: overlay; }');
      expect(result).toContain('.overflow-x-hidden { overflow-x: overlay; }');
      // その他のデフォルトクラスは残る
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result).toContain('.overflow-y-auto { overflow-y: auto; }');
    });

    it('should handle empty configuration', () => {
      const result = generateOverflowClasses({});

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('.overflow-auto { overflow: auto; }');
    });

    it('should generate all overflow variants', () => {
      const result = generateOverflowClasses();

      // すべてのバリエーションが含まれていることを確認
      const overflowValues = ['auto', 'hidden', 'visible', 'scroll', 'clip'];

      overflowValues.forEach((value) => {
        expect(result).toContain(`.overflow-${value} { overflow: ${value}; }`);
        expect(result).toContain(`.overflow-x-${value} { overflow-x: ${value}; }`);
        expect(result).toContain(`.overflow-y-${value} { overflow-y: ${value}; }`);
      });
    });

    it('should handle null configuration', () => {
      expect(() => generateOverflowClasses(null as unknown as OverflowConfig)).not.toThrow();
    });

    it('should handle undefined values in configuration', () => {
      const config = { 'valid-key': 'auto', 'invalid-key': undefined } as Record<
        string,
        string | undefined
      >;
      expect(() => generateOverflowClasses(config as OverflowConfig)).not.toThrow();
    });
  });

  describe('Property Mapping', () => {
    it('should correctly map overflow properties', () => {
      const result = generateOverflowClasses();

      // overflow プロパティのマッピング
      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
    });

    it('should correctly map overflow-x properties', () => {
      const result = generateOverflowClasses();

      // overflow-x プロパティのマッピング
      expect(result).toContain('.overflow-x-auto { overflow-x: auto; }');
      expect(result).toContain('.overflow-x-hidden { overflow-x: hidden; }');
    });

    it('should correctly map overflow-y properties', () => {
      const result = generateOverflowClasses();

      // overflow-y プロパティのマッピング
      expect(result).toContain('.overflow-y-auto { overflow-y: auto; }');
      expect(result).toContain('.overflow-y-hidden { overflow-y: hidden; }');
    });
  });

  describe('CSS Values', () => {
    it('should handle standard CSS overflow values', () => {
      const config = {
        'overflow-auto': 'auto',
        'overflow-hidden': 'hidden',
        'overflow-visible': 'visible',
        'overflow-scroll': 'scroll',
        'overflow-clip': 'clip',
      };

      const result = generateOverflowClasses(config);

      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result).toContain('.overflow-visible { overflow: visible; }');
      expect(result).toContain('.overflow-scroll { overflow: scroll; }');
      expect(result).toContain('.overflow-clip { overflow: clip; }');
    });

    it('should handle browser-specific overflow values', () => {
      const config = {
        'overflow-auto': 'overlay', // Safari/WebKit specific
      };

      const result = generateOverflowClasses(config);
      expect(result).toContain('.overflow-auto { overflow: overlay; }');
    });
  });

  describe('Use Cases', () => {
    it('should support text truncation use case', () => {
      const result = generateOverflowClasses();

      // テキスト省略用のクラス
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result).toContain('.overflow-x-hidden { overflow-x: hidden; }');
    });

    it('should support scrollable container use case', () => {
      const result = generateOverflowClasses();

      // スクロール可能コンテナ用のクラス
      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-scroll { overflow: scroll; }');
      expect(result).toContain('.overflow-y-scroll { overflow-y: scroll; }');
    });

    it('should support preventing scroll use case', () => {
      const result = generateOverflowClasses();

      // スクロール防止用のクラス
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result).toContain('.overflow-clip { overflow: clip; }');
    });

    it('should support horizontal scroll prevention', () => {
      const result = generateOverflowClasses();

      // 横スクロール防止用のクラス
      expect(result).toContain('.overflow-x-hidden { overflow-x: hidden; }');
      expect(result).toContain('.overflow-x-clip { overflow-x: clip; }');
    });

    it('should support vertical scroll prevention', () => {
      const result = generateOverflowClasses();

      // 縦スクロール防止用のクラス
      expect(result).toContain('.overflow-y-hidden { overflow-y: hidden; }');
      expect(result).toContain('.overflow-y-clip { overflow-y: clip; }');
    });
  });

  describe('Responsive Design', () => {
    it('should work with responsive modifiers (conceptual)', () => {
      const result = generateOverflowClasses();

      // レスポンシブ修飾子との組み合わせを想定
      // 実際のレスポンシブ修飾子は別のシステムで処理されるが、
      // 基本クラスが適切に生成されることを確認
      expect(result).toContain('.overflow-auto { overflow: auto; }');
      expect(result).toContain('.overflow-hidden { overflow: hidden; }');
    });
  });
});
