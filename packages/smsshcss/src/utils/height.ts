import { SizeConfig } from '../core/types';
import {
  defaultSizeConfig,
  escapeSizeValue,
  formatSizeCSSFunctionValue,
} from '../config/sizeConfig';

export type HeightConfig = SizeConfig;
export const defaultHeight: HeightConfig = {
  ...defaultSizeConfig,
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  cqw: '100cqh',
  cqi: '100cqb',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// Regular expression to detect custom value classes
const customValuePattern = /\b(h|min-h|max-h)-\[([^\]]+)\]/g;

// Generate custom Height classes
function generateCustomHeightClass(prefix: string, value: string): string | null {
  // Regular expression to detect CSS math functions (basic functions only)
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // Restore original value (for CSS values) - properly restore spaces for CSS math functions
  const originalValue = cssMathFunctions.test(value) ? formatSizeCSSFunctionValue(value) : value;

  // Handle height property
  if (prefix === 'h') {
    return `.h-\\[${escapeSizeValue(value)}\\] { height: ${originalValue}; }`;
  }

  // Handle min-height property
  if (prefix === 'min-h') {
    return `.min-h-\\[${escapeSizeValue(value)}\\] { min-height: ${originalValue}; }`;
  }

  // Handle max-height property
  if (prefix === 'max-h') {
    return `.max-h-\\[${escapeSizeValue(value)}\\] { max-height: ${originalValue}; }`;
  }

  return null;
}

// Extract custom value classes from HTML files
export function extractCustomHeightClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // Generate CSS class
    const cssClass = generateCustomHeightClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateCustomHeightClasses(config: HeightConfig = defaultHeight): string {
  const classes: string[] = [];

  // Generate classes for each height size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., h-md, min-h-md, max-h-md)
    classes.push(`.h-${size} { height: ${value}; }`);
    classes.push(`.min-h-${size} { min-height: ${value}; }`);
    classes.push(`.max-h-${size} { max-height: ${value}; }`);
  });

  return classes.join('\n');
}

export function generateHeightClasses(config: HeightConfig = defaultHeight): string {
  const classes: string[] = [];

  // Generate height classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.h-${size} { height: ${value}; }`);
    classes.push(`.min-h-${size} { min-height: ${value}; }`);
    classes.push(`.max-h-${size} { max-height: ${value}; }`);
  });

  // Add arbitrary value height classes
  classes.push(`
/* Arbitrary height values */
.h-\\[\\$\\{value\\}\\] { height: var(--value); }
.min-h-\\[\\$\\{value\\}\\] { min-height: var(--value); }
.max-h-\\[\\$\\{value\\}\\] { max-height: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllHeightClasses(): string {
  return [generateHeightClasses(defaultHeight), generateCustomHeightClasses(defaultHeight)].join(
    '\n\n'
  );
}
