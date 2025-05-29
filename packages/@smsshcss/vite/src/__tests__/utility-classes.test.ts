import { describe, it, expect, beforeEach } from 'vitest';
import { smsshcss } from '../index';

describe('SmsshCSS Vite Plugin - Utility Classes Generation', () => {
  let plugin: ReturnType<typeof smsshcss>;
  let result: Awaited<ReturnType<typeof plugin.transform>>;

  beforeEach(async () => {
    plugin = smsshcss();
    result = await plugin.transform('', 'file.css');
  });

  describe('Spacing Classes', () => {
    it('should generate margin classes', () => {
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.mt-lg { margin-top: 2rem; }');
      expect(result?.code).toContain('.mx-sm { margin-left: 0.75rem; margin-right: 0.75rem; }');
    });

    it('should generate padding classes', () => {
      expect(result?.code).toContain('.p-md { padding: 1.25rem; }');
      expect(result?.code).toContain('.pt-lg { padding-top: 2rem; }');
      expect(result?.code).toContain('.px-sm { padding-left: 0.75rem; padding-right: 0.75rem; }');
    });

    it('should generate gap classes', () => {
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-x-md { column-gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-y-md { row-gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-x-lg { column-gap: 2rem; }');
      expect(result?.code).toContain('.gap-y-lg { row-gap: 2rem; }');
    });
  });

  describe('Display Classes', () => {
    it('should generate display utility classes', () => {
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.grid { display: block grid; }');
    });
  });

  describe('Width Classes', () => {
    it('should generate width utility classes', () => {
      expect(result?.code).toContain('.w-md { width: 1.25rem; }');
      expect(result?.code).toContain('.w-lg { width: 2rem; }');
      expect(result?.code).toContain('.min-w-md { min-width: var(--size-md); }');
      expect(result?.code).toContain('.min-w-lg { min-width: var(--size-lg); }');
      expect(result?.code).toContain('.max-w-md { max-width: var(--size-md); }');
      expect(result?.code).toContain('.max-w-lg { max-width: var(--size-lg); }');
      expect(result?.code).toContain('.w-full { width: 100%; }');
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
      expect(customResult?.code).toContain('.w-custom { width: 2rem; }');
      expect(customResult?.code).toContain('.min-w-special { min-width: 3.5rem; }');
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
          spacing: { custom: '2rem' },
          display: { custom: 'block' },
        },
      });
      const customResult = await customPlugin.transform('', 'file.css');

      // カスタムテーマ
      expect(customResult?.code).toContain('.m-custom { margin: 2rem; }');
      expect(customResult?.code).toContain('.custom { display: block; }');

      // デフォルトテーマも含まれる
      expect(customResult?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(customResult?.code).toContain('.flex { display: block flex; }');
    });
  });
});
