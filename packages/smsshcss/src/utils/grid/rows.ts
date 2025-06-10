import { GridConfig } from '../../core/types';
import { escapeGridValue, formatGridCSSValue } from './utils';

// デフォルトのGrid Template Rows設定
export const defaultRows: Partial<GridConfig> = {
  'grid-rows-1': 'repeat(1, minmax(0, 1fr))',
  'grid-rows-2': 'repeat(2, minmax(0, 1fr))',
  'grid-rows-3': 'repeat(3, minmax(0, 1fr))',
  'grid-rows-4': 'repeat(4, minmax(0, 1fr))',
  'grid-rows-5': 'repeat(5, minmax(0, 1fr))',
  'grid-rows-6': 'repeat(6, minmax(0, 1fr))',
  'grid-rows-7': 'repeat(7, minmax(0, 1fr))',
  'grid-rows-8': 'repeat(8, minmax(0, 1fr))',
  'grid-rows-9': 'repeat(9, minmax(0, 1fr))',
  'grid-rows-10': 'repeat(10, minmax(0, 1fr))',
  'grid-rows-11': 'repeat(11, minmax(0, 1fr))',
  'grid-rows-12': 'repeat(12, minmax(0, 1fr))',
  'grid-rows-none': 'none',
  'grid-rows-subgrid': 'subgrid',
};

// プロパティマッピング
export const rowPropertyMap: Record<string, string> = {
  'grid-rows-1': 'grid-template-rows',
  'grid-rows-2': 'grid-template-rows',
  'grid-rows-3': 'grid-template-rows',
  'grid-rows-4': 'grid-template-rows',
  'grid-rows-5': 'grid-template-rows',
  'grid-rows-6': 'grid-template-rows',
  'grid-rows-7': 'grid-template-rows',
  'grid-rows-8': 'grid-template-rows',
  'grid-rows-9': 'grid-template-rows',
  'grid-rows-10': 'grid-template-rows',
  'grid-rows-11': 'grid-template-rows',
  'grid-rows-12': 'grid-template-rows',
  'grid-rows-none': 'grid-template-rows',
  'grid-rows-subgrid': 'grid-template-rows',
};

// カスタムGrid行クラスを生成
export function generateCustomGridRowsClass(value: string): string {
  // CSS数学関数およびグリッド固有関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat|var)\s*\(/;

  // 元の値を復元（CSS値用）- CSS関数が含まれている場合は専用フォーマット処理
  const originalValue = cssFunctions.test(value) ? formatGridCSSValue(value) : value;

  // 数値の場合はrepeat関数を使用、それ以外はカンマをスペースに変換
  const isNumeric = /^\d+$/.test(value);
  const isCSSVariable = /^var\(--/.test(value);
  let cssValue;
  if (isNumeric || isCSSVariable) {
    cssValue = `repeat(${originalValue}, minmax(0, 1fr))`;
  } else if (cssFunctions.test(value)) {
    // CSS関数が含まれている場合は、既にフォーマット済みのoriginalValueを使用
    cssValue = originalValue;
  } else {
    // 通常の値の場合のみカンマをスペースに変換
    cssValue = originalValue.replace(/,/g, ' ');
  }

  const escapedValue = escapeGridValue(value);
  return `.grid-rows-\\[${escapedValue}\\] { grid-template-rows: ${cssValue}; }`;
}

// 任意のGrid行クラスを生成
export function generateArbitraryGridRows(value: string): string {
  const isNumeric = /^\d+$/.test(value);
  const isCSSVariable = /^var\(--/.test(value);
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat|var)\s*\(/;

  let cssValue;
  if (isNumeric || isCSSVariable) {
    cssValue = `repeat(${value}, minmax(0, 1fr))`;
  } else if (cssFunctions.test(value)) {
    // CSS関数が含まれている場合は、formatGridCSSValueで処理
    cssValue = formatGridCSSValue(value);
  } else {
    // 通常の値の場合のみカンマをスペースに変換
    cssValue = value.replace(/,/g, ' ');
  }

  const escapedValue = escapeGridValue(value);
  return `.grid-rows-\\[${escapedValue}\\] { grid-template-rows: ${cssValue}; }`;
}
