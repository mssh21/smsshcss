import { createMultiPatternPlugin } from '../apply-system';
import { getSizeValue, normalizeCustomValue } from '../value-helpers';

/**
 * Flexbox用Applyプラグイン
 * Flex関連のユーティリティクラスをサポート
 */
export const flexboxPlugin = createMultiPatternPlugin(
  'flexbox',
  [
    {
      // Flex Direction: flex-row, flex-col など
      pattern: /^flex-(row|row-reverse|col|col-reverse)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, direction] = match;
        const directionMap: Record<string, string> = {
          row: 'row',
          'row-reverse': 'row-reverse',
          col: 'column',
          'col-reverse': 'column-reverse',
        };
        return `flex-direction: ${directionMap[direction]};`;
      },
    },
    {
      // Flex Wrap: flex-wrap, flex-nowrap, flex-wrap-reverse
      pattern: /^flex-(wrap|nowrap|wrap-reverse)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, wrap] = match;
        const wrapMap: Record<string, string> = {
          wrap: 'wrap',
          nowrap: 'nowrap',
          'wrap-reverse': 'wrap-reverse',
        };
        return `flex-wrap: ${wrapMap[wrap]};`;
      },
    },
    {
      // Justify Content: justify-start, justify-center など
      pattern: /^justify-(start|end|center|between|around|evenly)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, alignment] = match;
        const alignmentMap: Record<string, string> = {
          start: 'flex-start',
          end: 'flex-end',
          center: 'center',
          between: 'space-between',
          around: 'space-around',
          evenly: 'space-evenly',
        };
        return `justify-content: ${alignmentMap[alignment]};`;
      },
    },
    {
      // Align Items: items-start, items-center など
      pattern: /^items-(start|end|center|baseline|stretch)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, alignment] = match;
        const alignmentMap: Record<string, string> = {
          start: 'flex-start',
          end: 'flex-end',
          center: 'center',
          baseline: 'baseline',
          stretch: 'stretch',
        };
        return `align-items: ${alignmentMap[alignment]};`;
      },
    },
    {
      // Align Content: content-start, content-center など
      pattern: /^content-(start|end|center|between|around|evenly)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, alignment] = match;
        const alignmentMap: Record<string, string> = {
          start: 'flex-start',
          end: 'flex-end',
          center: 'center',
          between: 'space-between',
          around: 'space-around',
          evenly: 'space-evenly',
        };
        return `align-content: ${alignmentMap[alignment]};`;
      },
    },
    {
      // Align Self: self-auto, self-start など
      pattern: /^self-(auto|start|end|center|stretch)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, alignment] = match;
        const alignmentMap: Record<string, string> = {
          auto: 'auto',
          start: 'flex-start',
          end: 'flex-end',
          center: 'center',
          stretch: 'stretch',
        };
        return `align-self: ${alignmentMap[alignment]};`;
      },
    },
    {
      // Flex Basis: basis-auto, basis-1/2 など
      pattern: /^basis-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, size] = match;
        const value = getSizeValue(size);
        if (!value) return null;
        return `flex-basis: ${value};`;
      },
    },
    {
      // Flex Grow: grow, grow-0 など
      pattern: /^grow(-(.+))?$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, , value] = match;
        if (!value || value === undefined) {
          return 'flex-grow: 1;';
        } else {
          // カスタム値（[値]形式）の場合
          if (value.startsWith('[') && value.endsWith(']')) {
            return `flex-grow: ${normalizeCustomValue(value.slice(1, -1))};`;
          }
          return `flex-grow: ${value};`;
        }
      },
    },
    {
      // Flex Shrink: shrink, shrink-0 など
      pattern: /^shrink(-(.+))?$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, , value] = match;
        if (!value || value === undefined) {
          return 'flex-shrink: 1;';
        } else {
          // カスタム値（[値]形式）の場合
          if (value.startsWith('[') && value.endsWith(']')) {
            return `flex-shrink: ${normalizeCustomValue(value.slice(1, -1))};`;
          }
          return `flex-shrink: ${value};`;
        }
      },
    },
    {
      // Flex Shorthand: flex-auto, flex-initial, flex-none
      pattern: /^flex-(auto|initial|none)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, shorthand] = match;
        const shorthandMap: Record<string, string> = {
          auto: 'flex: 1 1 auto;',
          initial: 'flex: 0 1 auto;',
          none: 'flex: none;',
        };
        return shorthandMap[shorthand];
      },
    },
    {
      // Flex カスタム値: flex-[1_1_0%]
      pattern: /^flex-\[(.+)\]$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, value] = match;
        return `flex: ${normalizeCustomValue(value)};`;
      },
    },
  ],
  8
);
