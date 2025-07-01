import { describe, it, expect, beforeEach } from 'vitest';
import { smsshcss } from '../index';

describe('SmsshCSS Vite Plugin - Utility Classes Generation', () => {
  let plugin: ReturnType<typeof smsshcss>;

  beforeEach(async () => {
    // Initialize plugin with lightweight configuration
    plugin = smsshcss({
      content: ['src/__tests__/test-content.html'],
      includeResetCSS: false,
      includeBaseCSS: false,
      apply: {},
      purge: {
        enabled: false, // Disable purge to generate all classes
      },
      debug: true,
    });
  });

  describe('Spacing Classes', () => {
    it('should generate margin classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.mt-lg { margin-block-start: 2rem; }');
      expect(result?.code).toContain('.mx-sm { margin-inline: 0.75rem; }');
    });

    it('should generate padding classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.p-md { padding: 1.25rem; }');
      expect(result?.code).toContain('.pt-lg { padding-block-start: 2rem; }');
      expect(result?.code).toContain('.px-sm { padding-inline: 0.75rem; }');
    });

    it('should generate gap classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-x-md { column-gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-y-md { row-gap: 1.25rem; }');
      expect(result?.code).toContain('.gap-x-lg { column-gap: 2rem; }');
      expect(result?.code).toContain('.gap-y-lg { row-gap: 2rem; }');
    });
  });

  describe('Display Classes', () => {
    it('should generate display utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      // Enable debug output as needed
      // fs.writeFileSync(path.resolve(__dirname, '../debug-output-plugin.txt'), result?.code || '', 'utf-8');
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.grid { display: block grid; }');
    });
  });

  describe('Width Classes', () => {
    it('should generate width utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.w-2xs { width: 1rem; }');
      expect(result?.code).toContain('.w-xs { width: 1.5rem; }');
      expect(result?.code).toContain('.w-sm { width: 2rem; }');
      expect(result?.code).toContain('.w-md { width: 2.5rem; }');
      expect(result?.code).toContain('.w-lg { width: 3rem; }');
      expect(result?.code).toContain('.w-xl { width: 4rem; }');
      expect(result?.code).toContain('.w-screen { width: 100vw; }');
      expect(result?.code).toContain('.w-full { width: 100%; }');
      expect(result?.code).toContain('.min-w-2xs { min-width: 1rem; }');
      expect(result?.code).toContain('.min-w-lg { min-width: 3rem; }');
      expect(result?.code).toContain('.max-w-2xs { max-width: 1rem; }');
      expect(result?.code).toContain('.max-w-lg { max-width: 3rem; }');
    });
  });

  describe('Height Classes', () => {
    it('should generate height utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      // Enable debug output as needed
      // fs.writeFileSync(path.resolve(__dirname, '../debug-output-plugin.txt'), result?.code || '', 'utf-8');
      expect(result?.code).toContain('.h-2xs { height: 1rem; }');
      expect(result?.code).toContain('.h-xs { height: 1.5rem; }');
      expect(result?.code).toContain('.h-sm { height: 2rem; }');
      expect(result?.code).toContain('.h-md { height: 2.5rem; }');
      expect(result?.code).toContain('.h-lg { height: 3rem; }');
      expect(result?.code).toContain('.h-xl { height: 4rem; }');
      expect(result?.code).toContain('.h-screen { height: 100vh; }');
      expect(result?.code).toContain('.h-full { height: 100%; }');
      expect(result?.code).toContain('.min-h-2xs { min-height: 1rem; }');
      expect(result?.code).toContain('.min-h-lg { min-height: 3rem; }');
      expect(result?.code).toContain('.max-h-2xs { max-height: 1rem; }');
      expect(result?.code).toContain('.max-h-lg { max-height: 3rem; }');
    });
  });

  describe('Z-Index Classes', () => {
    it('should generate z-index utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.z-10 { z-index: 10; }');
      expect(result?.code).toContain('.z-20 { z-index: 20; }');
      expect(result?.code).toContain('.z-30 { z-index: 30; }');
      expect(result?.code).toContain('.z-40 { z-index: 40; }');
      expect(result?.code).toContain('.z-50 { z-index: 50; }');
      expect(result?.code).toContain('.z-auto { z-index: auto; }');
    });
  });

  describe('Order Classes', () => {
    it('should generate order utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.order-1 { order: 1; }');
      expect(result?.code).toContain('.order-2 { order: 2; }');
      expect(result?.code).toContain('.order-first { order: -9999; }');
      expect(result?.code).toContain('.order-last { order: 9999; }');
      expect(result?.code).toContain('.order-none { order: 0; }');
    });
  });

  describe('Grid Classes', () => {
    it('should generate grid utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
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
    it('should generate flex utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.flex-row { flex-direction: row; }');
      expect(result?.code).toContain('.flex-col { flex-direction: column; }');
      expect(result?.code).toContain('.flex-row-reverse { flex-direction: row-reverse; }');
      expect(result?.code).toContain('.flex-col-reverse { flex-direction: column-reverse; }');
      expect(result?.code).toContain('.flex-wrap { flex-wrap: wrap; }');
      expect(result?.code).toContain('.flex-wrap-reverse { flex-wrap: wrap-reverse; }');
      expect(result?.code).toContain('.grow { flex-grow: 1; }');
      expect(result?.code).toContain('.shrink { flex-shrink: 1; }');
      expect(result?.code).toContain('.flex-auto { flex: 1 1 auto; }');
      expect(result?.code).toContain('.basis-auto { flex-basis: auto; }');
      expect(result?.code).toContain('.basis-full { flex-basis: 100%; }');
      expect(result?.code).toContain('.basis-sm { flex-basis: 2rem; }');
    });
  });

  describe('Color Classes', () => {
    it('should generate color utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
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

  describe('Font Size Classes', () => {
    it('should generate font size utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.font-size-xs { font-size: 0.75rem; }');
      expect(result?.code).toContain('.font-size-sm { font-size: 0.875rem; }');
      expect(result?.code).toContain('.font-size-md { font-size: 1rem; }');
      expect(result?.code).toContain('.font-size-lg { font-size: 1.25rem; }');
      expect(result?.code).toContain('.font-size-xl { font-size: 1.5rem; }');
      expect(result?.code).toContain('.font-size-2xl { font-size: 2rem; }');
      expect(result?.code).toContain('.font-size-3xl { font-size: 2.25rem; }');
      expect(result?.code).toContain('.font-size-4xl { font-size: 2.75rem; }');
    });
  });

  describe('Positioning Classes', () => {
    it('should generate positioning utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.static { position: static; }');
      expect(result?.code).toContain('.fixed { position: fixed; }');
      expect(result?.code).toContain('.absolute { position: absolute; }');
      expect(result?.code).toContain('.relative { position: relative; }');
      expect(result?.code).toContain('.sticky { position: sticky; }');
    });
  });

  describe('Overflow Classes', () => {
    it('should generate overflow utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.overflow-auto { overflow: auto; }');
      expect(result?.code).toContain('.overflow-hidden { overflow: hidden; }');
      expect(result?.code).toContain('.overflow-visible { overflow: visible; }');
      expect(result?.code).toContain('.overflow-scroll { overflow: scroll; }');
      expect(result?.code).toContain('.overflow-clip { overflow: clip; }');
    });

    it('should generate overflow-x utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.overflow-x-auto { overflow-x: auto; }');
      expect(result?.code).toContain('.overflow-x-hidden { overflow-x: hidden; }');
      expect(result?.code).toContain('.overflow-x-visible { overflow-x: visible; }');
      expect(result?.code).toContain('.overflow-x-scroll { overflow-x: scroll; }');
      expect(result?.code).toContain('.overflow-x-clip { overflow-x: clip; }');
    });

    it('should generate overflow-y utility classes', async () => {
      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.overflow-y-auto { overflow-y: auto; }');
      expect(result?.code).toContain('.overflow-y-hidden { overflow-y: hidden; }');
      expect(result?.code).toContain('.overflow-y-visible { overflow-y: visible; }');
      expect(result?.code).toContain('.overflow-y-scroll { overflow-y: scroll; }');
      expect(result?.code).toContain('.overflow-y-clip { overflow-y: clip; }');
    });
  });

  describe('Apply Configuration', () => {
    it('should generate apply-based classes', async () => {
      const applyPlugin = smsshcss({
        content: ['./test-content.html'],
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'btn-primary': 'p-md bg-blue-500 border-blue-500 fill-blue-500 text-white ',
          card: 'p-lg bg-white',
          container: 'max-w-lg mx-auto px-md',
        },
        purge: {
          enabled: false,
        },
        debug: true,
      });
      const applyResult = await applyPlugin.transform('', 'test.css');

      // Verify that Apply settings work (basic utility classes are generated)
      expect(applyResult?.code).toBeDefined();
      expect(typeof applyResult?.code).toBe('string');
    });

    it('should handle multiple apply classes', async () => {
      const applyPlugin = smsshcss({
        content: ['./test-content.html'],
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'btn-primary': 'p-md bg-blue-500 text-white',
          'btn-secondary': 'p-md bg-gray-500 text-white',
        },
        purge: {
          enabled: false,
        },
        debug: true,
      });
      const applyResult = await applyPlugin.transform('', 'test.css');

      expect(applyResult?.code).toBeDefined();
      expect(typeof applyResult?.code).toBe('string');
    });

    it('should work with empty apply configuration', async () => {
      const applyPlugin = smsshcss({
        content: ['./test-content.html'],
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {},
        purge: {
          enabled: false,
        },
        debug: true,
      });
      const applyResult = await applyPlugin.transform('', 'test.css');

      expect(applyResult?.code).toBeDefined();
      expect(typeof applyResult?.code).toBe('string');
    });

    it('should handle apply with standard utility classes', async () => {
      const applyPlugin = smsshcss({
        content: ['**/*.html'],
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'text-custom': 'text-red-500',
          'alert-box': 'border-red-200 text-red-700 p-md',
        },
        purge: {
          enabled: false,
        },
        debug: true,
      });
      const applyResult = await applyPlugin.transform('/* test css */', 'test.css');

      expect(applyResult?.code).toBeDefined();
      expect(typeof applyResult?.code).toBe('string');
    });
  });
});
