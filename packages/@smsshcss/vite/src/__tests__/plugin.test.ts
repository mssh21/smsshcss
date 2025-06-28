import { describe, it, expect, beforeEach } from 'vitest';
import { smsshcss } from '../index';

// 実際のsmsshcssモジュールをインポート
import { vi } from 'vitest';
const actualSmsshcss = await vi.importActual('smsshcss');

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
        apply: {
          'btn-primary': 'p-md bg-blue-500 text-white rounded',
          card: 'p-lg bg-white rounded-lg shadow',
          container: 'max-w-lg mx-auto px-md',
          'text-notification': 'text-red-500',
          'bg-success': 'bg-green-500',
          'border-warning': 'border-yellow-500',
          'fill-primary': 'fill-blue-500',
          'font-size-custom': 'font-size-lg',
        },
      };
      const plugin = smsshcss(options);
      expect(plugin.name).toBe('smsshcss');
    });
  });

  describe('Apply Classes', () => {
    it('should generate apply classes with color utilities', async () => {
      // テスト用の一時ファイルを作成
      const testContent = `
        <div class="text-error">Error message</div>
        <div class="bg-primary">Primary background</div>
        <div class="border-accent">Accent border</div>
      `;
      const fs = await import('fs');
      const path = await import('path');
      const testFile = path.join(process.cwd(), 'test-apply.html');
      fs.writeFileSync(testFile, testContent);

      const plugin = smsshcss({
        includeReset: false,
        includeBase: false,
        content: ['test-apply.html'],
        purge: { enabled: false },
        apply: {
          'text-error': 'text-red-600',
          'bg-primary': 'bg-blue-600',
          'border-accent': 'border-purple-500',
          'btn-danger': 'px-md py-sm bg-red-600 text-white rounded',
          'card-highlight': 'p-lg bg-yellow-100 border-yellow-500 text-gray-900',
        },
      });

      const mockConfig = { command: 'serve', build: { cssMinify: true } };
      plugin.configResolved(mockConfig);

      const result = await plugin.transform('', 'test.css');

      // クリーンアップ
      fs.unlinkSync(testFile);

      console.log('Generated CSS:', result?.code); // デバッグ用
      expect(result?.code).toContain('.text-error');
      expect(result?.code).toContain('color: hsl(358 90% 45% / 1)');
      expect(result?.code).toContain('.bg-primary');
      expect(result?.code).toContain('background-color: hsl(214 90% 45% / 1)');
      expect(result?.code).toContain('.border-accent');
      expect(result?.code).toContain('border-color: hsl(280 85% 55% / 1)');
    });

    it('should handle apply classes with custom color values', async () => {
      const plugin = smsshcss({
        includeReset: false,
        includeBase: false,
        apply: {
          'text-custom': 'text-[#ff0000]',
          'bg-custom': 'bg-[rgb(0,255,0)]',
          'border-custom': 'border-[hsl(240,100%,50%)]',
          'fill-custom': 'fill-[var(--primary-color)]',
        },
      });

      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.text-custom');
      expect(result?.code).toContain('color: #ff0000');
      expect(result?.code).toContain('.bg-custom');
      expect(result?.code).toContain('background-color: rgb(0, 255, 0)');
      expect(result?.code).toContain('.border-custom');
      expect(result?.code).toContain('border-color: hsl(240, 100%, 50%)');
      expect(result?.code).toContain('.fill-custom');
      expect(result?.code).toContain('fill: var(--primary-color)');
    });

    it('should handle mixed utility classes in apply', async () => {
      const plugin = smsshcss({
        includeReset: false,
        includeBase: false,
        apply: {
          'alert-box': 'p-md m-sm bg-red-100 text-red-800 border-red-300',
          'primary-button': 'px-lg py-md bg-blue-500 text-white hover:bg-blue-600',
          'gradient-card': 'p-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        },
      });

      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.alert-box');
      expect(result?.code).toContain('background-color: hsl(358 100% 95% / 1)');
      expect(result?.code).toContain('color: hsl(358 100% 25% / 1)');
      expect(result?.code).toContain('border-color: hsl(358 85% 75% / 1)');
    });

    it('should generate apply classes directly from smsshcss', async () => {
      try {
        const CSSGenerator = (actualSmsshcss as typeof import('smsshcss')).CSSGenerator;

        const config = {
          includeResetCSS: false,
          includeBaseCSS: false,
          content: ['**/*.html'], // 必須フィールドを追加
          apply: {
            'test-class': 'text-red-500',
            'test-bg': 'bg-blue-500',
          },
        };

        console.log('Config passed to CSSGenerator:', JSON.stringify(config, null, 2));

        const generator = new CSSGenerator(config, {
          skipValidation: true,
          suppressWarnings: true,
        });
        const css = generator.generateFullCSSSync();

        console.log('Direct CSSGenerator output:', css);
        console.log('CSS contains test-class:', css.includes('.test-class'));
        console.log('CSS contains test-bg:', css.includes('.test-bg'));

        expect(css).toContain('.test-class');
        expect(css).toContain('color: hsl(358 85% 55% / 1)');
        expect(css).toContain('.test-bg');
        expect(css).toContain('background-color: hsl(214 85% 55% / 1)');
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    });

    it('should handle apply classes with font-size values', async () => {
      const plugin = smsshcss({
        includeReset: false,
        includeBase: false,
        apply: {
          'body-text': 'font-size-md',
          'custom-text': 'font-size-[88px]',
          'calc-text': 'font-size-[calc(1rem+2px)]',
          'clamp-text': 'font-size-[clamp(1rem,2rem,3rem)]',
          'variable-text': 'font-size-[var(--custom-font-size)]',
        },
      });

      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.body-text');
      expect(result?.code).toContain('font-size: 1rem');
      expect(result?.code).toContain('.custom-text');
      expect(result?.code).toContain('font-size: 88px');
      expect(result?.code).toContain('.calc-text');
      expect(result?.code).toContain('font-size: calc(1rem + 2px)');
      expect(result?.code).toContain('.clamp-text');
      expect(result?.code).toContain('font-size: clamp(1rem, 2rem, 3rem)');
      expect(result?.code).toContain('.variable-text');
      expect(result?.code).toContain('font-size: var(--custom-font-size)');
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
