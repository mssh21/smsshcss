import { createMultiPatternPlugin } from '../apply-system';
import { normalizeCustomValue, getSizeValue } from '../value-helpers';
import { defaultColumns } from '../grid/columns';
import { defaultRows } from '../grid/rows';
import { defaultColumnSpan } from '../grid/column-span';
import { defaultRowSpan } from '../grid/row-span';
import { defaultColumnPosition } from '../grid/column-position';
import { defaultRowPosition } from '../grid/row-position';
import { defaultAutoFlow } from '../grid/auto-flow';

/**
 * Grid用Applyプラグイン
 * Grid関連のユーティリティクラスをサポート
 */
export const gridPlugin = createMultiPatternPlugin(
  'grid',
  [
    {
      // Grid Template Columns: grid-cols-1, grid-cols-12, etc.
      pattern: /^grid-cols-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, cols] = match;
        const key = `grid-cols-${cols}`;

        // 事前定義された値を確認
        if (defaultColumns[key as keyof typeof defaultColumns]) {
          return `grid-template-columns: ${defaultColumns[key as keyof typeof defaultColumns]};`;
        }

        // カスタム値の場合 (例: grid-cols-[200px_1fr_100px])
        if (cols.startsWith('[') && cols.endsWith(']')) {
          const value = cols.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);

          // 数値の場合はrepeat関数を使用
          if (/^\d+$/.test(normalizedValue)) {
            return `grid-template-columns: repeat(${normalizedValue}, minmax(0, 1fr));`;
          }

          // その他の場合は値をそのまま使用
          return `grid-template-columns: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Grid Template Rows: grid-rows-1, grid-rows-6, etc.
      pattern: /^grid-rows-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, rows] = match;
        const key = `grid-rows-${rows}`;

        // 事前定義された値を確認
        if (defaultRows[key as keyof typeof defaultRows]) {
          return `grid-template-rows: ${defaultRows[key as keyof typeof defaultRows]};`;
        }

        // カスタム値の場合
        if (rows.startsWith('[') && rows.endsWith(']')) {
          const value = rows.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);

          // 数値の場合はrepeat関数を使用
          if (/^\d+$/.test(normalizedValue)) {
            return `grid-template-rows: repeat(${normalizedValue}, minmax(0, 1fr));`;
          }

          return `grid-template-rows: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Column Span: col-span-1, col-span-full, etc.
      pattern: /^col-span-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, span] = match;
        const key = `col-span-${span}`;

        if (defaultColumnSpan[key as keyof typeof defaultColumnSpan]) {
          return `grid-column: ${defaultColumnSpan[key as keyof typeof defaultColumnSpan]};`;
        }

        // カスタム値の場合
        if (span.startsWith('[') && span.endsWith(']')) {
          const value = span.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-column: span ${normalizedValue} / span ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Row Span: row-span-1, row-span-full, etc.
      pattern: /^row-span-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, span] = match;
        const key = `row-span-${span}`;

        if (defaultRowSpan[key as keyof typeof defaultRowSpan]) {
          return `grid-row: ${defaultRowSpan[key as keyof typeof defaultRowSpan]};`;
        }

        // カスタム値の場合
        if (span.startsWith('[') && span.endsWith(']')) {
          const value = span.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-row: span ${normalizedValue} / span ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Column Start: col-start-1, col-start-auto, etc.
      pattern: /^col-start-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, start] = match;
        const key = `col-start-${start}`;

        if (defaultColumnPosition[key as keyof typeof defaultColumnPosition]) {
          return `grid-column-start: ${defaultColumnPosition[key as keyof typeof defaultColumnPosition]};`;
        }

        // カスタム値の場合
        if (start.startsWith('[') && start.endsWith(']')) {
          const value = start.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-column-start: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Column End: col-end-1, col-end-auto, etc.
      pattern: /^col-end-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, end] = match;
        const key = `col-end-${end}`;

        if (defaultColumnPosition[key as keyof typeof defaultColumnPosition]) {
          return `grid-column-end: ${defaultColumnPosition[key as keyof typeof defaultColumnPosition]};`;
        }

        // カスタム値の場合
        if (end.startsWith('[') && end.endsWith(']')) {
          const value = end.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-column-end: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Row Start: row-start-1, row-start-auto, etc.
      pattern: /^row-start-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, start] = match;
        const key = `row-start-${start}`;

        if (defaultRowPosition[key as keyof typeof defaultRowPosition]) {
          return `grid-row-start: ${defaultRowPosition[key as keyof typeof defaultRowPosition]};`;
        }

        // カスタム値の場合
        if (start.startsWith('[') && start.endsWith(']')) {
          const value = start.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-row-start: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Row End: row-end-1, row-end-auto, etc.
      pattern: /^row-end-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, end] = match;
        const key = `row-end-${end}`;

        if (defaultRowPosition[key as keyof typeof defaultRowPosition]) {
          return `grid-row-end: ${defaultRowPosition[key as keyof typeof defaultRowPosition]};`;
        }

        // カスタム値の場合
        if (end.startsWith('[') && end.endsWith(']')) {
          const value = end.slice(1, -1);
          const normalizedValue = normalizeCustomValue(value);
          return `grid-row-end: ${normalizedValue};`;
        }

        return null;
      },
    },
    {
      // Grid Auto Flow: grid-flow-row, grid-flow-col, etc.
      pattern: /^grid-flow-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, flow] = match;
        const key = `grid-flow-${flow}`;

        if (defaultAutoFlow[key as keyof typeof defaultAutoFlow]) {
          return `grid-auto-flow: ${defaultAutoFlow[key as keyof typeof defaultAutoFlow]};`;
        }

        return null;
      },
    },
    {
      // Gap: gap-1, gap-md, etc. (グリッド用)
      pattern: /^gap-(.+)$/,
      handler: (utilityClass: string, match: RegExpMatchArray): string | null => {
        const [, size] = match;

        // value-helpersのgetSizeValueを使用してサイズ値を取得
        const value = getSizeValue(size);

        if (value) {
          return `gap: ${value};`;
        }

        return null;
      },
    },
  ],
  7 // display pluginより高い優先度
);
