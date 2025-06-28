import { createApplyPlugin } from '../apply-system';

// デフォルトのPositioning設定（既存コードから抽出）
const defaultPositioning = {
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  relative: 'relative',
  sticky: 'sticky',
};

/**
 * Positioning用Applyプラグイン
 * position関連のユーティリティクラスをサポート
 */
export const positioningPlugin = createApplyPlugin({
  name: 'positioning',
  patterns: [
    // Position: static, relative, absolute, fixed, sticky
    /^(static|relative|absolute|fixed|sticky)$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    const [, position] = match;

    // 事前定義された値を確認
    if (defaultPositioning[position as keyof typeof defaultPositioning]) {
      return `position: ${defaultPositioning[position as keyof typeof defaultPositioning]};`;
    }

    return null;
  },
  priority: 6,
});
