import { SizeConfig } from '../core/types';
import {
  defaultSizeConfig,
  escapeSizeValue,
  formatSizeCSSFunctionValue,
} from '../config/sizeConfig';

// Alias for backward compatibility
export type WidthConfig = SizeConfig;
export const defaultWidth: WidthConfig = {
  ...defaultSizeConfig,
  screen: '100vw',
  svh: '100svw',
  lvh: '100lvw',
  dvw: '100dvw',
  cqw: '100cqw',
  cqi: '100cqi',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// Regular expression to detect custom value classes
const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;

// Generate custom Width classes
function generateCustomWidthClass(prefix: string, value: string): string | null {
  // Regular expression to detect CSS math functions (basic functions only)
  const cssMathFunctions = /\b(calc|min|max|clamp|minmax)\s*\(/;

  // Restore original value (for CSS values) - properly restore spaces for CSS math functions
  const originalValue = cssMathFunctions.test(value) ? formatSizeCSSFunctionValue(value) : value;

  // Handle width property
  if (prefix === 'w') {
    return `.w-\\[${escapeSizeValue(value)}\\] { width: ${originalValue}; }`;
  }

  // Handle min-width property
  if (prefix === 'min-w') {
    return `.min-w-\\[${escapeSizeValue(value)}\\] { min-width: ${originalValue}; }`;
  }

  // Handle max-width property
  if (prefix === 'max-w') {
    return `.max-w-\\[${escapeSizeValue(value)}\\] { max-width: ${originalValue}; }`;
  }

  return null;
}

// Extract custom value classes from HTML files
export function extractCustomWidthClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // Generate CSS class
    const cssClass = generateCustomWidthClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateCustomWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate classes for each width size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., w-md, min-w-md, max-w-md)
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  return classes.join('\n');
}

export function generateWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate width classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  // Add arbitrary value width classes
  classes.push(`
/* Arbitrary width values */
.w-\\[\\$\\{value\\}\\] { width: var(--value); }
.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }
.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllWidthClasses(): string {
  return [generateWidthClasses(defaultWidth), generateCustomWidthClasses(defaultWidth)].join(
    '\n\n'
  );
}
