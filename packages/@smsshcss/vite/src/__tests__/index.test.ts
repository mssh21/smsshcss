import { describe, it, expect, beforeEach, vi } from 'vitest';
import { smsshcss } from '../index';

// smsshcssパッケージをモック
vi.mock('smsshcss', () => ({
  generateCSS: vi.fn().mockImplementation((config) => {
    let css = '';

    // Reset CSS
    if (config.includeResetCSS !== false) {
      css += '\n/* Reset CSS */\n* { margin: 0; padding: 0; }';
    }

    // Base CSS
    if (config.includeBaseCSS !== false) {
      css += '\n/* Base CSS */\nbody { font-family: sans-serif; }';
    }

    // SmsshCSS Generated Styles
    css += '\n/* SmsshCSS Generated Styles */';
    css += '\n.m-md { margin: 1.25rem; }';
    css += '\n.mt-lg { margin-top: 2rem; }';
    css += '\n.mx-sm { margin-left: 0.75rem; margin-right: 0.75rem; }';
    css += '\n.p-md { padding: 1.25rem; }';
    css += '\n.pt-lg { padding-top: 2rem; }';
    css += '\n.px-sm { padding-left: 0.75rem; padding-right: 0.75rem; }';
    css += '\n.gap-md { gap: 1.25rem; }';
    css += '\n.gap-x-md { column-gap: 1.25rem; }';
    css += '\n.gap-y-md { row-gap: 1.25rem; }';
    css += '\n.gap-x-lg { column-gap: 2rem; }';
    css += '\n.gap-y-lg { row-gap: 2rem; }';
    css += '\n.flex { display: block flex; }';
    css += '\n.grid { display: block grid; }';

    // カスタムテーマクラス
    if (config.theme?.spacing) {
      Object.entries(config.theme.spacing).forEach(([key, value]) => {
        css += `\n.m-${key} { margin: ${value}; }`;
        css += `\n.p-${key} { padding: ${value}; }`;
        css += `\n.gap-${key} { gap: ${value}; }`;
        css += `\n.gap-x-${key} { column-gap: ${value}; }`;
        css += `\n.gap-y-${key} { row-gap: ${value}; }`;
      });
    }

    if (config.theme?.display) {
      Object.entries(config.theme.display).forEach(([key, value]) => {
        css += `\n.${key} { display: ${value}; }`;
      });
    }

    return Promise.resolve(css);
  }),
  generateCSSSync: vi.fn().mockImplementation((config) => {
    let css = '';

    // Reset CSS
    if (config.includeResetCSS !== false) {
      css += '\n/* Reset CSS */\n* { margin: 0; padding: 0; }';
    }

    // Base CSS
    if (config.includeBaseCSS !== false) {
      css += '\n/* Base CSS */\nbody { font-family: sans-serif; }';
    }

    // SmsshCSS Generated Styles
    css += '\n/* SmsshCSS Generated Styles */';
    css += '\n.m-md { margin: 1.25rem; }';
    css += '\n.mt-lg { margin-top: 2rem; }';
    css += '\n.mx-sm { margin-left: 0.75rem; margin-right: 0.75rem; }';
    css += '\n.p-md { padding: 1.25rem; }';
    css += '\n.pt-lg { padding-top: 2rem; }';
    css += '\n.px-sm { padding-left: 0.75rem; padding-right: 0.75rem; }';
    css += '\n.gap-md { gap: 1.25rem; }';
    css += '\n.gap-x-md { column-gap: 1.25rem; }';
    css += '\n.gap-y-md { row-gap: 1.25rem; }';
    css += '\n.gap-x-lg { column-gap: 2rem; }';
    css += '\n.gap-y-lg { row-gap: 2rem; }';
    css += '\n.flex { display: block flex; }';
    css += '\n.grid { display: block grid; }';

    // カスタムテーマクラス
    if (config.theme?.spacing) {
      Object.entries(config.theme.spacing).forEach(([key, value]) => {
        css += `\n.m-${key} { margin: ${value}; }`;
        css += `\n.p-${key} { padding: ${value}; }`;
        css += `\n.gap-${key} { gap: ${value}; }`;
        css += `\n.gap-x-${key} { column-gap: ${value}; }`;
        css += `\n.gap-y-${key} { row-gap: ${value}; }`;
      });
    }

    if (config.theme?.display) {
      Object.entries(config.theme.display).forEach(([key, value]) => {
        css += `\n.${key} { display: ${value}; }`;
      });
    }

    return css;
  }),
  generatePurgeReport: vi.fn().mockResolvedValue({
    totalClasses: 100,
    usedClasses: 50,
    purgedClasses: 50,
    buildTime: 100,
  }),
}));

