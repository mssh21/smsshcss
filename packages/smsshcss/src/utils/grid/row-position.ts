import { GridConfig } from '../../core/types';
import { escapeGridValue } from './utils';

// デフォルトのGrid Row Start/End設定
export const defaultRowPosition: Partial<GridConfig> = {
  // Grid Row Start
  'row-start-1': '1',
  'row-start-2': '2',
  'row-start-3': '3',
  'row-start-4': '4',
  'row-start-5': '5',
  'row-start-6': '6',
  'row-start-7': '7',
  'row-start-8': '8',
  'row-start-9': '9',
  'row-start-10': '10',
  'row-start-11': '11',
  'row-start-12': '12',
  'row-start-auto': 'auto',

  // Grid Row End
  'row-end-1': '1',
  'row-end-2': '2',
  'row-end-3': '3',
  'row-end-4': '4',
  'row-end-5': '5',
  'row-end-6': '6',
  'row-end-7': '7',
  'row-end-8': '8',
  'row-end-9': '9',
  'row-end-10': '10',
  'row-end-11': '11',
  'row-end-12': '12',
  'row-end-auto': 'auto',
};

// プロパティマッピング
export const rowPositionPropertyMap: Record<string, string> = {
  // Grid Row Start
  'row-start-1': 'grid-row-start',
  'row-start-2': 'grid-row-start',
  'row-start-3': 'grid-row-start',
  'row-start-4': 'grid-row-start',
  'row-start-5': 'grid-row-start',
  'row-start-6': 'grid-row-start',
  'row-start-7': 'grid-row-start',
  'row-start-8': 'grid-row-start',
  'row-start-9': 'grid-row-start',
  'row-start-10': 'grid-row-start',
  'row-start-11': 'grid-row-start',
  'row-start-12': 'grid-row-start',
  'row-start-auto': 'grid-row-start',

  // Grid Row End
  'row-end-1': 'grid-row-end',
  'row-end-2': 'grid-row-end',
  'row-end-3': 'grid-row-end',
  'row-end-4': 'grid-row-end',
  'row-end-5': 'grid-row-end',
  'row-end-6': 'grid-row-end',
  'row-end-7': 'grid-row-end',
  'row-end-8': 'grid-row-end',
  'row-end-9': 'grid-row-end',
  'row-end-10': 'grid-row-end',
  'row-end-11': 'grid-row-end',
  'row-end-12': 'grid-row-end',
  'row-end-auto': 'grid-row-end',
};

// カスタムGrid行開始位置クラスを生成
export function generateCustomRowStartClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-start-\\[${escapedValue}\\] { grid-row-start: ${value}; }`;
}

// カスタムGrid行終了位置クラスを生成
export function generateCustomRowEndClass(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-end-\\[${escapedValue}\\] { grid-row-end: ${value}; }`;
}

// 任意のGrid行開始位置クラスを生成
export function generateArbitraryRowStart(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-start-\\[${escapedValue}\\] { grid-row-start: ${value}; }`;
}

// 任意のGrid行終了位置クラスを生成
export function generateArbitraryRowEnd(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-end-\\[${escapedValue}\\] { grid-row-end: ${value}; }`;
}
