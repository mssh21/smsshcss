import { GridConfig } from '../../core/types';
import { escapeGridValue } from './utils';

// デフォルトのGrid Column Span設定
export const defaultColumnSpan: Partial<GridConfig> = {
  'col-span-1': 'span 1 / span 1',
  'col-span-2': 'span 2 / span 2',
  'col-span-3': 'span 3 / span 3',
  'col-span-4': 'span 4 / span 4',
  'col-span-5': 'span 5 / span 5',
  'col-span-6': 'span 6 / span 6',
  'col-span-7': 'span 7 / span 7',
  'col-span-8': 'span 8 / span 8',
  'col-span-9': 'span 9 / span 9',
  'col-span-10': 'span 10 / span 10',
  'col-span-11': 'span 11 / span 11',
  'col-span-12': 'span 12 / span 12',
  'col-span-full': '1 / -1',
};

// プロパティマッピング
export const columnSpanPropertyMap: Record<string, string> = {
  'col-span-1': 'grid-column',
  'col-span-2': 'grid-column',
  'col-span-3': 'grid-column',
  'col-span-4': 'grid-column',
  'col-span-5': 'grid-column',
  'col-span-6': 'grid-column',
  'col-span-7': 'grid-column',
  'col-span-8': 'grid-column',
  'col-span-9': 'grid-column',
  'col-span-10': 'grid-column',
  'col-span-11': 'grid-column',
  'col-span-12': 'grid-column',
  'col-span-full': 'grid-column',
};

// カスタムGrid列スパンクラスを生成
export function generateCustomColumnSpanClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-span-\\[${escapedValue}\\] { grid-column: span ${value} / span ${value}; }`;
}

// 任意のGrid列スパンクラスを生成
export function generateArbitraryColumnSpan(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-span-\\[${escapedValue}\\] { grid-column: span ${value} / span ${value}; }`;
}
