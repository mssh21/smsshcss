import { describe, it, expect, beforeEach } from 'vitest';
import smsshcss from '../index';
import type { SmsshCSSViteOptions } from '../index';

describe('SmsshCSS Vite Plugin', () => {
  describe('Plugin Configuration', () => {
    it('should create plugin with default options', () => {
      const plugin = smsshcss();
      expect(plugin.name).toBe('smsshcss');
      expect(plugin.transform).toBeDefined();
    });

    it('should create plugin with custom options', () => {
      const options: SmsshCSSViteOptions = {
        includeReset: false,
        includeBase: false,
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

    it('should transform CSS files', () => {
      const result = plugin.transform('body { color: red; }', 'test.css');
      expect(result).toBeDefined();
      expect(result?.code).toContain('body { color: red; }');
    });

    it('should not transform non-CSS files', () => {
      const result = plugin.transform('console.log("test")', 'test.js');
      expect(result).toBeNull();
    });

    it('should preserve original CSS content', () => {
      const originalCSS = 'body { color: red; } .custom { font-size: 16px; }';
      const result = plugin.transform(originalCSS, 'file.css');
      expect(result?.code).toContain(originalCSS);
    });

    it('should handle empty CSS content', () => {
      const result = plugin.transform('', 'file.css');
      expect(result).toBeDefined();
      expect(result?.code).toBeDefined();
      expect(result?.code).not.toBe('');
    });
  });

  describe('CSS Options', () => {
    describe('Reset CSS', () => {
      it('should include reset CSS by default', () => {
        const plugin = smsshcss();
        const result = plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Reset CSS */');
      });

      it('should include reset CSS when explicitly enabled', () => {
        const plugin = smsshcss({ includeReset: true });
        const result = plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Reset CSS */');
      });

      it('should exclude reset CSS when disabled', () => {
        const plugin = smsshcss({ includeReset: false });
        const result = plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Reset CSS */');
      });
    });

    describe('Base CSS', () => {
      it('should include base CSS by default', () => {
        const plugin = smsshcss();
        const result = plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Base CSS */');
      });

      it('should include base CSS when explicitly enabled', () => {
        const plugin = smsshcss({ includeBase: true });
        const result = plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* Base CSS */');
      });

      it('should exclude base CSS when disabled', () => {
        const plugin = smsshcss({ includeBase: false });
        const result = plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Base CSS */');
      });
    });

    describe('Combined Options', () => {
      it('should handle both reset and base CSS disabled', () => {
        const plugin = smsshcss({ includeReset: false, includeBase: false });
        const result = plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* Reset CSS */');
        expect(result?.code).not.toContain('/* Base CSS */');
      });
    });
  });

  describe('Utility Classes Generation', () => {
    let plugin: ReturnType<typeof smsshcss>;
    let result: ReturnType<typeof plugin.transform>;

    beforeEach(() => {
      plugin = smsshcss();
      result = plugin.transform('', 'file.css');
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
    it('should apply custom spacing theme', () => {
      const plugin = smsshcss({
        theme: {
          spacing: {
            custom: '2rem',
            special: '3.5rem',
          },
        },
      });
      const result = plugin.transform('', 'file.css');

      expect(result?.code).toContain('.m-custom { margin: 2rem; }');
      expect(result?.code).toContain('.p-special { padding: 3.5rem; }');
      expect(result?.code).toContain('.gap-custom { gap: 2rem; }');
      expect(result?.code).toContain('.gap-x-special { column-gap: 3.5rem; }');
    });

    it('should apply custom display theme', () => {
      const plugin = smsshcss({
        theme: {
          display: {
            custom: 'inline-block',
            special: 'inline-flex',
          },
        },
      });
      const result = plugin.transform('', 'file.css');

      expect(result?.code).toContain('.custom { display: inline-block; }');
      expect(result?.code).toContain('.special { display: inline-flex; }');
    });

    it('should merge custom theme with defaults', () => {
      const plugin = smsshcss({
        theme: {
          spacing: { custom: '2rem' },
          display: { custom: 'block' },
        },
      });
      const result = plugin.transform('', 'file.css');

      // カスタムテーマ
      expect(result?.code).toContain('.m-custom { margin: 2rem; }');
      expect(result?.code).toContain('.custom { display: block; }');

      // デフォルトテーマも含まれる
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid file extensions gracefully', () => {
      const plugin = smsshcss();
      expect(() => plugin.transform('test', 'file.unknown')).not.toThrow();
      expect(plugin.transform('test', 'file.unknown')).toBeNull();
    });

    it('should handle malformed CSS gracefully', () => {
      const plugin = smsshcss();
      const malformedCSS = 'body { color: red; } .broken { font-size: }';
      expect(() => plugin.transform(malformedCSS, 'file.css')).not.toThrow();
      const result = plugin.transform(malformedCSS, 'file.css');
      expect(result?.code).toContain(malformedCSS);
    });
  });
});
