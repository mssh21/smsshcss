import { describe, it, expect } from 'vitest';
import { generateApplyClasses } from '../apply-plugins';

/**
 * Apply統合テスト
 * 新しいプラグインシステムが旧来のAPIと完全に互換性を持つことを検証
 */
describe('Apply Integration Tests - Plugin System Compatibility', () => {
  describe('基本的なユーティリティクラス処理', () => {
    it('複合的なレイアウトクラスを正しく処理する', () => {
      const config = {
        'main-layout': 'w-lg mx-auto px-lg gap-x-md gap-y-lg gap-lg',
        card: 'p-md',
        'section-layout': 'block inline-flex grid inline-grid table table-cell table-row',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.main-layout {');
      expect(result).toContain('width: 3rem;'); // lg
      expect(result).toContain('margin-inline: auto;');
      expect(result).toContain('padding-inline: 2rem;'); // lg
      expect(result).toContain('column-gap: 1.25rem;'); // md
      expect(result).toContain('row-gap: 2rem;'); // lg
      expect(result).toContain('gap: 2rem;'); // lg

      expect(result).toContain('.card {');
      expect(result).toContain('padding: 1.25rem;'); // md

      expect(result).toContain('.section-layout {');
      expect(result).toContain('display: block;');
      expect(result).toContain('display: inline-flex;');
      expect(result).toContain('display: grid;');
      expect(result).toContain('display: inline-grid;');
      expect(result).toContain('display: table;');
      expect(result).toContain('display: table-cell;');
      expect(result).toContain('display: table-row;');
    });
  });

  describe('方向指定スペーシング', () => {
    it('すべてのスペーシング方向を正しく処理する', () => {
      const config = {
        test: 'm-md mx-md my-lg mt-sm mb-xl p-md px-lg py-sm pt-md pb-lg',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('margin: 1.25rem;'); // md
      expect(result).toContain('margin-inline: 1.25rem;'); // md
      expect(result).toContain('margin-block: 2rem;'); // lg
      expect(result).toContain('margin-block-start: 0.75rem;'); // sm
      expect(result).toContain('margin-block-end: 3.25rem;'); // xl
      expect(result).toContain('padding: 1.25rem;'); // md
      expect(result).toContain('padding-inline: 2rem;'); // lg
      expect(result).toContain('padding-block: 0.75rem;'); // sm
      expect(result).toContain('padding-block-start: 1.25rem;'); // md
      expect(result).toContain('padding-block-end: 2rem;'); // lg
    });
  });

  describe('サイズとカスタム値', () => {
    it('幅・高さとカスタム値を正しく処理する', () => {
      const config = {
        'width-custom': 'w-md min-w-lg max-w-12xl',
        'height-custom': 'h-sm min-h-xl max-h-2xl',
        custom: 'w-[200px] h-[100px] min-w-[300px] max-w-[400px] min-h-[200px] max-h-[300px]',
        'custom-template':
          'w-[var(--width)] h-[var(--height)] min-w-[var(--min-width)] max-w-[var(--max-width)] min-h-[var(--min-height)] max-h-[var(--max-height)]',
        'custom-function':
          'w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)] min-w-[clamp(2rem,5vw,4rem)] max-w-[clamp(2rem,5vw,4rem)] min-h-[clamp(2rem,5vw,4rem)] max-h-[clamp(2rem,5vw,4rem)]',
      };

      const result = generateApplyClasses(config);

      // 基本サイズ
      expect(result).toContain('width: 2.5rem;');
      expect(result).toContain('min-width: 3rem;');
      expect(result).toContain('max-width: 96rem;');
      expect(result).toContain('height: 2rem;');
      expect(result).toContain('min-height: 4rem;');
      expect(result).toContain('max-height: 6rem;');

      // カスタム値
      expect(result).toContain('width: 200px;');
      expect(result).toContain('height: 100px;');
      expect(result).toContain('min-width: 300px;');
      expect(result).toContain('max-width: 400px;');
      expect(result).toContain('min-height: 200px;');
      expect(result).toContain('max-height: 300px;');

      // CSS変数
      expect(result).toContain('width: var(--width);');
      expect(result).toContain('height: var(--height);');
      expect(result).toContain('min-width: var(--min-width);');
      expect(result).toContain('max-width: var(--max-width);');
      expect(result).toContain('min-height: var(--min-height);');
      expect(result).toContain('max-height: var(--max-height);');

      // CSS関数
      expect(result).toContain('width: clamp(2rem, 5vw, 4rem);');
      expect(result).toContain('height: clamp(2rem, 5vw, 4rem);');
      expect(result).toContain('min-width: clamp(2rem, 5vw, 4rem);');
      expect(result).toContain('max-width: clamp(2rem, 5vw, 4rem);');
      expect(result).toContain('min-height: clamp(2rem, 5vw, 4rem);');
      expect(result).toContain('max-height: clamp(2rem, 5vw, 4rem);');
    });
  });

  describe('Flexboxの包括的テスト', () => {
    it('Flexboxアライメントを正しく処理する', () => {
      const config = {
        'align-items-test': 'items-start items-end items-center items-baseline items-stretch',
        'align-content-test':
          'content-start content-end content-center content-between content-around content-evenly',
        'align-self-test': 'self-auto self-start self-end self-center self-stretch',
      };

      const result = generateApplyClasses(config);

      // Align Items
      expect(result).toContain('align-items: flex-start;');
      expect(result).toContain('align-items: flex-end;');
      expect(result).toContain('align-items: center;');
      expect(result).toContain('align-items: baseline;');
      expect(result).toContain('align-items: stretch;');

      // Align Content
      expect(result).toContain('align-content: flex-start;');
      expect(result).toContain('align-content: flex-end;');
      expect(result).toContain('align-content: center;');
      expect(result).toContain('align-content: space-between;');
      expect(result).toContain('align-content: space-around;');
      expect(result).toContain('align-content: space-evenly;');

      // Align Self
      expect(result).toContain('align-self: auto;');
      expect(result).toContain('align-self: flex-start;');
      expect(result).toContain('align-self: flex-end;');
      expect(result).toContain('align-self: center;');
      expect(result).toContain('align-self: stretch;');
    });

    it('Flexプロパティとカスタム値を正しく処理する', () => {
      const config = {
        'flex-basic': 'flex-auto flex-initial flex-none',
        'flex-direction': 'flex-row flex-col flex-row-reverse flex-col-reverse',
        'flex-wrap': 'flex-wrap flex-wrap-reverse flex-nowrap',
        'flex-basis': 'basis-sm basis-md basis-lg basis-[20px] basis-[var(--basis)]',
        'flex-grow': 'grow grow-[20] grow-[var(--grow)]',
        'flex-shrink': 'shrink shrink-[20] shrink-[var(--shrink)]',
      };

      const result = generateApplyClasses(config);

      // Flex shorthand
      expect(result).toContain('flex: 1 1 auto;');
      expect(result).toContain('flex: 0 1 auto;');
      expect(result).toContain('flex: none;');

      // Flex direction
      expect(result).toContain('flex-direction: row;');
      expect(result).toContain('flex-direction: column;');
      expect(result).toContain('flex-direction: row-reverse;');
      expect(result).toContain('flex-direction: column-reverse;');

      // Flex wrap
      expect(result).toContain('flex-wrap: wrap;');
      expect(result).toContain('flex-wrap: wrap-reverse;');
      expect(result).toContain('flex-wrap: nowrap;');

      // Flex basis
      expect(result).toContain('flex-basis: 2rem;'); // sm
      expect(result).toContain('flex-basis: 2.5rem;'); // md
      expect(result).toContain('flex-basis: 3rem;'); // lg
      expect(result).toContain('flex-basis: 20px;');
      expect(result).toContain('flex-basis: var(--basis);');

      // Flex grow/shrink
      expect(result).toContain('flex-grow: 1;');
      expect(result).toContain('flex-grow: 20;');
      expect(result).toContain('flex-grow: var(--grow);');
      expect(result).toContain('flex-shrink: 1;');
      expect(result).toContain('flex-shrink: 20;');
      expect(result).toContain('flex-shrink: var(--shrink);');
    });
  });

  describe('エラーハンドリング', () => {
    it('undefined configに対して空文字を返す', () => {
      const result = generateApplyClasses(undefined);
      expect(result).toBe('');
    });

    it('空のユーティリティクラスを無視する', () => {
      const config = {
        empty: '',
        spaces: '   ',
        valid: 'm-md',
      };

      const result = generateApplyClasses(config);
      expect(result).not.toContain('empty');
      expect(result).not.toContain('spaces');
      expect(result).toContain('margin: 1.25rem;'); // valid case
    });

    it('未知のユーティリティクラスを適切に処理する', () => {
      const config = {
        test: 'unknown-class w-md valid-class',
      };

      const result = generateApplyClasses(config);

      // 未知のクラスは無視される
      expect(result).not.toContain('unknown-class');
      expect(result).not.toContain('valid-class');
      // 有効なクラスは処理される
      expect(result).toContain('width: 2.5rem;'); // md
    });
  });

  describe('実世界のユースケース', () => {
    it('複雑なコンポーネント設計パターンを処理する', () => {
      const config = {
        'card-component': 'flex flex-col p-md m-md bg-white text-gray-800 w-full max-w-md',
        'button-primary':
          'inline-flex items-center justify-center px-md py-sm bg-blue-500 text-white',
        'grid-layout': 'grid grid-cols-12 gap-md min-h-svh',
        'responsive-text': 'text-[clamp(1rem,4vw,3rem)] font-size-[60px]',
      };

      const result = generateApplyClasses(config);

      // Card component
      expect(result).toContain('.card-component');
      expect(result).toContain('display: flex;');
      expect(result).toContain('flex-direction: column;');
      expect(result).toContain('padding: 1.25rem;');
      expect(result).toContain('margin: 1.25rem;');
      expect(result).toContain('width: 100%;');

      // Button component
      expect(result).toContain('.button-primary');
      expect(result).toContain('display: inline-flex;');
      expect(result).toContain('align-items: center;');
      expect(result).toContain('justify-content: center;');

      // Grid layout
      expect(result).toContain('.grid-layout');
      expect(result).toContain('display: grid;');
      expect(result).toContain('grid-template-columns: repeat(12, minmax(0, 1fr));');
      expect(result).toContain('gap: 1.25rem;');
      expect(result).toContain('min-height: 100svh;');

      // Responsive text
      expect(result).toContain('.responsive-text');
      expect(result).toContain('font-size: 60px;');
    });
  });
});
