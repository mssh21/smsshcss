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
  const generator = new CSSGenerator(config);
  return generator.generateFullCSS();
}

/**
 * Generate CSS based on configuration (sync version for backward compatibility)
 * @param config Configuration options
 * @returns Generated CSS string
 */
export function generateCSSSync(config: SmsshCSSConfig): string {
  const generator = new CSSGenerator(config);
  return generator.generateFullCSSSync();
}

/**
 * Generate purge report without CSS generation
 * @param config Configuration options
 * @returns Purge report or null if purging is disabled
 */
export async function generatePurgeReport(config: SmsshCSSConfig): Promise<PurgeReport | null> {
  const generator = new CSSGenerator(config);
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
    purge: {
      enabled: true,
      content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
    },
  }
): Promise<string> {
  return generateCSS(config);
}

/**
 * Initialize SmsshCSS with default configuration (sync version)
 * @param config Optional configuration to override defaults
 * @returns Generated CSS string
 */
export function initSync(
  config: SmsshCSSConfig = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
    includeResetCSS: true,
    includeBaseCSS: true,
  }
): string {
  return generateCSSSync(config);
}

// Default export
export default {
  generateCSS,
  generateCSSSync,
  generatePurgeReport,
  init,
  initSync,
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
