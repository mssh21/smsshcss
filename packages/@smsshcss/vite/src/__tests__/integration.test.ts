import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import smsshcss from '../index';
import type { SmsshCSSViteOptions } from '../index';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// ファイルシステムとglobをモック
vi.mock('fs');
vi.mock('path');
vi.mock('glob');

const mockFs = vi.mocked(fs);
const mockPath = vi.mocked(path);
const mockGlob = vi.mocked(glob);

describe('SmsshCSS Vite Plugin Integration', () => {
  beforeEach(() => {
    // パスモックの設定
    mockPath.resolve.mockImplementation((...args) => args.join('/'));
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.dirname.mockReturnValue('/mock/project');

    // globモックの設定
    mockGlob.sync = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Real-world Scenarios', () => {
    it('should handle a typical React project structure', () => {
      const indexHtml = `
        <!DOCTYPE html>
        <html>
        <head><title>React App</title></head>
        <body>
          <div id="root" class="p-[20px] gap-[16px]"></div>
        </body>
        </html>
      `;

      const componentHtml = `
        <div class="flex gap-x-[24px] gap-y-[12px]">
          <header class="p-[32px] m-[16px]">
            <h1 class="mb-[8px]">Title</h1>
          </header>
          <main class="px-[40px] py-[20px]">
            <section class="gap-[2rem]">Content</section>
          </main>
        </div>
      `;

      mockGlob.sync.mockReturnValue(['index.html', 'component.html']);
      mockFs.readFileSync.mockReturnValueOnce(indexHtml).mockReturnValueOnce(componentHtml);

      const plugin = smsshcss();
      const result = plugin.transform('/* Custom styles */', 'src/styles.css');

      // カスタム値クラスが生成されている
      expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
      expect(result?.code).toContain('.gap-\\[16px\\] { gap: 16px; }');
      expect(result?.code).toContain('.gap-x-\\[24px\\] { column-gap: 24px; }');
      expect(result?.code).toContain('.gap-y-\\[12px\\] { row-gap: 12px; }');
      expect(result?.code).toContain('.p-\\[32px\\] { padding: 32px; }');
      expect(result?.code).toContain('.m-\\[16px\\] { margin: 16px; }');
      expect(result?.code).toContain('.mb-\\[8px\\] { margin-bottom: 8px; }');
      expect(result?.code).toContain('.px-\\[40px\\] { padding-left: 40px; padding-right: 40px; }');
      expect(result?.code).toContain('.py-\\[20px\\] { padding-top: 20px; padding-bottom: 20px; }');
      expect(result?.code).toContain('.gap-\\[2rem\\] { gap: 2rem; }');

      // 標準クラスも含まれている
      expect(result?.code).toContain('.flex { display: block flex; }');

      // 元のCSSも保持されている
      expect(result?.code).toContain('/* Custom styles */');
    });

    it('should handle Vue.js project with complex layouts', () => {
      const vueTemplate = `
        <template>
          <div class="grid gap-[30px]">
            <nav class="flex gap-x-[20px] p-[15px]">
              <a class="mx-[10px] py-[5px]">Home</a>
              <a class="mx-[10px] py-[5px]">About</a>
            </nav>
            <main class="gap-y-[40px] px-[60px]">
              <article class="mb-[25px] gap-[1.5rem]">
                <h2 class="mt-[0px] mb-[15px]">Article Title</h2>
                <p class="m-[2rem]">Content with rem units</p>
              </article>
            </main>
          </div>
        </template>
      `;

      mockGlob.sync.mockReturnValue(['App.vue']);
      mockFs.readFileSync.mockReturnValue(vueTemplate);

      const plugin = smsshcss({ includeReset: false });
      const result = plugin.transform('', 'main.css');

      expect(result?.code).toContain('.gap-\\[30px\\] { gap: 30px; }');
      expect(result?.code).toContain('.gap-x-\\[20px\\] { column-gap: 20px; }');
      expect(result?.code).toContain('.p-\\[15px\\] { padding: 15px; }');
      expect(result?.code).toContain('.mx-\\[10px\\] { margin-left: 10px; margin-right: 10px; }');
      expect(result?.code).toContain('.py-\\[5px\\] { padding-top: 5px; padding-bottom: 5px; }');
      expect(result?.code).toContain('.gap-y-\\[40px\\] { row-gap: 40px; }');
      expect(result?.code).toContain('.px-\\[60px\\] { padding-left: 60px; padding-right: 60px; }');
      expect(result?.code).toContain('.mb-\\[25px\\] { margin-bottom: 25px; }');
      expect(result?.code).toContain('.gap-\\[1\\.5rem\\] { gap: 1.5rem; }');
      expect(result?.code).toContain('.mt-\\[0px\\] { margin-top: 0px; }');
      expect(result?.code).toContain('.mb-\\[15px\\] { margin-bottom: 15px; }');
      expect(result?.code).toContain('.m-\\[2rem\\] { margin: 2rem; }');

      // Reset CSSは含まれない
      expect(result?.code).not.toContain('/* Reset CSS */');
    });

    it('should handle mixed standard and custom classes efficiently', () => {
      const mixedContent = `
        <div class="flex grid gap-md gap-[35px]">
          <section class="p-lg p-[25px] m-sm mx-[18px]">
            <h1 class="mb-md mb-[12px]">Mixed Classes</h1>
            <p class="gap-x-lg gap-x-[28px] gap-y-sm gap-y-[8px]">
              This uses both standard and custom values
            </p>
          </section>
        </div>
      `;

      mockGlob.sync.mockReturnValue(['mixed.html']);
      mockFs.readFileSync.mockReturnValue(mixedContent);

      const plugin = smsshcss();
      const result = plugin.transform('', 'styles.css');

      // 標準クラス
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.grid { display: block grid; }');
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.p-lg { padding: 2rem; }');
      expect(result?.code).toContain('.m-sm { margin: 0.75rem; }');
      expect(result?.code).toContain('.mb-md { margin-bottom: 1.25rem; }');
      expect(result?.code).toContain('.gap-x-lg { column-gap: 2rem; }');
      expect(result?.code).toContain('.gap-y-sm { row-gap: 0.75rem; }');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[35px\\] { gap: 35px; }');
      expect(result?.code).toContain('.p-\\[25px\\] { padding: 25px; }');
      expect(result?.code).toContain('.mx-\\[18px\\] { margin-left: 18px; margin-right: 18px; }');
      expect(result?.code).toContain('.mb-\\[12px\\] { margin-bottom: 12px; }');
      expect(result?.code).toContain('.gap-x-\\[28px\\] { column-gap: 28px; }');
      expect(result?.code).toContain('.gap-y-\\[8px\\] { row-gap: 8px; }');
    });
  });

  describe('Build Process Simulation', () => {
    it('should work correctly in development mode', () => {
      const devHtml = '<div class="gap-[20px] p-[1rem]">Development</div>';

      mockGlob.sync.mockReturnValue(['dev.html']);
      mockFs.readFileSync.mockReturnValue(devHtml);

      const plugin = smsshcss();

      // 開発モードでの複数回の変換をシミュレート
      const result1 = plugin.transform('/* Dev CSS v1 */', 'dev.css');
      const result2 = plugin.transform('/* Dev CSS v2 */', 'dev.css');

      expect(result1?.code).toContain('.gap-\\[20px\\] { gap: 20px; }');
      expect(result1?.code).toContain('.p-\\[1rem\\] { padding: 1rem; }');
      expect(result2?.code).toContain('.gap-\\[20px\\] { gap: 20px; }');
      expect(result2?.code).toContain('.p-\\[1rem\\] { padding: 1rem; }');
    });

    it('should handle production build optimization', () => {
      const prodHtml = `
        <div class="gap-[10px] gap-[20px] gap-[10px]">
          <span class="m-[5px] m-[5px]">Duplicate classes</span>
        </div>
      `;

      mockGlob.sync.mockReturnValue(['prod.html']);
      mockFs.readFileSync.mockReturnValue(prodHtml);

      const plugin = smsshcss();
      const result = plugin.transform('', 'prod.css');

      // 重複したクラスは一度だけ生成される
      const gap10Matches = result?.code.match(/\.gap-\\\[10px\\\]/g);
      const gap20Matches = result?.code.match(/\.gap-\\\[20px\\\]/g);
      const m5Matches = result?.code.match(/\.m-\\\[5px\\\]/g);

      expect(gap10Matches).toHaveLength(1);
      expect(gap20Matches).toHaveLength(1);
      expect(m5Matches).toHaveLength(1);
    });
  });

  describe('Configuration Scenarios', () => {
    it('should work with custom theme and minimal options', () => {
      const customHtml = '<div class="gap-[50px] custom-spacing">Content</div>';

      mockGlob.sync.mockReturnValue(['custom.html']);
      mockFs.readFileSync.mockReturnValue(customHtml);

      const options: SmsshCSSViteOptions = {
        includeReset: false,
        includeBase: false,
        theme: {
          spacing: {
            'custom-spacing': '3rem',
          },
        },
      };

      const plugin = smsshcss(options);
      const result = plugin.transform('', 'custom.css');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');

      // カスタムテーマクラス
      expect(result?.code).toContain('.gap-custom-spacing { gap: 3rem; }');
      expect(result?.code).toContain('.m-custom-spacing { margin: 3rem; }');
      expect(result?.code).toContain('.p-custom-spacing { padding: 3rem; }');

      // Reset/Base CSSは含まれない
      expect(result?.code).not.toContain('/* Reset CSS */');
      expect(result?.code).not.toContain('/* Base CSS */');
    });

    it('should handle empty configuration gracefully', () => {
      const simpleHtml = '<div class="gap-[simple]">Simple</div>';

      mockGlob.sync.mockReturnValue(['simple.html']);
      mockFs.readFileSync.mockReturnValue(simpleHtml);

      const plugin = smsshcss({});
      const result = plugin.transform('', 'simple.css');

      expect(result?.code).toContain('.gap-\\[simple\\] { gap: simple; }');
      expect(result?.code).toContain('/* Reset CSS */'); // デフォルトで含まれる
      expect(result?.code).toContain('/* Base CSS */'); // デフォルトで含まれる
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after file system errors', () => {
      // 最初のファイル読み込みでエラー
      mockGlob.sync.mockReturnValue(['error.html']);
      mockFs.readFileSync.mockImplementationOnce(() => {
        throw new Error('File read error');
      });

      const plugin = smsshcss();

      // エラーが発生してもプラグインは動作し続ける
      expect(() => plugin.transform('', 'error.css')).not.toThrow();
      const result = plugin.transform('', 'error.css');

      // 標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle directory access errors gracefully', () => {
      mockGlob.sync.mockReturnValue([]);

      const plugin = smsshcss();
      const result = plugin.transform('', 'no-files.css');

      // ファイルが見つからなくても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });

    it('should handle glob errors gracefully', () => {
      mockGlob.sync.mockImplementation(() => {
        throw new Error('Glob error');
      });

      const plugin = smsshcss();
      const result = plugin.transform('', 'glob-error.css');

      // globエラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });
  });
});
