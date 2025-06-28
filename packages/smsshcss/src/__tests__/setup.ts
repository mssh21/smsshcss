import { vi } from 'vitest';
import fs from 'fs';

// テスト環境の設定
process.env.NODE_ENV = 'test';

// ファイルシステムのモック
vi.mock('fs');
vi.mock('fs-extra');
vi.mock('fast-glob', () => ({
  default: vi.fn(),
}));

// TypeScript型キャストのヘルパー
export const mockFs = vi.mocked(fs);
export const mockGlob = vi.mocked((await import('fast-glob')).default);

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

  // デフォルトのglob結果
  mockGlob.mockResolvedValue(['src/test.html', 'src/component.tsx']);

  // デフォルトのファイル読み込み
  mockFs.readFileSync.mockImplementation((path: string | Buffer | URL) => {
    const pathStr = path.toString();

    if (pathStr.includes('test.html')) return mockFileContents['test.html'];
    if (pathStr.includes('component.tsx')) return mockFileContents['component.tsx'];
    if (pathStr.includes('app.vue')) return mockFileContents['app.vue'];
    if (pathStr.includes('reset.css')) return mockFileContents['reset.css'];
    if (pathStr.includes('base.css')) return mockFileContents['base.css'];

    return '';
  });

  // デフォルトのファイル統計
  mockFs.statSync.mockReturnValue({ size: 100 } as fs.Stats);

  // ファイル存在チェック
  mockFs.existsSync.mockImplementation((path: string | Buffer | URL) => {
    const pathStr = path.toString();
    return pathStr.includes('.css') || pathStr.includes('.html') || pathStr.includes('.tsx');
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
