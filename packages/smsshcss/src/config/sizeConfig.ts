import { SizeConfig } from '../core/types';

/**
 * Size configuration for Width/Height
 * Uses larger base values, suitable for layout elements
 */
export const defaultSizeConfig: SizeConfig = {
  none: '0',
  '2xs': '1rem', // 1rem (16px)
  xs: '1.5rem', // 1.5rem (24px)
  sm: '2rem', // 2rem (32px)
  md: '2.5rem', // 2.5rem (40px)
  lg: '3rem', // 3rem (48px)
  xl: '4rem', // 4rem (64px)
  '2xl': '6rem', // 6rem (96px)
  '3xl': '8rem', // 8rem (128px)
  '4xl': '12rem', // 12rem (192px)
  '5xl': '16rem', // 16rem (256px)
  '6xl': '20rem', // 20rem (320px)
  '7xl': '24rem', // 24rem (384px)
  '8xl': '32rem', // 32rem (512px)
  '9xl': '48rem', // 48rem (768px)
  '10xl': '64rem', // 64rem (1024px)
  '11xl': '80rem', // 80rem (1280px)
  '12xl': '96rem', // 96rem (1536px)
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
  screen: '100vw',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  dvw: '100dvw',
  cqw: '100cqw',
  cqi: '100cqi',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// Escape special characters in CSS values (for class names)
export const escapeSizeValue = (val: string): string => {
  // Regular expression to detect CSS math functions (basic functions only)
  const cssMathFunctions = /\b(calc|min|max|clamp|minmax)\s*\(/;

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
export const formatSizeCSSFunctionValue = (input: string): string => {
  // Recursively process CSS functions (basic functions only)
  return input.replace(
    /(calc|min|max|clamp|minmax)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // Recursively process inner functions
      const processedInner = formatSizeCSSFunctionValue(inner);

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
            if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/]/.test(prevChar)) {
              return '-';
            }
          }
          return ` ${operator} `;
        });

      return `${funcName}(${formattedInner})`;
    }
  );
};
