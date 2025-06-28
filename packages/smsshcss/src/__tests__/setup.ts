import { vi, beforeEach } from 'vitest';

// テスト環境の設定
process.env.NODE_ENV = 'test';

// Mock fs module
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  readFile: vi.fn(),
  statSync: vi.fn(),
  stat: vi.fn(),
  existsSync: vi.fn(),
  default: {
    readFileSync: vi.fn(),
    readFile: vi.fn(),
    statSync: vi.fn(),
    stat: vi.fn(),
    existsSync: vi.fn(),
  },
}));

// Mock fs/promises module
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  stat: vi.fn(),
  default: {
    readFile: vi.fn(),
    stat: vi.fn(),
  },
}));

// Mock util.promisify - より直接的なアプローチ
vi.mock('util', () => ({
  promisify: vi.fn(() => vi.fn()),
}));

// Mock glob
vi.mock('glob', () => ({
  sync: vi.fn(),
  glob: vi.fn(),
  default: {
    sync: vi.fn(),
    glob: vi.fn(),
  },
}));

// Mock fast-glob - both default and named exports
vi.mock('fast-glob', () => {
  const mockFn = vi.fn();
  return {
    default: mockFn,
    __esModule: true,
  };
});

// モック関数をインポート
import fs from 'fs';
import * as fsPromises from 'fs/promises';
import glob from 'glob';
import fastGlob from 'fast-glob';
import { promisify } from 'util';

// モック変数をエクスポート
export const mockFs = vi.mocked(fs);
export const mockFsPromises = vi.mocked(fsPromises);
export const mockGlob = vi.mocked(glob);
export const mockFastGlob = vi.mocked(fastGlob);
export const mockPromisify = vi.mocked(promisify);

// テスト環境の設定を再設定
process.env.NODE_ENV = 'test';

// 共通のモックファイル内容
export const mockFileContents = {
  'test.html':
    '<div class="p-md m-sm block flex p-lg flex-col flex-wrap justify-center items-center content-center self-center flex-1 basis-full shrink grow z-10 order-10 grid-cols-2 grid-rows-2 col-span-2 row-span-2 col-start-2 row-start-2 grid inline-grid text-black text-white text-gray-500 text-blue-500 text-red-500 text-green-500 text-yellow-500">Test</div>',
  'component.tsx':
    '<div className="flex p-lg flex-col flex-wrap justify-center items-center content-center self-center flex-1 basis-full shrink grow z-10 order-10 grid-cols-2 grid-rows-2 col-span-2 row-span-2 col-start-2 row-start-2 grid inline-grid text-black text-white text-gray-500 text-blue-500 text-red-500 text-green-500 text-yellow-500">Component</div>',
  'app.vue': '<div class="grid gap-md">Vue Component</div>',
  'reset.css': '* { margin: 0; padding: 0; }',
  'base.css': 'body { font-family: sans-serif; }',
};

