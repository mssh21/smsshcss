import { SizeConfig } from '../core/types';

/**
 * Grid用のサイズ設定
 * Grid columns/rows の値を定義
 */
export const defaultGridConfig: SizeConfig = {
  none: '0',
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  '7': 'repeat(7, minmax(0, 1fr))',
  '8': 'repeat(8, minmax(0, 1fr))',
  '9': 'repeat(9, minmax(0, 1fr))',
  '10': 'repeat(10, minmax(0, 1fr))',
  '11': 'repeat(11, minmax(0, 1fr))',
  '12': 'repeat(12, minmax(0, 1fr))',
  subgrid: 'subgrid',
};

/**
 * カスタムGridクラス値を処理するヘルパー関数
 * @param size - Grid size value
 * @returns Grid template value or null
 */
export function getGridValueFromConfig(size: string): string | null {
  if (!size) return null;

  // 設定ファイルの値をチェック
  if (defaultGridConfig[size]) {
    return defaultGridConfig[size];
  }

  // 数値の場合は repeat() で包む
  if (/^\d+$/.test(size)) {
    return `repeat(${size}, minmax(0, 1fr))`;
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // 数値の場合
    if (/^\d+$/.test(customValue)) {
      return `repeat(${customValue}, minmax(0, 1fr))`;
    }

    // カンマ区切りのテンプレート値の場合、カンマをスペースに変換
    if (customValue.includes(',')) {
      customValue = customValue.replace(/,/g, ' ');
    }

    return customValue;
  }

  return null;
}
