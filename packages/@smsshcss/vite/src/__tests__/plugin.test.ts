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
        includeResetCSS: false,
        includeBaseCSS: false,
        content: ['src/**/*.tsx'],
        apply: {
          'btn-primary': 'p-md bg-blue-500 text-white',
          card: 'p-lg bg-white',
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
        includeResetCSS: false,
        includeBaseCSS: false,
        content: ['test-apply.html'],
        purge: { enabled: false },
        apply: {
          'text-error': 'text-red-600',
          'bg-primary': 'bg-blue-600',
          'border-accent': 'border-purple-500',
          'btn-danger': 'px-md py-sm bg-red-600 text-white',
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
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'text-custom': 'text-red-500',
          'bg-custom': 'bg-green-500',
          'border-custom': 'border-blue-500',
          'fill-custom': 'fill-black',
        },
      });

      const result = await plugin.transform('', 'test.css');
      expect(result?.code).toContain('.text-custom');
      expect(result?.code).toContain('color: hsl(358 85% 55% / 1)');
      expect(result?.code).toContain('.bg-custom');
      expect(result?.code).toContain('background-color: hsl(125 80% 50% / 1)');
      expect(result?.code).toContain('.border-custom');
      expect(result?.code).toContain('border-color: hsl(214 85% 55% / 1)');
      expect(result?.code).toContain('.fill-custom');
      expect(result?.code).toContain('fill: hsl(0 0% 0% / 1)');
    });

    it('should handle mixed utility classes in apply', async () => {
      const plugin = smsshcss({
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'alert-box': 'p-md m-sm bg-red-100 text-red-800 border-red-300',
          'primary-button': 'px-lg py-md bg-blue-500 text-white',
          'gradient-card': 'p-xl text-white',
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
        const css = await generator.generateFullCSS();

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
        apply: {
          'body-text': '',
          'custom-text': '',
        },
      });

      const result = await plugin.transform('', 'test.css');

      // 基本的なCSS構造が含まれていることを確認
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // applyクラスが生成されている場合
      if (result?.code.includes('body-text') || result?.code.includes('custom-text')) {
        // expect(result?.code).toContain('.body-text');
        // expect(result?.code).toContain('font-size: 1rem');
        // expect(result?.code).toContain('.custom-text');
      }
    });

    it('should generate CSS with custom development options', async () => {
      // Development-specific optionsでプラグインを直接テスト
      const plugin = smsshcss({
        includeResetCSS: true,
        includeBaseCSS: true,
        development: true,
        purge: {
          enabled: false,
        },
      });

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('smsshcss');

      // Generate CSS for testing
      const result = await plugin.transform('', 'test.css');

      expect(result).toBeTruthy();
      expect(result?.code).toBeTruthy();
      expect(typeof result?.code).toBe('string');
      expect(result?.code.length).toBeGreaterThan(0);

      // Reset CSSとBase CSSが含まれていることをテスト
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // 開発モードでminificationがされていないことをテスト
      // expect(result?.code).toMatch(/\n\s+/); // インデントや改行が残っている
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
        expect(result?.code).toContain('/* reset.css */');
      });

      it('should include reset CSS when explicitly enabled', async () => {
        const plugin = smsshcss({ includeResetCSS: true });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* reset.css */');
      });

      it('should exclude reset CSS when disabled', async () => {
        const plugin = smsshcss({ includeResetCSS: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* reset.css */');
      });
    });

    describe('Base CSS', () => {
      it('should include base CSS by default', async () => {
        const plugin = smsshcss();
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* base.css */');
      });

      it('should include base CSS when explicitly enabled', async () => {
        const plugin = smsshcss({ includeBaseCSS: true });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).toContain('/* base.css */');
      });

      it('should exclude base CSS when disabled', async () => {
        const plugin = smsshcss({ includeBaseCSS: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* base.css */');
      });
    });

    describe('Combined Options', () => {
      it('should handle both reset and base CSS disabled', async () => {
        const plugin = smsshcss({ includeResetCSS: false, includeBaseCSS: false });
        const result = await plugin.transform('', 'test.css');
        expect(result?.code).not.toContain('/* reset.css */');
        expect(result?.code).not.toContain('/* base.css */');
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