// Default mock implementations
beforeEach(() => {
  // Clear all mocks
  vi.clearAllMocks();

  // fs モック設定
  vi.mocked(fs.existsSync).mockReturnValue(false); // CSSファイル読み込みをスキップ
  vi.mocked(fs.readFileSync).mockImplementation((path: string | Buffer | URL) => {
    const filePath = path.toString();
    if (filePath.includes('reset.css')) {
      return '/* Reset CSS */\n* { margin: 0; padding: 0; }';
    }
    if (filePath.includes('base.css')) {
      return '/* Base CSS */\nbody { font-family: sans-serif; }';
    }
    if (filePath.includes('test')) {
      return '<div class="p-4 m-2">Test content</div>';
    }
    return '';
  });
  vi.mocked(fs.statSync).mockReturnValue({
    size: 1000,
    isFile: () => true,
    isDirectory: () => false,
  } as fs.Stats);

  // fs/promises モック設定
  vi.mocked(fsPromises.readFile).mockImplementation(async (path: string | Buffer | URL) => {
    const filePath = path.toString();
    if (filePath.includes('reset.css')) {
      return '/* Reset CSS */\n* { margin: 0; padding: 0; }';
    }
    if (filePath.includes('base.css')) {
      return '/* Base CSS */\nbody { font-family: sans-serif; }';
    }
    if (filePath.includes('test')) {
      return '<div class="p-4 m-2">Test content</div>';
    }
    return '';
  });
  vi.mocked(fsPromises.stat).mockResolvedValue({
    size: 1000,
    isFile: () => true,
    isDirectory: () => false,
  } as fs.Stats);

  // promisify モック設定 - readFile用の適切なモック
  mockPromisify.mockImplementation((fn: unknown) => {
    if (fn === fs.readFile) {
      return vi.fn().mockImplementation(async (path: string | Buffer | URL, _encoding?: string) => {
        const filePath = path.toString();
        if (filePath.includes('test.html')) return mockFileContents['test.html'];
        if (filePath.includes('component.tsx')) return mockFileContents['component.tsx'];
        if (filePath.includes('app.vue')) return mockFileContents['app.vue'];
        if (filePath.includes('reset.css')) return mockFileContents['reset.css'];
        if (filePath.includes('base.css')) return mockFileContents['base.css'];
        return '';
      });
    }
    if (fn === fs.stat) {
      return vi.fn().mockImplementation(async (_path: string | Buffer | URL) => {
        return { size: 100 };
      });
    }
    return vi.fn().mockResolvedValue('');
  });

  // glob モック設定
  vi.mocked(glob.sync).mockReturnValue(['src/test.html', 'src/component.tsx']);
  vi.mocked(glob.glob).mockResolvedValue(['src/test.html', 'src/component.tsx']);

  // fast-glob モック設定
  vi.mocked(fastGlob).mockImplementation(async (_patterns: unknown, _options?: unknown) => {
    return ['src/test.html', 'src/component.tsx'];
  });
});

