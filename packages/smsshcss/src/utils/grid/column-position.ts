import { GridConfig } from '../../core/types';
import { escapeGridValue } from './utils';

// デフォルトのGrid Column Start/End設定
export const defaultColumnPosition: Partial<GridConfig> = {
  // Grid Column Start
  'col-start-1': '1',
  'col-start-2': '2',
  'col-start-3': '3',
  'col-start-4': '4',
  'col-start-5': '5',
  'col-start-6': '6',
  'col-start-7': '7',
  'col-start-8': '8',
  'col-start-9': '9',
  'col-start-10': '10',
  'col-start-11': '11',
  'col-start-12': '12',
  'col-start-auto': 'auto',

  // Grid Column End
  'col-end-1': '1',
  'col-end-2': '2',
  'col-end-3': '3',
  'col-end-4': '4',
  'col-end-5': '5',
  'col-end-6': '6',
  'col-end-7': '7',
  'col-end-8': '8',
  'col-end-9': '9',
  'col-end-10': '10',
  'col-end-11': '11',
  'col-end-12': '12',
  'col-end-auto': 'auto',
};

// プロパティマッピング
export const columnPositionPropertyMap: Record<string, string> = {
  // Grid Column Start
  'col-start-1': 'grid-column-start',
  'col-start-2': 'grid-column-start',
  'col-start-3': 'grid-column-start',
  'col-start-4': 'grid-column-start',
  'col-start-5': 'grid-column-start',
  'col-start-6': 'grid-column-start',
  'col-start-7': 'grid-column-start',
  'col-start-8': 'grid-column-start',
  'col-start-9': 'grid-column-start',
  'col-start-10': 'grid-column-start',
  'col-start-11': 'grid-column-start',
  'col-start-12': 'grid-column-start',
  'col-start-auto': 'grid-column-start',

  // Grid Column End
  'col-end-1': 'grid-column-end',
  'col-end-2': 'grid-column-end',
  'col-end-3': 'grid-column-end',
  'col-end-4': 'grid-column-end',
  'col-end-5': 'grid-column-end',
  'col-end-6': 'grid-column-end',
  'col-end-7': 'grid-column-end',
  'col-end-8': 'grid-column-end',
  'col-end-9': 'grid-column-end',
  'col-end-10': 'grid-column-end',
  'col-end-11': 'grid-column-end',
  'col-end-12': 'grid-column-end',
  'col-end-auto': 'grid-column-end',
};

// カスタムGrid列開始位置クラスを生成
export function generateCustomColumnStartClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-start-\\[${escapedValue}\\] { grid-column-start: ${value}; }`;
}

// カスタムGrid列終了位置クラスを生成
export function generateCustomColumnEndClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-end-\\[${escapedValue}\\] { grid-column-end: ${value}; }`;
}

// 任意のGrid列開始位置クラスを生成
export function generateArbitraryColumnStart(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-start-\\[${escapedValue}\\] { grid-column-start: ${value}; }`;
}

// 任意のGrid列終了位置クラスを生成
export function generateArbitraryColumnEnd(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-end-\\[${escapedValue}\\] { grid-column-end: ${value}; }`;
}
