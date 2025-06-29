/**
 * smsshcss main entry point
 */
import { SmsshCSSConfig, PurgeReport } from './core/types';
import { CSSGenerator } from './core/generator';

// Export types
export type { SmsshCSSConfig, PurgeReport };

// Export new enhanced types for arbitrary values
export type {
  ArbitraryValue,
  ArbitraryValueValidationResult,
  ArbitraryValueConfig,
  TypedValidationError,
  ValidationErrorType,
  TypeSafePropertyMapping,
} from './core/types';

/**
 * Generate CSS based on configuration (async version with purging support)
 * @param config Configuration options
 * @returns Generated CSS string
 */
export async function generateCSS(config: SmsshCSSConfig): Promise<string> {
  const generator = new CSSGenerator(config, { suppressWarnings: true });
  return generator.generateFullCSS();
}

/**
 * Generate CSS based on configuration (sync version)
 * @param config Configuration options
 * @returns Generated CSS string
 */
export function generateCSSSync(config: SmsshCSSConfig): string {
  const generator = new CSSGenerator(config, { suppressWarnings: true });
  return generator.generateFullCSS();
}

/**
 * Generate purge report without CSS generation
 * @param config Configuration options
 * @returns Purge report or null if purging is disabled
 */
export async function generatePurgeReport(config: SmsshCSSConfig): Promise<PurgeReport | null> {
  const generator = new CSSGenerator(config, { suppressWarnings: true });
  return generator.generatePurgeReport();
}

/**
 * Initialize SmsshCSS with default configuration (async version)
 * @param config Optional configuration to override defaults
 * @returns Generated CSS string
 */
export async function init(
  config: SmsshCSSConfig = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
    includeResetCSS: true,
    includeBaseCSS: true,
  }
): Promise<string> {
  return generateCSS(config);
}

// Default export
export default {
  generateCSS,
  generatePurgeReport,
  init,
};

export * from './core/types';
export * from './core/generator';
export * from './core/purger';

// Export utility functions
export { extractCustomSpacingClasses } from './utils/spacing';
export { extractCustomWidthClasses } from './utils/width';
export { extractCustomHeightClasses } from './utils/height';
export { extractCustomGridClasses } from './utils/grid';
export { extractCustomOrderClasses } from './utils/order';
export { extractCustomZIndexClasses } from './utils/z-index';
export { extractCustomColorClasses } from './utils/color';
export { extractCustomFontSizeClasses } from './utils/font-size';
export { generateApplyClasses } from './utils/apply-system';

// Export new enhanced arbitrary value utilities
export {
  ArbitraryValueValidator,
  defaultValidator,
  validateArbitraryValue,
  isSafeArbitraryValue,
  logValidatorStats,
} from './core/arbitrary-value-validator';

// Export performance utilities
export {
  PerformanceCache,
  globalCache,
  generateContentHash,
  memoize,
  memoizeAsync,
  BatchProcessor,
  logCacheStats,
} from './core/performance-cache';

// Enhanced API functions with improved error handling
export {
  /**
   * Validate configuration with detailed error messages
   */
  validateConfig,
  formatValidationResult,
} from './core/config-validator';

// Export unified configuration (Single Source of Truth)
export {
  defaultConfig,
  defaultColorConfig,
  defaultFontSizeConfig,
  defaultSpacingConfig,
  defaultSizeConfig,
  defaultGridConfig,
  getColorValue,
  getFontSizeValue,
  getSpacingValue,
  getSizeValue,
  getGridValue,
} from './config';

export type { DefaultConfig } from './config';
