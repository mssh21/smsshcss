import { GridConfig } from '../../core/types';
import { escapeGridValue } from './utils';

// デフォルトのGrid Row Span設定
export const defaultRowSpan: Partial<GridConfig> = {
  'row-span-1': 'span 1 / span 1',
  'row-span-2': 'span 2 / span 2',
  'row-span-3': 'span 3 / span 3',
  'row-span-4': 'span 4 / span 4',
  'row-span-5': 'span 5 / span 5',
  'row-span-6': 'span 6 / span 6',
  'row-span-7': 'span 7 / span 7',
  'row-span-8': 'span 8 / span 8',
  'row-span-9': 'span 9 / span 9',
  'row-span-10': 'span 10 / span 10',
  'row-span-11': 'span 11 / span 11',
  'row-span-12': 'span 12 / span 12',
  'row-span-full': '1 / -1',
};

// プロパティマッピング
export const rowSpanPropertyMap: Record<string, string> = {
  'row-span-1': 'grid-row',
  'row-span-2': 'grid-row',
  'row-span-3': 'grid-row',
  'row-span-4': 'grid-row',
  'row-span-5': 'grid-row',
  'row-span-6': 'grid-row',
  'row-span-7': 'grid-row',
  'row-span-8': 'grid-row',
  'row-span-9': 'grid-row',
  'row-span-10': 'grid-row',
  'row-span-11': 'grid-row',
  'row-span-12': 'grid-row',
  'row-span-full': 'grid-row',
};

// カスタムGrid行スパンクラスを生成
export function generateCustomRowSpanClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-span-\\[${escapedValue}\\] { grid-row: span ${value} / span ${value}; }`;
}

// 任意のGrid行スパンクラスを生成
export function generateArbitraryRowSpan(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-span-\\[${escapedValue}\\] { grid-row: span ${value} / span ${value}; }`;
}
