import { FontSizeConfig } from '../core/types';
import { escapeValue, defaultFontSizeConfig, formatCSSFunctionValue } from '../core/fontSizeConfig';
import { generateUtilityClasses } from './index';

/**
 * Default typography configuration
 */
export const defaultFontSize: FontSizeConfig = defaultFontSizeConfig;

/**
 * Custom value pattern for typography classes
 */
const customValuePattern = /\b(font-size)-\[([^\]]+)\]/g;

/**
 * Generate custom typography class from prefix and value
 */
function generateCustomFontSizeClass(prefix: string, value: string): string | null {
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  if (prefix === 'font-size') {
    return `.${prefix}-\\[${escapeValue(value)}\\] { font-size: ${originalValue}; }`;
  }

  return null;
}

/**
 * Extract custom typography classes from HTML content
 */
export function extractCustomFontSizeClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    const cssClass = generateCustomFontSizeClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

/**
 * Generate typography utility classes
 */
export function generateFontSizeClasses(
  config: Record<string, string> = defaultFontSizeConfig
): string {
  return generateUtilityClasses(
    {
      prefix: 'font-size',
      property: 'font-size',
      hasDirections: false,
      supportsArbitraryValues: true,
    },
    config
  );
}

/**
 * Generate all typography classes with custom configuration support
 */
export function generateAllFontSizeClasses(customConfig?: Record<string, string>): string {
  const config = customConfig
    ? { ...defaultFontSizeConfig, ...customConfig }
    : defaultFontSizeConfig;
  return generateFontSizeClasses(config);
}
