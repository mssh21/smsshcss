import { vi } from 'vitest';

// コア設定を直接インポート（Single Source of Truth）
// import {
//   defaultConfig,
//   getColorValue,
//   getFontSizeValue,
//   getSpacingValue,
//   getSizeValue,
//   type DefaultConfig,
// } from '../../../../smsshcss/src/config';

// コア設定取得関数（統一的なインターフェース）（使用箇所がないためコメントアウト）
// const getCoreConfig = (): {
//   defaultConfig: DefaultConfig;
//   getColorValue: (key: string) => string | undefined;
//   getFontSizeValue: (key: string) => string | undefined;
//   getSpacingValue: (key: string) => string | undefined;
//   getSizeValue: (key: string) => string | undefined;
// } => ({
//   defaultConfig,
//   getColorValue,
//   getFontSizeValue,
//   getSpacingValue,
//   getSizeValue,
// });

// smsshcssパッケージを部分モック（実際のコアライブラリを使用）
vi.mock('smsshcss', async (importOriginal) => {
  const actual = await importOriginal<typeof import('smsshcss')>();
  return {
    ...actual, // 実際のsmsshcssの関数を全てインポート
    // テストパフォーマンスに影響する特定の関数のみモック
    generatePurgeReport: vi.fn().mockResolvedValue({
      totalClasses: 100,
      usedClasses: 50,
      purgedClasses: 50,
      buildTime: 100,
    }),
  };
});

// モッククリア関数
export function clearAllMocks(): void {
  vi.clearAllMocks();
}
