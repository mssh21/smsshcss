// =============================================================================
// SmsshCSS Core Configuration Index
// =============================================================================
// This file provides unified exports for all default configurations
// Acts as a Single Source of Truth, allowing other packages to
// directly import and use this configuration

// Import individual configurations
import { defaultColorConfig } from './colorConfig';
import { defaultFontSizeConfig } from './fontSizeConfig';
import { defaultSpacingConfig } from './spacingConfig';
import { defaultSizeConfig } from './sizeConfig';
import { defaultGridConfig } from './gridConfig';

// Export individual configurations
export { defaultColorConfig } from './colorConfig';
export { defaultFontSizeConfig } from './fontSizeConfig';
export { defaultSpacingConfig } from './spacingConfig';
export { defaultSizeConfig } from './sizeConfig';
export { defaultGridConfig } from './gridConfig';

// Default configuration object integrating all settings
export const defaultConfig = {
  color: defaultColorConfig,
  fontSize: defaultFontSizeConfig,
  spacing: defaultSpacingConfig,
  size: defaultSizeConfig,
  grid: defaultGridConfig,
} as const;

// Also export type definitions
export type { ColorConfig, FontSizeConfig, SizeConfig, GridConfig } from '../core/types';

// Unified configuration type
export type DefaultConfig = typeof defaultConfig;

// Helper functions for getting configuration values
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
