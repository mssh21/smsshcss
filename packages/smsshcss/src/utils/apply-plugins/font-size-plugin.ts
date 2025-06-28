import { createApplyPlugin } from '../apply-system';
import { normalizeCustomValue } from '../value-helpers';
import { defaultFontSizeConfig } from '../../config/fontSizeConfig';

/**
 * FontSize用Applyプラグイン
 * font-size関連のユーティリティクラスをサポート
 */
export const fontSizePlugin = createApplyPlugin({
  name: 'font-size',
  patterns: [
    // Font Size: font-size-sm, font-size-lg など
    /^font-size-(.+)$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    const [, size] = match;
    const key = `font-size-${size}`;

    // 事前定義された値を確認
    if (defaultFontSizeConfig[key as keyof typeof defaultFontSizeConfig]) {
      return `font-size: ${defaultFontSizeConfig[key as keyof typeof defaultFontSizeConfig]};`;
    }

    // カスタム値の場合 (例: font-size-[16px])
    if (size.startsWith('[') && size.endsWith(']')) {
      const value = size.slice(1, -1);
      const normalizedValue = normalizeCustomValue(value);
      return `font-size: ${normalizedValue};`;
    }

    return null;
  },
  priority: 6,
});
