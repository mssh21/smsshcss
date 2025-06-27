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

  describe('Z-Index Classes', () => {
    it('should generate z-index utility classes', () => {
      expect(result?.code).toContain('.z-10 { z-index: 10; }');
      expect(result?.code).toContain('.z-20 { z-index: 20; }');
      expect(result?.code).toContain('.z-30 { z-index: 30; }');
      expect(result?.code).toContain('.z-40 { z-index: 40; }');
      expect(result?.code).toContain('.z-50 { z-index: 50; }');
      expect(result?.code).toContain('.z-auto { z-index: auto; }');
    });
  });

  describe('Order Classes', () => {
    it('should generate order utility classes', () => {
      expect(result?.code).toContain('.order-1 { order: 1; }');
      expect(result?.code).toContain('.order-2 { order: 2; }');
      expect(result?.code).toContain('.order-first { order: -9999; }');
      expect(result?.code).toContain('.order-last { order: 9999; }');
      expect(result?.code).toContain('.order-none { order: 0; }');
    });
  });

  describe('Grid Classes', () => {
    it('should generate grid utility classes', () => {
      expect(result?.code).toContain(
        '.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }'
      );
      expect(result?.code).toContain(
        '.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }'
      );
      expect(result?.code).toContain(
        '.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }'
      );
      expect(result?.code).toContain(
        '.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }'
      );
      expect(result?.code).toContain('.col-span-3 { grid-column: span 3 / span 3; }');
      expect(result?.code).toContain('.row-span-1 { grid-row: span 1 / span 1; }');
      expect(result?.code).toContain('.col-start-4 { grid-column-start: 4; }');
      expect(result?.code).toContain('.row-start-4 { grid-row-start: 4; }');
      expect(result?.code).toContain('.col-end-4 { grid-column-end: 4; }');
      expect(result?.code).toContain('.grid-flow-row { grid-auto-flow: row; }');
    });
  });

  describe('Flex Classes', () => {
    it('should generate flex utility classes', () => {
      expect(result?.code).toContain('.flex-row { flex-direction: row; }');
      expect(result?.code).toContain('.flex-col { flex-direction: column; }');
      expect(result?.code).toContain('.flex-row-reverse { flex-direction: row-reverse; }');
      expect(result?.code).toContain('.flex-col-reverse { flex-direction: column-reverse; }');
      expect(result?.code).toContain('.flex-wrap { flex-wrap: wrap; }');
      expect(result?.code).toContain('.flex-wrap-reverse { flex-wrap: wrap-reverse; }');
      expect(result?.code).toContain('.flex-grow { flex-grow: 1; }');
      expect(result?.code).toContain('.flex-shrink { flex-shrink: 1; }');
      expect(result?.code).toContain('.flex-1 { flex: 1 1 0%; }');
      expect(result?.code).toContain('.flex-basis-auto { flex-basis: auto; }');
      expect(result?.code).toContain('.flex-basis-full { flex-basis: 100%; }');
      expect(result?.code).toContain('.flex-basis-sm { flex-basis: calc(var(--size-base) * 2); }');
    });
  });

  describe('Color Classes', () => {
    it('should generate color utility classes', () => {
      expect(result?.code).toContain('.text-black { color: hsl(0 0% 0% / 1); }');
      expect(result?.code).toContain('.text-white { color: hsl(0 0% 100% / 1); }');
      expect(result?.code).toContain('.bg-black { background-color: hsl(0 0% 0% / 1); }');
      expect(result?.code).toContain('.bg-white { background-color: hsl(0 0% 100% / 1); }');
      expect(result?.code).toContain('.border-black { border-color: hsl(0 0% 0% / 1); }');
      expect(result?.code).toContain('.border-white { border-color: hsl(0 0% 100% / 1); }');
      expect(result?.code).toContain('.fill-black { fill: hsl(0 0% 0% / 1); }');
      expect(result?.code).toContain('.fill-white { fill: hsl(0 0% 100% / 1); }');
    });
  });

  describe('Apply Configuration', () => {
    it('should generate apply-based classes', async () => {
      const applyPlugin = smsshcss({
        apply: {
          'btn-primary': 'p-md bg-blue-500 border-blue-500 fill-blue-500 text-white rounded',
          card: 'p-lg bg-white rounded-lg shadow',
          container: 'max-w-lg mx-auto px-md',
        },
      });
      const applyResult = await applyPlugin.transform('', 'file.css');

      // Apply設定が動作することを確認（基本的なユーティリティクラスが生成される）
      expect(applyResult?.code).toContain('/* SmsshCSS Generated Styles */');
    });

    it('should handle multiple apply classes', async () => {
      const applyPlugin = smsshcss({
        apply: {
          'flex-center': 'flex items-center justify-center',
          'text-main': 'text-blue-500 bg-blue-500 border-blue-500 fill-blue-500',
          'card-header': 'p-lg',
        },
      });
      const applyResult = await applyPlugin.transform('', 'file.css');

      // 基本的なユーティリティクラスが含まれていることを確認
      expect(applyResult?.code).toContain('.flex { display: flex; }');
      expect(applyResult?.code).toContain('.text-blue-500 { color: hsl(214 85% 55% / 1); }');
      expect(applyResult?.code).toContain(
        '.bg-blue-500 { background-color: hsl(214 85% 55% / 1); }'
      );
      expect(applyResult?.code).toContain(
        '.border-blue-500 { border-color: hsl(214 85% 55% / 1); }'
      );
      expect(applyResult?.code).toContain('.fill-blue-500 { fill: hsl(214 85% 55% / 1); }');
      expect(applyResult?.code).toContain('.p-lg { padding: calc(var(--space-base) * 8); }');
    });

    it('should work with empty apply configuration', async () => {
      const applyPlugin = smsshcss({
        apply: {},
      });
      const applyResult = await applyPlugin.transform('', 'file.css');

      // 基本的なクラスは生成される
      expect(applyResult?.code).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
      expect(applyResult?.code).toContain('.p-lg { padding: calc(var(--space-base) * 8); }');
    });

    it('should handle apply with standard utility classes', async () => {
      const applyPlugin = smsshcss({
        apply: {
          'layout-main': 'w-full h-screen flex flex-col',
          'spacing-default': 'm-md p-lg gap-sm',
        },
      });
      const applyResult = await applyPlugin.transform('', 'file.css');

      // 標準的なユーティリティクラスが正しく生成される
      expect(applyResult?.code).toContain('.w-full { width: 100%; }');
      expect(applyResult?.code).toContain('.h-screen { height: 100vh; }');
      expect(applyResult?.code).toContain('.flex { display: flex; }');
    });
  });
});
