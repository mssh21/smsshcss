import { describe, it, expect, beforeEach } from 'vitest';
import { smsshcss } from '../index';

describe('SmsshCSS Vite Plugin - Core Functionality', () => {
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
          width: { custom: '100px' },
          height: { custom: '100px' },
          gridCols: { custom: '20' },
          gridRows: { custom: '20' },
          gridColumnSpan: { custom: '20' },
          gridRowSpan: { custom: '20' },
          gridColumnPosition: { custom: '20' },
          gridRowPosition: { custom: '20' },
          gridAutoFlow: { custom: '20' },
          zIndex: { custom: '100' },
          order: { custom: '50' },
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
