import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import smsshcss from '../index';
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

describe('Custom Value Classes Integration', () => {
  let plugin: ReturnType<typeof smsshcss>;

  beforeEach(() => {
    plugin = smsshcss();

    // パスモックの設定
    mockPath.resolve.mockImplementation((...args) => args.join('/'));
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.dirname.mockReturnValue('/mock/dir');

    // globモックの設定
    mockGlob.sync = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('HTML Content Processing', () => {
    it('should process gap custom values in HTML files', () => {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <div class="gap-[50px] gap-x-[40px] gap-y-[20px]">
            <div>Item 1</div>
            <div>Item 2</div>
          </div>
        </body>
        </html>
      `;

      // globとファイルシステムをモック
      mockGlob.sync.mockReturnValue(['index.html']);
      mockFs.readFileSync.mockReturnValue(htmlContent);

      const result = plugin.transform('', 'styles.css');

      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');
      expect(result?.code).toContain('.gap-x-\\[40px\\] { column-gap: 40px; }');
      expect(result?.code).toContain('.gap-y-\\[20px\\] { row-gap: 20px; }');
    });

    it('should process margin and padding custom values', () => {
      const htmlContent = `
        <div class="m-[20px] p-[10px] mx-[30px] py-[15px]">
          <span class="mt-[5px] pl-[8px]">Content</span>
        </div>
      `;

      mockGlob.sync.mockReturnValue(['component.html']);
      mockFs.readFileSync.mockReturnValue(htmlContent);

      const result = plugin.transform('', 'styles.css');

      expect(result?.code).toContain('.m-\\[20px\\] { margin: 20px; }');
      expect(result?.code).toContain('.p-\\[10px\\] { padding: 10px; }');
      expect(result?.code).toContain('.mx-\\[30px\\] { margin-left: 30px; margin-right: 30px; }');
      expect(result?.code).toContain('.py-\\[15px\\] { padding-top: 15px; padding-bottom: 15px; }');
      expect(result?.code).toContain('.mt-\\[5px\\] { margin-top: 5px; }');
      expect(result?.code).toContain('.pl-\\[8px\\] { padding-left: 8px; }');
    });

    it('should handle complex custom values', () => {
      const htmlContent = `
        <div class="gap-[2rem] gap-x-[1.5em] gap-y-[24px]">
          <div class="gap-[50%] gap-x-[var(--custom-gap)]">
            <span class="m-[3.5rem]">Responsive</span>
          </div>
        </div>
      `;

      mockGlob.sync.mockReturnValue(['complex.html']);
      mockFs.readFileSync.mockReturnValue(htmlContent);

      const result = plugin.transform('', 'styles.css');

      expect(result?.code).toContain('.gap-\\[2rem\\] { gap: 2rem; }');
      expect(result?.code).toContain('.gap-x-\\[1\\.5em\\] { column-gap: 1.5em; }');
      expect(result?.code).toContain('.gap-y-\\[24px\\] { row-gap: 24px; }');
      expect(result?.code).toContain('.gap-\\[50\\%\\] { gap: 50%; }');
      expect(result?.code).toContain(
        '.gap-x-\\[var\\(--custom-gap\\)\\] { column-gap: var(--custom-gap); }'
      );
      expect(result?.code).toContain('.m-\\[3\\.5rem\\] { margin: 3.5rem; }');
    });
  });

  describe('Multiple File Processing', () => {
    it('should process custom values from multiple HTML files', () => {
      const file1Content = '<div class="gap-[10px] m-[5px]">File 1</div>';
      const file2Content = '<div class="gap-x-[15px] p-[8px]">File 2</div>';

      mockGlob.sync.mockReturnValue(['file1.html', 'file2.html']);
      mockFs.readFileSync.mockReturnValueOnce(file1Content).mockReturnValueOnce(file2Content);

      const result = plugin.transform('', 'styles.css');

      expect(result?.code).toContain('.gap-\\[10px\\] { gap: 10px; }');
      expect(result?.code).toContain('.m-\\[5px\\] { margin: 5px; }');
      expect(result?.code).toContain('.gap-x-\\[15px\\] { column-gap: 15px; }');
      expect(result?.code).toContain('.p-\\[8px\\] { padding: 8px; }');
    });

    it('should deduplicate identical custom values', () => {
      const file1Content = '<div class="gap-[20px] m-[10px]">File 1</div>';
      const file2Content = '<div class="gap-[20px] p-[10px]">File 2</div>'; // 同じgap-[20px]

      mockGlob.sync.mockReturnValue(['file1.html', 'file2.html']);
      mockFs.readFileSync.mockReturnValueOnce(file1Content).mockReturnValueOnce(file2Content);

      const result = plugin.transform('', 'styles.css');

      // gap-[20px]は一度だけ含まれるべき
      const gapMatches = result?.code.match(/\.gap-\\\[20px\\\]/g);
      expect(gapMatches).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle files with no custom values', () => {
      const htmlContent = '<div class="flex grid m-md p-lg">Standard classes only</div>';

      mockGlob.sync.mockReturnValue(['standard.html']);
      mockFs.readFileSync.mockReturnValue(htmlContent);

      const result = plugin.transform('', 'styles.css');

      // カスタム値のクラスは含まれないことを確認（Custom Value Classesセクションをチェック）
      const customValueSection = result?.code.split('/* Custom Value Classes */')[1];
      if (customValueSection) {
        // カスタム値セクションが存在する場合、実際のカスタム値クラスが含まれていないことを確認
        expect(customValueSection).not.toMatch(/\.[mp][trlbxy]?-\\\[[^\]]+\\\]/);
        expect(customValueSection).not.toMatch(/\.gap(?:-[xy])?-\\\[[^\]]+\\\]/);
      }

      // 標準クラスは含まれる
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle empty HTML files', () => {
      mockGlob.sync.mockReturnValue(['empty.html']);
      mockFs.readFileSync.mockReturnValue('');

      expect(() => plugin.transform('', 'styles.css')).not.toThrow();
      const result = plugin.transform('', 'styles.css');
      expect(result).toBeDefined();
    });

    it('should handle malformed HTML gracefully', () => {
      const malformedHtml = '<div class="gap-[20px" unclosed><span class="m-[">broken</div>';

      mockGlob.sync.mockReturnValue(['malformed.html']);
      mockFs.readFileSync.mockReturnValue(malformedHtml);

      expect(() => plugin.transform('', 'styles.css')).not.toThrow();
      const result = plugin.transform('', 'styles.css');

      // 正しい形式のクラスのみが処理される
      expect(result?.code).not.toContain('.gap-\\[20px\\]'); // 閉じ括弧がない
      expect(result?.code).not.toContain('.m-\\[\\]'); // 値がない
    });

    it('should handle no HTML files found', () => {
      mockGlob.sync.mockReturnValue([]);

      expect(() => plugin.transform('', 'styles.css')).not.toThrow();
      const result = plugin.transform('', 'styles.css');

      // 標準クラスは含まれるが、カスタム値クラスは含まれない
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');

      // カスタム値セクションが存在しないか、空であることを確認
      const customValueSection = result?.code.split('/* Custom Value Classes */')[1];
      if (customValueSection) {
        expect(customValueSection.trim()).toBe('');
      }
    });

    it('should handle glob errors gracefully', () => {
      mockGlob.sync.mockImplementation(() => {
        throw new Error('Glob error');
      });

      expect(() => plugin.transform('', 'styles.css')).not.toThrow();
      const result = plugin.transform('', 'styles.css');

      // エラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle file read errors gracefully', () => {
      mockGlob.sync.mockReturnValue(['error.html']);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      expect(() => plugin.transform('', 'styles.css')).not.toThrow();
      const result = plugin.transform('', 'styles.css');

      // エラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });
  });

  describe('Performance', () => {
    it('should handle large HTML files efficiently', () => {
      // 大きなHTMLファイルをシミュレート
      const largeContent = Array.from(
        { length: 1000 },
        (_, i) => `<div class="gap-[${i}px] m-[${i * 2}px]">Item ${i}</div>`
      ).join('\n');

      mockGlob.sync.mockReturnValue(['large.html']);
      mockFs.readFileSync.mockReturnValue(largeContent);

      const startTime = Date.now();
      const result = plugin.transform('', 'styles.css');
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // 1秒以内

      // いくつかのクラスが含まれていることを確認
      expect(result?.code).toContain('.gap-\\[0px\\] { gap: 0px; }');
      expect(result?.code).toContain('.gap-\\[999px\\] { gap: 999px; }');
    });
  });
});
