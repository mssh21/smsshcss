/**
 * トークンのカスタマイズをサポートするユーティリティ関数
 */
import { ThemeConfig } from '../config';

/**
 * ベーストークンとカスタムテーマ設定をマージする関数
 * @param baseTokens ベーストークン
 * @param customTokens カスタムトークン（オプション）
 * @returns マージされたトークン
 */
export function mergeTokens<T extends Record<string, any>>(
  baseTokens: T,
  customTokens?: Record<string, any>
): T {
  if (!customTokens) {
    return { ...baseTokens };
  }

  const result = { ...baseTokens };

  // カスタムトークンを適用
  for (const [key, value] of Object.entries(customTokens)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * 設定からトークンを解決する関数
 * @param tokenName トークン名 (例: 'colors', 'fontSize')
 * @param baseTokens ベーストークン
 * @param theme テーマ設定
 * @returns 解決されたトークン
 */
export function resolveTokens<T extends Record<string, any>>(
  tokenName: keyof ThemeConfig,
  baseTokens: T,
  theme?: ThemeConfig
): T {
  // デバッグ用ログ - テーマ設定の検証
  console.log(`[resolveTokens] Resolving ${tokenName}:`, {
    hasTheme: !!theme,
    hasTokenInTheme: theme && !!theme[tokenName],
    themeValue: theme && theme[tokenName]
  });

  if (!theme || !theme[tokenName]) {
    console.log(`[resolveTokens] No theme settings for ${tokenName}, using defaults`);
    return { ...baseTokens };
  }

  // マージしたトークン
  const merged = mergeTokens(baseTokens, theme[tokenName] as Record<string, any>);

  // テーマとデフォルト値の違いを確認
  const differences: Record<string, { default: any, themed: any }> = {};
  for (const key in merged) {
    if (baseTokens[key] !== merged[key]) {
      differences[key] = { default: baseTokens[key], themed: merged[key] };
    }
  }

  console.log(`[resolveTokens] Merged tokens for ${tokenName}:`, {
    differences,
    result: merged
  });

  return merged;
}
