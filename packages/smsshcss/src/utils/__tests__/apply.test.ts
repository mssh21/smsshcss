import { describe, it, expect } from 'vitest';
import { generateApplyClasses } from '../apply';

describe('generateApplyClasses', () => {
  it('should generate apply classes from config', () => {
    const config = {
      'main-layout': 'w-lg mx-auto px-lg gap-x-md gap-y-lg gap-lg',
      card: 'p-md',
      'section-layout': 'block inline-flex grid inline-grid table table-cell table-row',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('.main-layout {');
    expect(result).toContain('width: calc(var(--size-base) * 3);'); // lg
    expect(result).toContain('margin-left: auto;');
    expect(result).toContain('margin-right: auto;');
    expect(result).toContain('padding-left: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('padding-right: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('column-gap: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('row-gap: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('gap: calc(var(--space-base) * 8);'); // lg

    expect(result).toContain('.card {');
    expect(result).toContain('padding: calc(var(--space-base) * 5);'); // md

    expect(result).toContain('.section-layout {');
    expect(result).toContain('display: block;');
    expect(result).toContain('display: inline-flex;');
    expect(result).toContain('display: grid;');
    expect(result).toContain('display: inline-grid;');
    expect(result).toContain('display: table;');
    expect(result).toContain('display: table-cell;');
    expect(result).toContain('display: table-row;');
  });

  it('should handle directional spacing values', () => {
    const config = {
      test: 'm-md mx-md my-lg mt-sm mb-xl p-md px-lg py-sm pt-md pb-lg',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('margin: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('margin-left: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('margin-right: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('margin-top: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('margin-bottom: calc(var(--space-base) * 13);'); // xl
    expect(result).toContain('padding: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('padding-left: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('padding-right: calc(var(--space-base) * 8);'); // lg
    expect(result).toContain('padding-top: calc(var(--space-base) * 3);'); // sm
    expect(result).toContain('padding-bottom: calc(var(--space-base) * 3);'); // sm
  });

  it('should handle width and height values', () => {
    const config = {
      'width-custom': 'w-md min-w-lg max-w-12xl',
      'height-custom': 'h-sm min-h-xl max-h-2xl',
      custom: 'w-[200px] h-[100px] min-w-[300px] max-w-[400px] min-h-[200px] max-h-[300px]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('width: calc(var(--size-base) * 2.5);');
    expect(result).toContain('min-width: calc(var(--size-base) * 3);');
    expect(result).toContain('max-width: calc(var(--size-base) * 96);');
    expect(result).toContain('height: calc(var(--size-base) * 2);');
    expect(result).toContain('min-height: calc(var(--size-base) * 4);');
    expect(result).toContain('max-height: calc(var(--size-base) * 6);');
    expect(result).toContain('width: 200px;');
    expect(result).toContain('height: 100px;');
    expect(result).toContain('min-width: 300px;');
    expect(result).toContain('max-width: 400px;');
    expect(result).toContain('min-height: 200px;');
    expect(result).toContain('max-height: 300px;');
  });

  it('should handle spacing custom values', () => {
    const config = {
      custom: 'm-[20px] p-[20px] gap-[20px] gap-x-[20px] gap-y-[20px]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('margin: 20px;');
    expect(result).toContain('padding: 20px;');
    expect(result).toContain('gap: 20px;');
    expect(result).toContain('column-gap: 20px;');
    expect(result).toContain('row-gap: 20px;');
  });

  it('should handle grid columns custom values', () => {
    const config = {
      'grid-basic': 'grid-cols-3 grid-cols-12',
      'grid-custom-numeric': 'grid-cols-[20]',
      'grid-custom-template': 'grid-cols-[1fr,100px,4fr]',
    };

    const result = generateApplyClasses(config);

    // 基本的なgrid-cols
    expect(result).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
    expect(result).toContain('grid-template-columns: repeat(12, minmax(0, 1fr));');

    // 数値のカスタム値
    expect(result).toContain('grid-template-columns: repeat(20, minmax(0, 1fr));');

    // テンプレートのカスタム値（カンマがスペースに変換される）
    expect(result).toContain('grid-template-columns: 1fr 100px 4fr;');
  });

  it('should handle grid rows custom values', () => {
    const config = {
      'grid-rows-basic': 'grid-rows-3 grid-rows-12',
      'grid-rows-custom-numeric': 'grid-rows-[20]',
      'grid-rows-custom-template': 'grid-rows-[1fr,100px,4fr]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('grid-template-rows: repeat(3, minmax(0, 1fr));');
    expect(result).toContain('grid-template-rows: repeat(12, minmax(0, 1fr));');
    expect(result).toContain('grid-template-rows: repeat(20, minmax(0, 1fr));');
    expect(result).toContain('grid-template-rows: 1fr 100px 4fr;');
  });

  it('should handle grid column span custom values', () => {
    const config = {
      'col-span-main': 'col-span-3 col-span-12',
      'col-span-custom-numeric': 'col-span-[20]',
      'col-span-custom-template': 'col-span-[var(--col-span)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('grid-column: span 3 / span 3;');
    expect(result).toContain('grid-column: span 12 / span 12;');
    expect(result).toContain('grid-column: span 20 / span 20;');
    expect(result).toContain('grid-column: span var(--col-span) / span var(--col-span);');
  });

  it('should handle grid row span custom values', () => {
    const config = {
      'row-span-main': 'row-span-3 row-span-12',
      'row-span-custom-numeric': 'row-span-[20]',
      'row-span-custom-template': 'row-span-[var(--row-span)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('grid-row: span 3 / span 3;');
    expect(result).toContain('grid-row: span 12 / span 12;');
    expect(result).toContain('grid-row: span 20 / span 20;');
    expect(result).toContain('grid-row: span var(--row-span) / span var(--row-span);');
  });

  it('should handle grid column position custom values', () => {
    const config = {
      'col-start-main': 'col-start-3 col-start-12',
      'col-start-custom-numeric': 'col-start-[20]',
      'col-start-custom-template': 'col-start-[var(--col-start)]',
      'col-end-main': 'col-end-3 col-end-12',
      'col-end-custom-numeric': 'col-end-[20]',
      'col-end-custom-template': 'col-end-[var(--col-end)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('grid-column-start: 3;');
    expect(result).toContain('grid-column-start: 12;');
    expect(result).toContain('grid-column-start: 20;');
    expect(result).toContain('grid-column-start: var(--col-start);');
    expect(result).toContain('grid-column-end: 3;');
    expect(result).toContain('grid-column-end: 12;');
    expect(result).toContain('grid-column-end: 20;');
    expect(result).toContain('grid-column-end: var(--col-end);');
  });

  it('should handle grid row position custom values', () => {
    const config = {
      'row-start-main': 'row-start-3 row-start-12',
      'row-start-custom-numeric': 'row-start-[20]',
      'row-start-custom-template': 'row-start-[var(--row-start)]',
      'row-end-main': 'row-end-3 row-end-12',
      'row-end-custom-numeric': 'row-end-[20]',
      'row-end-custom-template': 'row-end-[var(--row-end)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('grid-row-start: 3;');
    expect(result).toContain('grid-row-start: 12;');
    expect(result).toContain('grid-row-start: 20;');
    expect(result).toContain('grid-row-start: var(--row-start);');
    expect(result).toContain('grid-row-end: 3;');
    expect(result).toContain('grid-row-end: 12;');
    expect(result).toContain('grid-row-end: 20;');
    expect(result).toContain('grid-row-end: var(--row-end);');
  });

  it('should handle flex align custom values', () => {
    const config = {
      'align-items-main': 'items-start items-end items-center items-baseline items-stretch',
      'align-content-main':
        'content-start content-end content-center content-between content-around content-evenly',
      'align-self-main': 'self-auto self-start self-end self-center self-stretch',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('align-items: flex-start;');
    expect(result).toContain('align-items: flex-end;');
    expect(result).toContain('align-items: center;');
    expect(result).toContain('align-items: baseline;');
    expect(result).toContain('align-items: stretch;');
    expect(result).toContain('align-content: flex-start;');
    expect(result).toContain('align-content: flex-end;');
    expect(result).toContain('align-content: center;');
    expect(result).toContain('align-content: space-between;');
    expect(result).toContain('align-content: space-around;');
    expect(result).toContain('align-content: space-evenly;');
    expect(result).toContain('align-self: auto;');
    expect(result).toContain('align-self: flex-start;');
    expect(result).toContain('align-self: flex-end;');
    expect(result).toContain('align-self: center;');
    expect(result).toContain('align-self: stretch;');
  });

  it('should handle flex basis custom values', () => {
    const config = {
      'basis-main': 'basis-sm basis-md basis-lg',
      'basis-custom-numeric': 'basis-[20px] basis-[clamp(2rem,5vw,4rem)]',
      'basis-custom-template': 'basis-[var(--basis)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex-basis: calc(var(--size-base) * 2);'); // sm
    expect(result).toContain('flex-basis: calc(var(--size-base) * 2.5);'); // md
    expect(result).toContain('flex-basis: calc(var(--size-base) * 3);'); // lg
    expect(result).toContain('flex-basis: 20px;');
    expect(result).toContain('flex-basis: clamp(2rem,5vw,4rem);');
    expect(result).toContain('flex-basis: var(--basis);');
  });

  it('should handle flex direction custom values', () => {
    const config = {
      'flex-direction-main': 'flex-row flex-col flex-row-reverse flex-col-reverse',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex-direction: row;');
    expect(result).toContain('flex-direction: column;');
    expect(result).toContain('flex-direction: row-reverse;');
    expect(result).toContain('flex-direction: column-reverse;');
  });

  it('should handle flex custom values', () => {
    const config = {
      'flex-item': 'flex-auto flex-initial flex-none',
      'flex-custom-numeric': 'flex-[20]',
      'flex-custom-template': 'flex-[var(--flex)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex: 1 1 auto;');
    expect(result).toContain('flex: 0 1 auto;');
    expect(result).toContain('flex: none;');
    expect(result).toContain('flex: 20;');
    expect(result).toContain('flex: var(--flex);');
  });

  it('should return empty string for undefined config', () => {
    const result = generateApplyClasses(undefined);
    expect(result).toBe('');
  });

  it('should skip apply entries with no utility classes', () => {
    const config = {
      empty: '',
      spaces: '   ',
    };

    const result = generateApplyClasses(config);
    expect(result).toBe('');
  });

  it('should handle unknown utility classes gracefully', () => {
    const config = {
      test: 'unknown-class valid-class w-md',
    };

    const result = generateApplyClasses(config);

    // unknown-classは無視される
    expect(result).not.toContain('unknown-class');
    // 有効なクラスは処理される
    expect(result).toContain('width: calc(var(--size-base) * 2.5);'); // md
  });
});
