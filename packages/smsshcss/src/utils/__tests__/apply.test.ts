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

  it('should handle directional spacing values', () => {
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
    expect(result).toContain('padding-block-end: 2rem;'); // sm
  });

  it('should handle width and height values', () => {
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

    expect(result).toContain('width: 2.5rem;');
    expect(result).toContain('min-width: 3rem;');
    expect(result).toContain('max-width: 96rem;');
    expect(result).toContain('height: 2rem;');
    expect(result).toContain('min-height: 4rem;');
    expect(result).toContain('max-height: 6rem;');
    expect(result).toContain('width: 200px;');
    expect(result).toContain('height: 100px;');
    expect(result).toContain('min-width: 300px;');
    expect(result).toContain('max-width: 400px;');
    expect(result).toContain('min-height: 200px;');
    expect(result).toContain('max-height: 300px;');
    expect(result).toContain('width: var(--width);');
    expect(result).toContain('height: var(--height);');
    expect(result).toContain('min-width: var(--min-width);');
    expect(result).toContain('max-width: var(--max-width);');
    expect(result).toContain('min-height: var(--min-height);');
    expect(result).toContain('max-height: var(--max-height);');
    expect(result).toContain('width: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('height: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('min-width: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('max-width: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('min-height: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('max-height: clamp(2rem, 5vw, 4rem);');
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

    expect(result).toContain('flex-basis: 2rem;'); // sm
    expect(result).toContain('flex-basis: 2.5rem;'); // md
    expect(result).toContain('flex-basis: 3rem;'); // lg
    expect(result).toContain('flex-basis: 20px;');
    expect(result).toContain('flex-basis: clamp(2rem, 5vw, 4rem);');
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

  it('should handle flex grow custom values', () => {
    const config = {
      'flex-grow-main': 'grow',
      'flex-grow-custom-numeric': 'grow-[20] grow-[50px]',
      'flex-grow-custom-template': 'grow-[var(--grow)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex-grow: 1;');
    expect(result).toContain('flex-grow: 20;');
    expect(result).toContain('flex-grow: 50px;');
    expect(result).toContain('flex-grow: var(--grow);');
  });

  it('should handle flex shrink custom values', () => {
    const config = {
      'flex-shrink-main': 'shrink',
      'flex-shrink-custom-numeric':
        'shrink-[20] shrink-[50px] shrink-[calc(100px-50px)] shrink-[clamp(2rem,5vw,4rem)]',
      'flex-shrink-custom-template': 'shrink-[var(--shrink)]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex-shrink: 1;');
    expect(result).toContain('flex-shrink: 20;');
    expect(result).toContain('flex-shrink: 50px;');
    expect(result).toContain('flex-shrink: calc(100px - 50px);');
    expect(result).toContain('flex-shrink: clamp(2rem, 5vw, 4rem);');
    expect(result).toContain('flex-shrink: var(--shrink);');
  });

  it('should handle flex wrap custom values', () => {
    const config = {
      'flex-wrap-main': 'flex-wrap flex-wrap-reverse flex-nowrap',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('flex-wrap: wrap;');
    expect(result).toContain('flex-wrap: wrap-reverse;');
    expect(result).toContain('flex-wrap: nowrap;');
  });

  it('should handle font-size custom values', () => {
    const config = {
      'font-size-main':
        'font-size-[clamp(1rem,4vw,3rem)] font-size-[max(20px,2rem)] font-size-[min(1rem,3vw)] font-size-2xl font-size-[55px]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('font-size: clamp(1rem, 4vw, 3rem);');
    expect(result).toContain('font-size: max(20px, 2rem);');
    expect(result).toContain('font-size: min(1rem, 3vw);');
    expect(result).toContain('font-size: 2rem;');
    expect(result).toContain('font-size: 55px;');
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
    expect(result).toContain('width: 2.5rem;'); // md
  });
});
