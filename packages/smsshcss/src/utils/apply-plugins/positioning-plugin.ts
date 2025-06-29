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
    // Top, right, bottom, left with arbitrary values
    /^(top|right|bottom|left)-\[([^\]]+)\]$/,
    // Inset utilities
    /^inset-\[([^\]]+)\]$/,
    /^inset-x-\[([^\]]+)\]$/,
    /^inset-y-\[([^\]]+)\]$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    // Basic position classes
    if (match[0].match(/^(static|relative|absolute|fixed|sticky)$/)) {
      const position = match[0];
      if (defaultPositioning[position as keyof typeof defaultPositioning]) {
        return `position: ${defaultPositioning[position as keyof typeof defaultPositioning]};`;
      }
    }

    // Top, right, bottom, left with arbitrary values
    const positionMatch = utilityClass.match(/^(top|right|bottom|left)-\[([^\]]+)\]$/);
    if (positionMatch) {
      const [, property, value] = positionMatch;
      return `${property}: ${value};`;
    }

    // Inset (all directions)
    const insetMatch = utilityClass.match(/^inset-\[([^\]]+)\]$/);
    if (insetMatch) {
      const [, value] = insetMatch;
      return `top: ${value}; right: ${value}; bottom: ${value}; left: ${value};`;
    }

    // Inset-x (horizontal)
    const insetXMatch = utilityClass.match(/^inset-x-\[([^\]]+)\]$/);
    if (insetXMatch) {
      const [, value] = insetXMatch;
      return `left: ${value}; right: ${value};`;
    }

    // Inset-y (vertical)
    const insetYMatch = utilityClass.match(/^inset-y-\[([^\]]+)\]$/);
    if (insetYMatch) {
      const [, value] = insetYMatch;
      return `top: ${value}; bottom: ${value};`;
    }

    return null;
  },
  priority: 6,
});
