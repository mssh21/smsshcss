import { GridConfig } from '../../core/types';
import { escapeGridValue, formatGridCSSValue } from './utils';

// デフォルトのGrid Template Columns設定
export const defaultColumns: Partial<GridConfig> = {
  'grid-cols-1': 'repeat(1, minmax(0, 1fr))',
  'grid-cols-2': 'repeat(2, minmax(0, 1fr))',
  'grid-cols-3': 'repeat(3, minmax(0, 1fr))',
  'grid-cols-4': 'repeat(4, minmax(0, 1fr))',
  'grid-cols-5': 'repeat(5, minmax(0, 1fr))',
  'grid-cols-6': 'repeat(6, minmax(0, 1fr))',
  'grid-cols-7': 'repeat(7, minmax(0, 1fr))',
  'grid-cols-8': 'repeat(8, minmax(0, 1fr))',
  'grid-cols-9': 'repeat(9, minmax(0, 1fr))',
  'grid-cols-10': 'repeat(10, minmax(0, 1fr))',
  'grid-cols-11': 'repeat(11, minmax(0, 1fr))',
  'grid-cols-12': 'repeat(12, minmax(0, 1fr))',
  'grid-cols-none': 'none',
  'grid-cols-subgrid': 'subgrid',
};

// プロパティマッピング
export const columnPropertyMap: Record<string, string> = {
  'grid-cols-1': 'grid-template-columns',
  'grid-cols-2': 'grid-template-columns',
  'grid-cols-3': 'grid-template-columns',
  'grid-cols-4': 'grid-template-columns',
  'grid-cols-5': 'grid-template-columns',
  'grid-cols-6': 'grid-template-columns',
  'grid-cols-7': 'grid-template-columns',
  'grid-cols-8': 'grid-template-columns',
  'grid-cols-9': 'grid-template-columns',
  'grid-cols-10': 'grid-template-columns',
  'grid-cols-11': 'grid-template-columns',
  'grid-cols-12': 'grid-template-columns',
  'grid-cols-none': 'grid-template-columns',
  'grid-cols-subgrid': 'grid-template-columns',
};

// カスタムGrid列クラスを生成
export function generateCustomGridColsClass(value: string): string {
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
  return `.grid-cols-\\[${escapedValue}\\] { grid-template-columns: ${cssValue}; }`;
}

// 任意のGrid列クラスを生成
export function generateArbitraryGridCols(value: string): string {
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
  return `.grid-cols-\\[${escapedValue}\\] { grid-template-columns: ${cssValue}; }`;
}
