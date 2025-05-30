import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { smsshcss } from '../index';

describe('SmsshCSS Vite Plugin - Utility Classes Generation', () => {
  let plugin: ReturnType<typeof smsshcss>;
  let result: Awaited<ReturnType<typeof plugin.transform>>;

  beforeAll(async () => {
    const plugin = smsshcss();
    result = await plugin.transform('/* test css */', 'test.css');

    // デバッグ: 実際に生成されているCSSを出力
    console.log('=== Generated CSS Debug ===');
    console.log(result?.code?.substring(0, 2000) || 'No CSS generated');
    console.log('=== End Debug ===');
  });

  beforeEach(async () => {
    plugin = smsshcss();
    result = await plugin.transform('', 'file.css');
  });

  describe('Spacing Classes', () => {
    it('should generate margin classes', () => {
      expect(result?.code).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.mt-lg { margin-top: calc(var(--space-base) * 8); }');
      expect(result?.code).toContain(
        '.mx-sm { margin-left: calc(var(--space-base) * 3); margin-right: calc(var(--space-base) * 3); }'
      );
    });

    it('should generate padding classes', () => {
      expect(result?.code).toContain('.p-md { padding: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.pt-lg { padding-top: calc(var(--space-base) * 8); }');
      expect(result?.code).toContain(
        '.px-sm { padding-left: calc(var(--space-base) * 3); padding-right: calc(var(--space-base) * 3); }'
      );
    });

    it('should generate gap classes', () => {
      expect(result?.code).toContain('.gap-md { gap: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.gap-x-md { column-gap: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.gap-y-md { row-gap: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.gap-x-lg { column-gap: calc(var(--space-base) * 8); }');
      expect(result?.code).toContain('.gap-y-lg { row-gap: calc(var(--space-base) * 8); }');
    });
  });

  describe('Display Classes', () => {
    it('should generate display utility classes', () => {
      expect(result?.code).toContain('.flex { display: flex; }');
      expect(result?.code).toContain('.grid { display: grid; }');
    });
  });

  describe('Width Classes', () => {
    it('should generate width utility classes', () => {
      expect(result?.code).toContain('.w-2xs { width: var(--size-base); }');
      expect(result?.code).toContain('.w-xs { width: calc(var(--size-base) * 1.5); }');
      expect(result?.code).toContain('.w-sm { width: calc(var(--size-base) * 2); }');
      expect(result?.code).toContain('.w-md { width: calc(var(--size-base) * 2.5); }');
      expect(result?.code).toContain('.w-lg { width: calc(var(--size-base) * 3); }');
      expect(result?.code).toContain('.w-xl { width: calc(var(--size-base) * 4); }');
      expect(result?.code).toContain('.w-screen { width: 100vw; }');
      expect(result?.code).toContain('.w-full { width: 100%; }');
      expect(result?.code).toContain('.min-w-2xs { min-width: var(--size-base); }');
      expect(result?.code).toContain('.min-w-lg { min-width: calc(var(--size-base) * 3); }');
      expect(result?.code).toContain('.max-w-2xs { max-width: var(--size-base); }');
      expect(result?.code).toContain('.max-w-lg { max-width: calc(var(--size-base) * 3); }');
    });
  });

  describe('Height Classes', () => {
    it('should generate height utility classes', () => {
      expect(result?.code).toContain('.h-2xs { height: var(--size-base); }');
      expect(result?.code).toContain('.h-xs { height: calc(var(--size-base) * 1.5); }');
      expect(result?.code).toContain('.h-sm { height: calc(var(--size-base) * 2); }');
      expect(result?.code).toContain('.h-md { height: calc(var(--size-base) * 2.5); }');
      expect(result?.code).toContain('.h-lg { height: calc(var(--size-base) * 3); }');
      expect(result?.code).toContain('.h-xl { height: calc(var(--size-base) * 4); }');
      expect(result?.code).toContain('.h-screen { height: 100vh; }');
      expect(result?.code).toContain('.h-full { height: 100%; }');
      expect(result?.code).toContain('.min-h-2xs { min-height: var(--size-base); }');
      expect(result?.code).toContain('.min-h-lg { min-height: calc(var(--size-base) * 3); }');
      expect(result?.code).toContain('.max-h-2xs { max-height: var(--size-base); }');
      expect(result?.code).toContain('.max-h-lg { max-height: calc(var(--size-base) * 3); }');
    });
  });

  describe('Custom Theme', () => {
    it('should apply custom spacing theme', async () => {
      const customPlugin = smsshcss({
        theme: {
          spacing: {
            custom: '2rem',
            special: '3.5rem',
          },
        },
      });
      const customResult = await customPlugin.transform('', 'file.css');

      expect(customResult?.code).toContain('.m-custom { margin: 2rem; }');
      expect(customResult?.code).toContain('.p-special { padding: 3.5rem; }');
      expect(customResult?.code).toContain('.gap-custom { gap: 2rem; }');
      expect(customResult?.code).toContain('.gap-x-special { column-gap: 3.5rem; }');
    });

    it('should apply custom display theme', async () => {
      const customPlugin = smsshcss({
        theme: {
          display: {
            custom: 'inline-block',
            special: 'inline-flex',
          },
        },
      });
      const customResult = await customPlugin.transform('', 'file.css');

      expect(customResult?.code).toContain('.custom { display: inline-block; }');
      expect(customResult?.code).toContain('.special { display: inline-flex; }');
    });

    it('should merge custom theme with defaults', async () => {
      const customPlugin = smsshcss({
        theme: {
          width: {
            custom: '2rem',
            special: '3.5rem',
          },
        },
      });
      const customResult = await customPlugin.transform('', 'file.css');

      expect(customResult?.code).toContain('.w-custom { width: 2rem; }');
      expect(customResult?.code).toContain('.min-w-special { min-width: 3.5rem; }');
      expect(customResult?.code).toContain('.max-w-custom { max-width: 2rem; }');
    });

    it('should apply custom height theme', async () => {
      const customPlugin = smsshcss({
        theme: {
          height: {
            custom: '2rem',
            special: '3.5rem',
          },
        },
      });
      const customResult = await customPlugin.transform('', 'file.css');

      expect(customResult?.code).toContain('.h-custom { height: 2rem; }');
      expect(customResult?.code).toContain('.min-h-special { min-height: 3.5rem; }');
      expect(customResult?.code).toContain('.max-h-custom { max-height: 2rem; }');
    });
  });
});
