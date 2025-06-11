import { describe, it, expect } from 'vitest';
import { generateComponentClasses } from '../components';

describe('generateComponentClasses', () => {
  it('should generate component classes from config', () => {
    const config = {
      'main-layout': 'w-lg mx-auto px-lg block',
      card: 'p-md',
    };

    const result = generateComponentClasses(config);

    expect(result).toContain('.main-layout {');
    expect(result).toContain('width: 1.5rem;');
    expect(result).toContain('margin-left: auto;');
    expect(result).toContain('margin-right: auto;');
    expect(result).toContain('padding-left: 1.5rem;');
    expect(result).toContain('padding-right: 1.5rem;');
    expect(result).toContain('display: block;');

    expect(result).toContain('.card {');
    expect(result).toContain('padding: 1rem;');
  });

  it('should handle multiple utility classes', () => {
    const config = {
      'flex-center': 'flex justify-center items-center',
    };

    const result = generateComponentClasses(config);

    expect(result).toContain('.flex-center {');
    expect(result).toContain('display: flex;');
    expect(result).toContain('justify-content: center;');
    expect(result).toContain('align-items: center;');
  });

  it('should handle directional spacing classes', () => {
    const config = {
      test: 'mx-md py-sm',
    };

    const result = generateComponentClasses(config);

    expect(result).toContain('margin-left: 1rem;');
    expect(result).toContain('margin-right: 1rem;');
    expect(result).toContain('padding-top: 0.5rem;');
    expect(result).toContain('padding-bottom: 0.5rem;');
  });

  it('should handle custom values', () => {
    const config = {
      custom: 'w-[200px] h-[100px] p-[20px]',
    };

    const result = generateComponentClasses(config);

    expect(result).toContain('width: 200px;');
    expect(result).toContain('height: 100px;');
    expect(result).toContain('padding: 20px;');
  });

  it('should return empty string for undefined config', () => {
    const result = generateComponentClasses(undefined);
    expect(result).toBe('');
  });

  it('should skip components with no utility classes', () => {
    const config = {
      empty: '',
      spaces: '   ',
    };

    const result = generateComponentClasses(config);
    expect(result).toBe('');
  });

  it('should handle unknown utility classes gracefully', () => {
    const config = {
      test: 'unknown-class valid-class w-md',
    };

    const result = generateComponentClasses(config);

    // unknown-classは無視される
    expect(result).not.toContain('unknown-class');
    // 有効なクラスは処理される
    expect(result).toContain('width: 1rem;');
  });

  it('should use custom theme values', () => {
    const config = {
      'custom-component': 'p-custom m-custom w-sidebar h-header',
    };

    const themeConfig = {
      spacing: {
        custom: '2.5rem',
      },
      width: {
        sidebar: '280px',
      },
      height: {
        header: '64px',
      },
    };

    const result = generateComponentClasses(config, themeConfig);

    expect(result).toContain('.custom-component {');
    expect(result).toContain('padding: 2.5rem;');
    expect(result).toContain('margin: 2.5rem;');
    expect(result).toContain('width: 280px;');
    expect(result).toContain('height: 64px;');
  });

  it('should handle gap utility', () => {
    const config = {
      'gap-default': 'gap-md',
      'gap-custom': 'gap-custom',
    };

    const themeConfig = {
      spacing: {
        custom: '3rem',
      },
    };

    const result = generateComponentClasses(config, themeConfig);

    expect(result).toContain('.gap-default {');
    expect(result).toContain('gap: 1rem;'); // gap-md
    expect(result).toContain('.gap-custom {');
    expect(result).toContain('gap: 3rem;'); // gap-custom
  });
});
