import { describe, it, expect } from 'vitest';
import { generateApplyClasses } from '../apply';

describe('generateApplyClasses', () => {
  it('should generate apply classes from config', () => {
    const config = {
      'main-layout': 'w-lg mx-auto px-lg gap-x-md gap-y-lg gap-lg',
      card: 'p-md',
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
  });

  it('should handle multiple utility classes', () => {
    const config = {
      'flex-center': 'flex justify-center items-center',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('.flex-center {');
    expect(result).toContain('display: flex;');
    expect(result).toContain('justify-content: center;');
    expect(result).toContain('align-items: center;');
  });

  it('should handle directional spacing classes', () => {
    const config = {
      test: 'mx-md py-sm min-w-lg max-w-xl h-lg min-h-xl max-h-2xl',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('margin-left: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('margin-right: calc(var(--space-base) * 5);'); // md
    expect(result).toContain('padding-top: calc(var(--space-base) * 3);'); // sm
    expect(result).toContain('padding-bottom: calc(var(--space-base) * 3);'); // sm
    expect(result).toContain('min-width: calc(var(--size-base) * 3);'); // lg
    expect(result).toContain('max-width: calc(var(--size-base) * 4);'); // xl
    expect(result).toContain('height: calc(var(--size-base) * 3);'); // lg
    expect(result).toContain('min-height: calc(var(--size-base) * 4);'); // xl
    expect(result).toContain('max-height: calc(var(--size-base) * 6);'); // 2xl
  });

  it('should handle width and height custom values', () => {
    const config = {
      custom:
        'w-[200px] h-[100px] p-[20px] min-w-[300px] max-w-[400px] min-h-[200px] max-h-[300px]',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('width: 200px;');
    expect(result).toContain('height: 100px;');
    expect(result).toContain('padding: 20px;');
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

  it('should handle gap utility', () => {
    const config = {
      'gap-default': 'gap-md',
      'gap-large': 'gap-lg',
    };

    const result = generateApplyClasses(config);

    expect(result).toContain('.gap-default {');
    expect(result).toContain('gap: calc(var(--space-base) * 5);'); // gap-md
    expect(result).toContain('.gap-large {');
    expect(result).toContain('gap: calc(var(--space-base) * 8);'); // gap-lg
  });
});
