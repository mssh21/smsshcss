// =============================================================================
// SmsshCSS Core Configuration Index
// =============================================================================
// このファイルはすべてのデフォルト設定の統合エクスポートを提供します
// Single Source of Truth として機能し、他のパッケージがこの設定を
// 直接インポートして利用できます

// 個別の設定をインポート
import { defaultColorConfig } from './colorConfig';
import { defaultFontSizeConfig } from './fontSizeConfig';
import { defaultSpacingConfig } from './spacingConfig';
import { defaultSizeConfig } from './sizeConfig';
import { defaultGridConfig } from './gridConfig';

// 個別の設定をエクスポート
export { defaultColorConfig } from './colorConfig';
export { defaultFontSizeConfig } from './fontSizeConfig';
export { defaultSpacingConfig } from './spacingConfig';
export { defaultSizeConfig } from './sizeConfig';
export { defaultGridConfig } from './gridConfig';

// すべての設定を統合したデフォルト設定オブジェクト
export const defaultConfig = {
  color: defaultColorConfig,
  fontSize: defaultFontSizeConfig,
  spacing: defaultSpacingConfig,
  size: defaultSizeConfig,
  grid: defaultGridConfig,
} as const;

// 型定義もエクスポート
export type { ColorConfig, FontSizeConfig, SizeConfig, GridConfig } from '../core/types';

// 設定の統合型
export type DefaultConfig = typeof defaultConfig;

// 設定値取得のヘルパー関数
export function getColorValue(colorKey: string): string | undefined {
  return defaultConfig.color[colorKey];
}

export function getFontSizeValue(sizeKey: string): string | undefined {
  return defaultConfig.fontSize[sizeKey];
}

export function getSpacingValue(spacingKey: string): string | undefined {
  return defaultConfig.spacing[spacingKey];
}

export function getSizeValue(sizeKey: string): string | undefined {
  return defaultConfig.size[sizeKey];
}

export function getGridValue(gridKey: string): string | undefined {
  return defaultConfig.grid[gridKey];
}
