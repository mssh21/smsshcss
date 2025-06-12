import { ColorConfig } from '../core/types';
import {
  defaultColorConfig,
  escapeColorValue,
  formatColorFunctionValue,
} from '../core/colorConfig';
import { generateUtilityClasses } from './index';

/**
 * Default color configuration
 */
export const defaultColor: ColorConfig = defaultColorConfig;

/**
 * Custom value pattern for color classes
 */
const customValuePattern = /\b(text)-\[([^\]]+)\]/g;

/**
 * Generate custom color class from prefix and value
 */
function generateCustomColorClass(prefix: string, value: string): string | null {
  const cssMathFunctions = /\b(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/;
  const originalValue = cssMathFunctions.test(value) ? formatColorFunctionValue(value) : value;

  return `.${prefix}-\\[${escapeColorValue(value)}\\] { color: ${originalValue}; }`;
}

/**
 * Extract custom color classes from HTML content
 */
export function extractCustomColorClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    const cssClass = generateCustomColorClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

/**
 * Generate color utility classes
 */
export function generateColorClasses(config: Record<string, string> = defaultColor): string {
  return generateUtilityClasses(
    {
      prefix: 'text',
      property: 'color',
      hasDirections: false,
      supportsArbitraryValues: true,
    },
    config
  );
}

/**
 * Generate all color classes with custom configuration support
 */
export function generateAllColorClasses(customConfig?: Record<string, string>): string {
  const config = customConfig ? { ...defaultColor, ...customConfig } : defaultColor;
  return generateColorClasses(config);
}
