import { createMultiPatternPlugin } from '../apply-system';
import { getColorValue } from '../value-helpers';

/**
 * カラー用Applyプラグイン
 * テキスト、背景、ボーダー、塗りつぶし色をサポート
 */
export const colorPlugin = createMultiPatternPlugin(
  'color',
  [
    {
      // テキスト色: text-red-500, text-blue など
      pattern: /^text-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, colorName] = match;
        const colorValue = getColorValue(colorName);
        if (!colorValue) return null;
        return `color: ${colorValue};`;
      },
    },
    {
      // 背景色: bg-red-500, bg-blue など
      pattern: /^bg-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, colorName] = match;
        const colorValue = getColorValue(colorName);
        if (!colorValue) return null;
        return `background-color: ${colorValue};`;
      },
    },
    {
      // ボーダー色: border-red-500, border-blue など
      pattern: /^border-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, colorName] = match;
        const colorValue = getColorValue(colorName);
        if (!colorValue) return null;
        return `border-color: ${colorValue};`;
      },
    },
    {
      // 塗りつぶし色: fill-red-500, fill-blue など
      pattern: /^fill-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, colorName] = match;
        const colorValue = getColorValue(colorName);
        if (!colorValue) return null;
        return `fill: ${colorValue};`;
      },
    },
  ],
  8
);