// CSS検証用のユーティリティ関数
export const cssValidators = {
  /**
   * CSSが有効な構文を持っているかチェック
   */
  isValidCSS: (css: string): boolean => {
    // 基本的なCSS構文チェック
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;

    return openBraces === closeBraces && css.length > 0;
  },

  /**
   * 指定されたクラス名がCSSに含まれているかチェック
   */
  hasClass: (css: string, className: string): boolean => {
    const classPattern = new RegExp(
      `\\.${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`
    );
    return classPattern.test(css);
  },

  /**
   * CSSにユーティリティクラスが含まれているかチェック
   */
  hasUtilityClasses: (css: string, classes: string[]): boolean => {
    return classes.every((className) => cssValidators.hasClass(css, className));
  },

  /**
   * CSS内のクラス数をカウント
   */
  countClasses: (css: string): number => {
    const classMatches = css.match(/\.[a-zA-Z][\w-]*\s*\{/g);
    return classMatches ? classMatches.length : 0;
  },
};

// デフォルトモック設定関数
export function setupDefaultMocks(): void {
  vi.clearAllMocks();

  // デフォルトのglob結果 - パージテスト用にテストファイルを返す
  vi.mocked(fastGlob).mockImplementation(async (_patterns: unknown, _options?: unknown) => {
    return ['src/test.html', 'src/component.tsx'];
  });
  vi.mocked(glob.sync).mockReturnValue(['src/test.html', 'src/component.tsx']);

  // デフォルトのファイル読み込み
  vi.mocked(fs.readFileSync).mockImplementation((path: string | Buffer | URL) => {
    const pathStr = path.toString();

    if (pathStr.includes('test.html')) return mockFileContents['test.html'];
    if (pathStr.includes('component.tsx')) return mockFileContents['component.tsx'];
    if (pathStr.includes('app.vue')) return mockFileContents['app.vue'];
    if (pathStr.includes('reset.css')) return mockFileContents['reset.css'];
    if (pathStr.includes('base.css')) return mockFileContents['base.css'];

    return '';
  });

  // デフォルトのファイル統計
  vi.mocked(fs.statSync).mockReturnValue({ size: 100 } as fs.Stats);

  // ファイル存在チェック - CSSファイル読み込みをスキップ
  vi.mocked(fs.existsSync).mockReturnValue(false);

  // promisify モック設定 - readFile用の適切なモック
  vi.mocked(promisify).mockImplementation((fn: unknown) => {
    if (fn === fs.readFile) {
      return vi.fn().mockImplementation(async (path: string | Buffer | URL, _encoding?: string) => {
        const filePath = path.toString();
        if (filePath.includes('test.html')) return mockFileContents['test.html'];
        if (filePath.includes('component.tsx')) return mockFileContents['component.tsx'];
        if (filePath.includes('app.vue')) return mockFileContents['app.vue'];
        if (filePath.includes('reset.css')) return mockFileContents['reset.css'];
        if (filePath.includes('base.css')) return mockFileContents['base.css'];
        return '';
      });
    }
    if (fn === fs.stat) {
      return vi.fn().mockResolvedValue({ size: 100 });
    }
    return vi.fn().mockResolvedValue('');
  });
}

// テスト用のサンプル設定
export const testConfigs = {
  minimal: {
    content: ['src/**/*.html'],
    includeResetCSS: false,
    includeBaseCSS: false,
    purge: {
      enabled: false,
    },
  },
  withPurge: {
    content: ['src/**/*.{html,tsx}'],
    purge: {
      enabled: true,
      content: ['src/**/*.{html,tsx}'],
      safelist: ['safe-class'],
    },
  },
  withTheme: {
    content: ['src/**/*.html'],
    apply: {
      'main-layout': 'w-lg mx-auto px-lg gap-x-md gap-y-lg gap-lg',
    },
  },
  full: {
    content: ['src/**/*.{html,js,jsx,ts,tsx,vue}'],
    includeResetCSS: true,
    includeBaseCSS: true,
    purge: {
      enabled: true,
      content: ['src/**/*.{html,js,jsx,ts,tsx,vue}'],
      safelist: ['protected-class', /^dynamic-/],
      blocklist: ['blocked-class'],
    },
    apply: {
      'main-layout': 'w-lg mx-auto px-lg gap-x-md gap-y-lg gap-lg',
    },
  },
};

// カスタム値のサンプルコンテンツ
export const customValueSamples = {
  spacing: `
    <div class="m-[20px] p-[1rem] gap-[2em]">
      <span class="mt-[calc(100%-20px)] px-[min(2rem,5vw)]">Custom Values</span>
    </div>
  `,
  width: `
    <div class="w-[100px] min-w-[200px] max-w-[calc(100%-40px)]">
      <span class="w-[50vw] min-w-[var(--min-width)]">Width Values</span>
    </div>
  `,
  height: `
    <div class="h-[100px] min-h-[200px] max-h-[calc(100%-40px)]">
      <span class="h-[50vh] min-h-[var(--min-height)]">Height Values</span>
    </div>
  `,
  zIndex: `
    <div class="z-[var(--z-index)]">
     <div class="z-[5]">Z Index Values</div>
    </div>
  `,
  order: `
    <div class="order-[var(--order)]">
      <div class="order-[5]">Order Values</div>
    </div>
  `,
  color: `
    <div class="text-[hsl(0,0%,0%/1)]">Color Values</div>
  `,
  fontSize: `
    <div class="font-size-[clamp(1rem,4vw,3rem)]">Font Size Values</div>
  `,
  complex: `
    <div class="p-[clamp(1rem,4vw,3rem)] m-[max(20px,2rem)] font-size-[clamp(1rem,4vw,3rem)]">
      <span class="gap-[min(1rem,3%)] w-[calc(50%-10px)] h-[minmax(200px)]">Complex</span>
    </div>
  `,
};

// Export mocks for use in tests are already defined above
