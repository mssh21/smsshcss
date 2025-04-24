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
  if (!theme || !theme[tokenName]) {
    return { ...baseTokens };
  }

  return mergeTokens(baseTokens, theme[tokenName] as Record<string, any>);
} 