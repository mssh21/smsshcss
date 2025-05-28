/**
 * smsshcss main entry point
 */
import { SmsshCSSConfig } from './core/types';
import { CSSGenerator } from './core/generator';

// Export types
export type { SmsshCSSConfig };

/**
 * Generate CSS based on configuration
 * @param config Configuration options
 * @returns Generated CSS string
 */
export function generateCSS(config: SmsshCSSConfig): string {
  const generator = new CSSGenerator(config);
  return generator.generateFullCSS();
}

/**
 * Initialize SmsshCSS with default configuration
 * @param config Optional configuration to override defaults
 * @returns Generated CSS string
 */
export function init(
  config: SmsshCSSConfig = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
    includeResetCSS: true,
    includeBaseCSS: true,
  }
): string {
  return generateCSS(config);
}

// Default export
export default {
  generateCSS,
  init,
};

export * from './core/types';
export * from './core/generator';
