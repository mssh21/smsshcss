import { createMultiPatternPlugin } from '../apply-system';
import { getSizeValue } from '../value-helpers';

/**
 * サイズ用Applyプラグイン
 * 幅・高さ関連のユーティリティクラスをサポート
 */
export const sizePlugin = createMultiPatternPlugin(
  'size',
  [
    {
      // 幅: w-full, min-w-0, max-w-screen など
      pattern: /^(min-|max-)?w-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, prefix, size] = match;
        const prop = prefix ? `${prefix.slice(0, -1)}-width` : 'width';
        const value = getSizeValue(size);
        if (!value) return null;
        return `${prop}: ${value};`;
      },
    },
    {
      // 高さ: h-screen, min-h-full, max-h-96 など
      pattern: /^(min-|max-)?h-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, prefix, size] = match;
        const prop = prefix ? `${prefix.slice(0, -1)}-height` : 'height';
        const value = getSizeValue(size);
        if (!value) return null;
        return `${prop}: ${value};`;
      },
    },
  ],
  9
);
