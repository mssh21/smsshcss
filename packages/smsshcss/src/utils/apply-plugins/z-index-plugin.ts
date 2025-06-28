import { createApplyPlugin } from '../apply-system';
import { normalizeCustomValue } from '../value-helpers';

// デフォルトのZ-Index設定（既存コードから抽出）
const defaultZIndex = {
  'z-0': '0',
  'z-10': '10',
  'z-20': '20',
  'z-30': '30',
  'z-40': '40',
  'z-50': '50',
  'z-auto': 'auto',
};

/**
 * Z-Index用Applyプラグイン
 * z-index関連のユーティリティクラスをサポート
 */
export const zIndexPlugin = createApplyPlugin({
  name: 'z-index',
  patterns: [
    // Z-Index: z-0, z-10, z-auto など
    /^z-(.+)$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    const [, zIndex] = match;
    const key = `z-${zIndex}`;

    // 事前定義された値を確認
    if (defaultZIndex[key as keyof typeof defaultZIndex]) {
      return `z-index: ${defaultZIndex[key as keyof typeof defaultZIndex]};`;
    }

    // カスタム値の場合 (例: z-[999])
    if (zIndex.startsWith('[') && zIndex.endsWith(']')) {
      const value = zIndex.slice(1, -1);
      const normalizedValue = normalizeCustomValue(value);
      return `z-index: ${normalizedValue};`;
    }

    return null;
  },
  priority: 6,
});
