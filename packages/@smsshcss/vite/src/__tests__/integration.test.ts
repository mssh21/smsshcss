import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

describe('SmsshCSS Vite Plugin - Integration Tests', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(tmpdir(), 'smsshcss-integration-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Real-world Scenarios', () => {
    it('should handle a typical React project structure', async () => {
      const componentContent = `
        import React from 'react';
        
        export function Card() {
          return (
            <div className="p-[20px] gap-[16px] gap-x-[24px]">
              <h2 className="m-[12px]">Title</h2>
              <p className="gap-y-[8px]">Content</p>
            </div>
          );
        }
      `;

      const indexContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <div id="root" class="gap-[32px] p-[40px]"></div>
        </body>
        </html>
      `;

      fs.writeFileSync(path.join(tempDir, 'Component.tsx'), componentContent);
      fs.writeFileSync(path.join(tempDir, 'index.html'), indexContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,html}`],
      });

      const result = await plugin.transform('', 'main.css');

      // 基本クラスが生成されている
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');

      // カスタム値クラスが生成されている
      expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
      expect(result?.code).toContain('.gap-\\[16px\\] { gap: 16px; }');
      expect(result?.code).toContain('.gap-x-\\[24px\\] { column-gap: 24px; }');
      expect(result?.code).toContain('.m-\\[12px\\] { margin: 12px; }');
      expect(result?.code).toContain('.gap-y-\\[8px\\] { row-gap: 8px; }');
      expect(result?.code).toContain('.gap-\\[32px\\] { gap: 32px; }');
      expect(result?.code).toContain('.p-\\[40px\\] { padding: 40px; }');
    });

    it('should handle Vue.js project with complex layouts', async () => {
      const vueComponent = `
        <template>
          <div class="gap-[30px] gap-x-[20px]">
            <header class="p-[15px] m-[25px]">
              <h1 class="gap-y-[10px]">Vue App</h1>
            </header>
            <main class="gap-[40px]">
              <section class="p-[35px]">Content</section>
            </main>
          </div>
        </template>
        
        <script>
        export default {
          name: 'Layout'
        }
        </script>
      `;

      fs.writeFileSync(path.join(tempDir, 'Layout.vue'), vueComponent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.vue`],
      });

      const result = await plugin.transform('', 'main.css');

      expect(result?.code).toContain('.gap-\\[30px\\] { gap: 30px; }');
      expect(result?.code).toContain('.gap-x-\\[20px\\] { column-gap: 20px; }');
      expect(result?.code).toContain('.p-\\[15px\\] { padding: 15px; }');
      expect(result?.code).toContain('.m-\\[25px\\] { margin: 25px; }');
      expect(result?.code).toContain('.gap-y-\\[10px\\] { row-gap: 10px; }');
      expect(result?.code).toContain('.gap-\\[40px\\] { gap: 40px; }');
      expect(result?.code).toContain('.p-\\[35px\\] { padding: 35px; }');
    });

    it('should handle mixed standard and custom classes efficiently', async () => {
      const mixedContent = `
        <div class="flex grid gap-md p-lg">
          <span class="gap-[50px] m-[custom-value]">Mixed</span>
          <div class="gap-x-md gap-y-[75px]">Standard + Custom</div>
        </div>
      `;

      fs.writeFileSync(path.join(tempDir, 'mixed.html'), mixedContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'styles.css');

      // 標準クラス
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.grid { display: block grid; }');
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.p-lg { padding: 2rem; }');
      expect(result?.code).toContain('.gap-x-md { column-gap: 1.25rem; }');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');
      expect(result?.code).toContain('.m-\\[custom\\-value\\] { margin: custom-value; }');
      expect(result?.code).toContain('.gap-y-\\[75px\\] { row-gap: 75px; }');
    });
  });

  describe('Configuration Scenarios', () => {
    it('should work with custom theme and minimal options', async () => {
      const customContent = '<div class="gap-[50px] m-custom p-special">Custom Theme</div>';

      fs.writeFileSync(path.join(tempDir, 'custom.html'), customContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
        includeReset: false,
        includeBase: false,
        theme: {
          spacing: {
            custom: '3rem',
            special: '4.5rem',
          },
        },
      });

      const result = await plugin.transform('', 'custom.css');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');

      // カスタムテーマクラス
      expect(result?.code).toContain('.m-custom { margin: 3rem; }');
      expect(result?.code).toContain('.p-special { padding: 4.5rem; }');

      // Reset/Base CSSは含まれない
      expect(result?.code).not.toContain('/* Reset CSS */');
      expect(result?.code).not.toContain('/* Base CSS */');
    });

    it('should handle empty configuration gracefully', async () => {
      const simpleContent = '<div class="gap-[simple]">Simple</div>';

      fs.writeFileSync(path.join(tempDir, 'simple.html'), simpleContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'simple.css');

      expect(result?.code).toContain('.gap-\\[simple\\] { gap: simple; }');
      expect(result?.code).toContain('/* Reset CSS */'); // デフォルトで含まれる
      expect(result?.code).toContain('/* Base CSS */'); // デフォルトで含まれる
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after file system errors', async () => {
      const plugin = smsshcss({
        content: [`${tempDir}/nonexistent/**/*.html`],
      });

      const result = await plugin.transform('', 'error.css');

      // 標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle glob errors gracefully', async () => {
      const plugin = smsshcss({
        content: ['[invalid-glob-pattern'],
      });

      const result = await plugin.transform('', 'glob-error.css');

      // globエラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });
  });
});
