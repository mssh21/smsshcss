import { createMultiPatternPlugin } from '../apply-system';
import { getSpacingValue } from '../value-helpers';

/**
 * スペーシング用Applyプラグイン
 * 既存のvalue-helpersを活用してマージン・パディング・gapをサポート
 */
export const spacingPlugin = createMultiPatternPlugin(
  'spacing',
  [
    {
      // マージン・パディング: m-4, mt-2, px-6 など
      pattern: /^(m|p)(t|r|b|l|x|y)?-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, property, direction, size] = match;
        const prop = property === 'm' ? 'margin' : 'padding';
        const value = getSpacingValue(size);

        if (!value) return null;

        if (direction === 'x') {
          return `${prop}-inline: ${value};`;
        } else if (direction === 'y') {
          return `${prop}-block: ${value};`;
        } else if (direction) {
          const dirMap: Record<string, string> = {
            t: 'block-start',
            r: 'inline-end',
            b: 'block-end',
            l: 'inline-start',
          };
          return `${prop}-${dirMap[direction]}: ${value};`;
        } else {
          return `${prop}: ${value};`;
        }
      },
    },
    {
      // Gap: gap-4, gap-x-2, gap-y-6 など
      pattern: /^gap(-([xy]))?-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, , direction, size] = match;
        const value = getSpacingValue(size);

        if (!value) return null;

        if (direction === 'x') {
          return `column-gap: ${value};`;
        } else if (direction === 'y') {
          return `row-gap: ${value};`;
        } else {
          return `gap: ${value};`;
        }
      },
    },
  ],
  10 // 高優先度
);
