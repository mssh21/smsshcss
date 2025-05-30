import { vi } from 'vitest';
import fs from 'fs';

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
  'test.html': '<div class="p-md m-sm block">Test</div>',
  'component.tsx': '<div className="flex p-lg">Component</div>',
  'app.vue': '<div class="grid gap-md">Vue Component</div>',
  'reset.css': '* { margin: 0; padding: 0; }',
  'base.css': 'body { font-family: sans-serif; }',
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
    theme: {
      spacing: {
        custom: '2rem',
        special: '3rem',
      },
      display: {
        'custom-flex': 'flex',
      },
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
    theme: {
      spacing: {
        custom: '2rem',
      },
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
  complex: `
    <div class="p-[clamp(1rem,4vw,3rem)] m-[max(20px,2rem)]">
      <span class="gap-[min(1rem,3%)] w-[calc(50%-10px)]">Complex</span>
    </div>
  `,
};
