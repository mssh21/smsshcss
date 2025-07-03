import { SizeConfig } from '../core/types';

/**
 * Size configuration for Spacing (margin/padding/gap)
 * Based on Fibonacci sequence, suitable for fine spacing control
 * Base unit: 4px (0.25rem)
 */
export const defaultSpacingConfig: SizeConfig = {
  // Fibonacci sequence-based spacing (base unit: 4px = 0.25rem)
  // Uses Fibonacci sequence values while adopting intuitive naming
  none: '0',
  auto: 'auto',
  '2xs': '0.25rem', // 0.25rem (4px)  (Fibonacci: 1)
  xs: '0.5rem', // 0.5rem (8px)  (Fibonacci: 2)
  sm: '0.75rem', // 0.75rem (12px) (Fibonacci: 3)
  md: '1.25rem', // 1.25rem (20px) (Fibonacci: 5)
  lg: '2rem', // 2rem (32px) (Fibonacci: 8)
  xl: '3.25rem', // 3.25rem (52px) (Fibonacci: 13)
  '2xl': '5.25rem', // 5.25rem (84px) (Fibonacci: 21)
  '3xl': '8.5rem', // 8.5rem (136px) (Fibonacci: 34)
  '4xl': '13.75rem', // 13.75rem (220px) (Fibonacci: 55)
  '5xl': '22.25rem', // 22.25rem (356px) (Fibonacci: 89)
  '6xl': '36rem', // 36rem (576px) (Fibonacci: 144)
  '7xl': '48rem', // 48rem (768px)
  '8xl': '64rem', // 64rem (1024px)
  '9xl': '80rem', // 80rem (1280px)
  '10xl': '96rem', // 96rem (1536px)
  '11xl': '112rem', // 112rem (1792px)
  '12xl': '128rem', // 128rem (2048px)
};

// Escape special characters in CSS values (for class names)
export const escapeSpacingValue = (val: string): string => {
  // Regular expression to detect CSS math functions (basic functions only)
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // Special handling for CSS math functions (also escape commas)
  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  // Special handling for CSS variables (var(--name)) - don't escape hyphens
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  // For normal values, escape including hyphens
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
};

// Function to recursively format values within CSS functions
export const formatSpacingCSSFunctionValue = (input: string): string => {
  // Recursively process CSS functions (basic functions only)
  return input.replace(
    /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // Recursively process inner functions
      const processedInner = formatSpacingCSSFunctionValue(inner);

      // Properly place spaces around operators and commas
      const formattedInner = processedInner
        // First normalize all spaces
        .replace(/\s+/g, ' ')
        .trim()
        // Handle commas (space after comma, remove spaces before)
        .replace(/\s*,\s*/g, ', ')
        // Handle operators (spaces before and after)
        .replace(/\s*([+\-*/])\s*/g, (match, operator, offset, str) => {
          // Determine if minus sign is a negative value
          if (operator === '-') {
            // Get characters before current position
            const beforeMatch = str.substring(0, offset);
            // Get the last non-whitespace character
            const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
            const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';

            // For negative values (start of string, after parentheses, after comma, after other operators)
            if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/\s]/.test(prevChar)) {
              return '-';
            }
          }
          return ` ${operator} `;
        });

      return `${funcName}(${formattedInner})`;
    }
  );
};
