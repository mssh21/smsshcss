import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CSSPurger } from '../core/purger';
import type { PurgeConfig } from '../core/types';
import fs from 'fs';

// モックファイルシステム
vi.mock('fs');
vi.mock('fast-glob', () => ({
  default: vi.fn(),
}));

const mockFs = vi.mocked(fs);
const mockGlob = vi.mocked((await import('fast-glob')).default);

describe('CSSPurger', () => {
  let purger: CSSPurger;
  let config: PurgeConfig;

  beforeEach(() => {
    config = {
      enabled: true,
      content: ['src/**/*.{html,js,jsx,ts,tsx}'],
      safelist: ['safe-class', /^dynamic-/],
      blocklist: ['blocked-class'],
    };
    purger = new CSSPurger(config);

    // モックをリセット
    vi.clearAllMocks();
  });

  describe('extractClassNames', () => {
    it('HTML要素のclass属性からクラス名を抽出する', () => {
      const html = '<div class="btn btn-primary text-center">Button</div>';
      const result = (
        purger as unknown as { extractClassNames: (content: string, file: string) => string[] }
      ).extractClassNames(html, 'test.html');
      expect(result).toEqual(['btn', 'btn-primary', 'text-center']);
    });

    it('React/JSXのclassName属性からクラス名を抽出する', () => {
      const jsx = '<div className="flex items-center justify-between">Content</div>';
      const result = (
        purger as unknown as { extractClassNames: (content: string, file: string) => string[] }
      ).extractClassNames(jsx, 'component.tsx');
      expect(result).toEqual(['flex', 'items-center', 'justify-between']);
    });

    it('動的クラス名を抽出する', () => {
      const dynamic = 'className={`btn ${isActive ? "active" : ""} ${size}`}';
      const result = (
        purger as unknown as { extractClassNames: (content: string, file: string) => string[] }
      ).extractClassNames(dynamic, 'component.tsx');
      expect(result).toEqual(['active']);
    });

    it('複数行にわたるクラス名を抽出する', () => {
      const multiline = `
        <div 
          className="
            flex 
            items-center 
            justify-between
            p-4
          "
        >
      `;
      const result = (
        purger as unknown as { extractClassNames: (content: string, file: string) => string[] }
      ).extractClassNames(multiline, 'component.tsx');
      expect(result).toEqual(['flex', 'items-center', 'justify-between', 'p-4']);
    });

    it('重複するクラス名を除去する', () => {
      const duplicate = '<div class="btn btn btn-primary">Button</div>';
      const result = (
        purger as unknown as { extractClassNames: (content: string, file: string) => string[] }
      ).extractClassNames(duplicate, 'test.html');
      expect(result).toEqual(['btn', 'btn-primary']);
    });
  });

  describe('isInSafelist', () => {
    it('文字列のセーフリストをチェックする', () => {
      const safelistPurger = new CSSPurger({
        enabled: true,
        content: ['**/*.html'],
        safelist: ['safe-class', 'another-safe'],
      });

      expect(
        (
          safelistPurger as unknown as { isInSafelist: (className: string) => boolean }
        ).isInSafelist('safe-class')
      ).toBe(true);
      expect(
        (
          safelistPurger as unknown as { isInSafelist: (className: string) => boolean }
        ).isInSafelist('another-safe')
      ).toBe(true);
      expect(
        (
          safelistPurger as unknown as { isInSafelist: (className: string) => boolean }
        ).isInSafelist('unsafe-class')
      ).toBe(false);
    });

    it('正規表現のセーフリストをチェックする', () => {
      const regexPurger = new CSSPurger({
        enabled: true,
        content: ['**/*.html'],
        safelist: [/^btn-/, /^text-/],
      });

      expect(
        (regexPurger as unknown as { isInSafelist: (className: string) => boolean }).isInSafelist(
          'btn-primary'
        )
      ).toBe(true);
      expect(
        (regexPurger as unknown as { isInSafelist: (className: string) => boolean }).isInSafelist(
          'text-center'
        )
      ).toBe(true);
      expect(
        (regexPurger as unknown as { isInSafelist: (className: string) => boolean }).isInSafelist(
          'container'
        )
      ).toBe(false);
    });
  });

  describe('isInBlocklist', () => {
    it('ブロックリストのクラス名をチェックする', () => {
      expect(
        (purger as unknown as { isInBlocklist: (className: string) => boolean }).isInBlocklist(
          'blocked-class'
        )
      ).toBe(true);
      expect(
        (purger as unknown as { isInBlocklist: (className: string) => boolean }).isInBlocklist(
          'allowed-class'
        )
      ).toBe(false);
    });
  });

  describe('extractAllClasses', () => {
    it('CSSからクラス名を抽出する', () => {
      const css = `
        .container { width: 100%; }
        .btn { padding: 10px; }
        .btn-primary { background: blue; }
        #id-selector { color: red; }
      `;

      purger.extractAllClasses(css);
      const allClasses = (purger as unknown as { allClasses: Set<string> }).allClasses;

      expect(allClasses.has('container')).toBe(true);
      expect(allClasses.has('btn')).toBe(true);
      expect(allClasses.has('btn-primary')).toBe(true);
      expect(allClasses.has('id-selector')).toBe(false); // IDセレクターは除外
    });
  });

  describe('shouldKeepRule', () => {
    beforeEach(() => {
      // 使用されているクラスを設定
      (purger as unknown as { usedClasses: Set<string> }).usedClasses.add('used-class');
    });

    it('使用されているクラスのルールを保持する', () => {
      const rule = '.used-class { color: blue; }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(true);
    });

    it('未使用のクラスのルールを削除する', () => {
      const rule = '.unused-class { color: red; }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(false);
    });

    it('セーフリストのクラスのルールを保持する', () => {
      const rule = '.safe-class { color: green; }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(true);
    });

    it('ブロックリストのクラスのルールを削除する', () => {
      const rule = '.blocked-class { color: black; }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(false);
    });

    it('@ルールを保持する', () => {
      const rule = '@media (max-width: 768px) { .responsive { display: none; } }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(true);
    });

    it('keyframes設定に応じて@keyframesを処理する', () => {
      const rule = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
      expect(
        (purger as unknown as { shouldKeepRule: (rule: string) => boolean }).shouldKeepRule(rule)
      ).toBe(true);

      // keyframesを無効にした場合
      const purgerNoKeyframes = new CSSPurger({ ...config, keyframes: false });
      expect(
        (
          purgerNoKeyframes as unknown as { shouldKeepRule: (rule: string) => boolean }
        ).shouldKeepRule(rule)
      ).toBe(false);
    });
  });

  describe('purgeCSS', () => {
    beforeEach(() => {
      // 使用されているクラスを設定
      (purger as unknown as { usedClasses: Set<string> }).usedClasses = new Set([
        'btn',
        'container',
      ]);
      // 全クラスを設定
      (purger as unknown as { allClasses: Set<string> }).allClasses = new Set([
        'btn',
        'container',
        'unused',
        'another-unused',
      ]);
    });

    it('使用されていないクラスを削除する', () => {
      const css = `
        .btn { color: blue; }
        .container { width: 100%; }
        .unused { display: none; }
        .another-unused { color: red; }
      `;

      const result = purger.purgeCSS(css);

      expect(result).toContain('.btn');
      expect(result).toContain('.container');
      expect(result).not.toContain('.unused');
      expect(result).not.toContain('.another-unused');
    });

    it('セーフリストのクラスは保持する', () => {
      const safelistPurger = new CSSPurger({
        enabled: true,
        content: ['**/*.html'],
        safelist: ['unused'],
      });

      (safelistPurger as unknown as { usedClasses: Set<string> }).usedClasses = new Set(['btn']);
      (safelistPurger as unknown as { allClasses: Set<string> }).allClasses = new Set([
        'btn',
        'unused',
      ]);

      const css = '.btn { color: blue; } .unused { display: none; }';
      const result = safelistPurger.purgeCSS(css);

      expect(result).toContain('.btn');
      expect(result).toContain('.unused');
    });

    it('コメントと空行を保持する', () => {
      const css = `
        /* Important comment */
        .used-class { color: blue; }
        
        // Another comment
        .unused-class { color: red; }
      `;

      const result = purger.purgeCSS(css);

      expect(result).toContain('/* Important comment */');
      expect(result).toContain('// Another comment');
    });

    it('パージが無効の場合は元のCSSを返す', () => {
      const disabledPurger = new CSSPurger({ ...config, enabled: false });
      const css = '.unused-class { color: red; }';

      const result = disabledPurger.purgeCSS(css);

      expect(result).toBe(css);
    });
  });

  describe('analyzeSourceFiles', () => {
    it('ソースファイルを解析してクラス名を抽出する', async () => {
      // モックの設定
      mockGlob.mockResolvedValue(['test.html', 'component.tsx']);
      mockFs.readFileSync.mockImplementation((_filePath: string | Buffer | URL) => {
        const path = _filePath.toString();
        if (path.includes('test.html')) {
          return '<div class="p-4 m-2 text-center">Test</div>';
        }
        if (path.includes('component.tsx')) {
          return '<div className="flex items-center">Component</div>';
        }
        return '';
      });
      mockFs.statSync.mockReturnValue({ size: 100 } as fs.Stats);

      const result = await purger.analyzeSourceFiles();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        file: 'test.html',
        classesFound: ['p-4', 'm-2', 'text-center'],
        size: 100,
      });
      expect(result[1]).toEqual({
        file: 'component.tsx',
        classesFound: ['flex', 'items-center'],
        size: 100,
      });
    });

    it('パージが無効な場合は空配列を返す', async () => {
      const disabledPurger = new CSSPurger({ enabled: false, content: [] });
      const result = await disabledPurger.analyzeSourceFiles();
      expect(result).toEqual([]);
    });

    it('ファイル読み込みエラーを適切に処理する', async () => {
      mockGlob.mockResolvedValue(['error.html']);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      mockFs.statSync.mockReturnValue({ size: 0 } as fs.Stats);

      const result = await purger.analyzeSourceFiles();
      // エラーが発生した場合、ファイルはスキップされるため空配列になる
      expect(result).toHaveLength(0);
    });
  });

  describe('generateReport', () => {
    it('パージレポートを生成する', () => {
      (purger as unknown as { usedClasses: Set<string> }).usedClasses = new Set([
        'btn',
        'container',
      ]);
      (purger as unknown as { allClasses: Set<string> }).allClasses = new Set([
        'btn',
        'container',
        'unused',
      ]);

      const fileAnalysis = [
        { file: 'test.html', classesFound: ['btn'], size: 100 },
        { file: 'component.tsx', classesFound: ['container'], size: 200 },
      ];

      const report = purger.generateReport(fileAnalysis);

      expect(report.totalClasses).toBe(3);
      expect(report.usedClasses).toBe(2);
      expect(report.purgedClasses).toBe(1);
      expect(report.purgedClassNames).toEqual(['unused']);
      expect(report.fileAnalysis).toEqual(fileAnalysis);
      expect(report.buildTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance Tests', () => {
    it('大量のファイルを効率的に処理する', async () => {
      // 大量のファイルをシミュレート
      const files = Array.from({ length: 100 }, (_, i) => `file${i}.html`);
      mockGlob.mockResolvedValue(files);

      mockFs.readFileSync.mockImplementation((_filePath: string | Buffer | URL) => {
        return '<div class="btn btn-primary">Content</div>';
      });
      mockFs.statSync.mockReturnValue({ size: 1000 } as fs.Stats);

      const startTime = Date.now();
      const result = await purger.analyzeSourceFiles();
      const endTime = Date.now();

      expect(result).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(5000); // 5秒以内
    });

    it('大きなCSSファイルを効率的にパージする', () => {
      // 大量のCSSクラスを生成
      const largeCSS = Array.from({ length: 1000 }, (_, i) => `.class${i} { color: red; }`).join(
        '\n'
      );

      (purger as unknown as { usedClasses: Set<string> }).usedClasses = new Set([
        'class1',
        'class2',
        'class3',
      ]);
      (purger as unknown as { allClasses: Set<string> }).allClasses = new Set(
        Array.from({ length: 1000 }, (_, i) => `class${i}`)
      );

      const startTime = Date.now();
      const result = purger.purgeCSS(largeCSS);
      const endTime = Date.now();

      expect(result).toContain('.class1');
      expect(result).toContain('.class2');
      expect(result).toContain('.class3');
      expect(endTime - startTime).toBeLessThan(1000); // 1秒以内
    });
  });
});