describe('SmsshCSS Vite Plugin', () => {
  describe('Plugin Configuration', () => {
    it('should create plugin with default options', () => {
      const plugin = smsshcss();
      expect(plugin.name).toBe('smsshcss');
    });

    it('should create plugin with custom options', () => {
      const options = {
        includeReset: false,
        includeBase: false,
        content: ['src/**/*.tsx'],
        theme: {
          spacing: { custom: '2rem' },
          display: { custom: 'block' },
        },
      };
      const plugin = smsshcss(options);
      expect(plugin.name).toBe('smsshcss');
    });
  });

  describe('File Transformation', () => {
    let plugin: ReturnType<typeof smsshcss>;

    beforeEach(() => {
      plugin = smsshcss();
    });

    it('should transform CSS files', async () => {
      const result = await plugin.transform('body { color: red; }', 'test.css');
      expect(result).toBeDefined();
      expect(result?.code).toContain('body { color: red; }');
    });

    it('should not transform non-CSS files', async () => {
      const result = await plugin.transform('console.log("test")', 'test.js');
      expect(result).toBeNull();
    });

    it('should preserve original CSS content', async () => {
      const originalCSS = 'body { color: red; } .custom { font-size: 16px; }';
      const result = await plugin.transform(originalCSS, 'file.css');
      expect(result?.code).toContain(originalCSS);
    });

    it('should handle empty CSS content', async () => {
      const result = await plugin.transform('', 'file.css');
      expect(result).toBeDefined();
      expect(result?.code).toBeDefined();
      expect(result?.code).not.toBe('');
    });
  });

  describe('CSS Options', () => {
    describe('Reset CSS', () => {
      it('should include reset CSS by default', async () => {
        const plugin = smsshcss();
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Reset CSS */');
      });

      it('should include reset CSS when explicitly enabled', async () => {
        const plugin = smsshcss({ includeReset: true });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Reset CSS */');
      });

      it('should exclude reset CSS when disabled', async () => {
        const plugin = smsshcss({ includeReset: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Reset CSS */');
      });
    });

    describe('Base CSS', () => {
      it('should include base CSS by default', async () => {
        const plugin = smsshcss();
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Base CSS */');
      });

      it('should include base CSS when explicitly enabled', async () => {
        const plugin = smsshcss({ includeBase: true });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Base CSS */');
      });

      it('should exclude base CSS when disabled', async () => {
        const plugin = smsshcss({ includeBase: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Base CSS */');
      });
    });

    describe('Combined Options', () => {
      it('should handle both reset and base CSS disabled', async () => {
        const plugin = smsshcss({ includeReset: false, includeBase: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Reset CSS */');
        expect(result?.code).not.toContain('/* Base CSS */');
      });
    });
  });

  describe('Utility Classes Generation', () => {
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
  });

  describe('Custom Theme', () => {
    it('should apply custom spacing theme', async () => {
      const plugin = smsshcss({
        theme: {
          spacing: {
            custom: '2rem',
            special: '3.5rem',
          },
        },
      });
      const result = await plugin.transform('', 'file.css');

      expect(result?.code).toContain('.m-custom { margin: 2rem; }');
      expect(result?.code).toContain('.p-special { padding: 3.5rem; }');
      expect(result?.code).toContain('.gap-custom { gap: 2rem; }');
      expect(result?.code).toContain('.gap-x-special { column-gap: 3.5rem; }');
    });

    it('should apply custom display theme', async () => {
      const plugin = smsshcss({
        theme: {
          display: {
            custom: 'inline-block',
            special: 'inline-flex',
          },
        },
      });
      const result = await plugin.transform('', 'file.css');

      expect(result?.code).toContain('.custom { display: inline-block; }');
      expect(result?.code).toContain('.special { display: inline-flex; }');
    });

    it('should merge custom theme with defaults', async () => {
      const plugin = smsshcss({
        theme: {
          spacing: { custom: '2rem' },
          display: { custom: 'block' },
        },
      });
      const result = await plugin.transform('', 'file.css');

      // カスタムテーマ
      expect(result?.code).toContain('.m-custom { margin: 2rem; }');
      expect(result?.code).toContain('.custom { display: block; }');

      // デフォルトテーマも含まれる
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid file extensions gracefully', async () => {
      const plugin = smsshcss();
      expect(async () => await plugin.transform('test', 'file.unknown')).not.toThrow();
      expect(await plugin.transform('test', 'file.unknown')).toBeNull();
    });

    it('should handle malformed CSS gracefully', async () => {
      const plugin = smsshcss();
      const malformedCSS = 'body { color: red; } .broken { font-size: }';
      expect(async () => await plugin.transform(malformedCSS, 'file.css')).not.toThrow();
      const result = await plugin.transform(malformedCSS, 'file.css');
      expect(result?.code).toContain(malformedCSS);
    });
  });
});
