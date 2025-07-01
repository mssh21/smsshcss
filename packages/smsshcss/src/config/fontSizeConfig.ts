import { FontSizeConfig } from '../core/types';

export const defaultFontSizeConfig: FontSizeConfig = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.25rem', // 20px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.25rem', // 36px
  '4xl': '2.75rem', // 44px
};

// Escape special characters in CSS values (for class names)
export const escapeFontSizeValue = (val: string): string => {
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
export const formatFontSizeCSSFunctionValue = (input: string): string => {
  // Recursively process CSS functions (basic functions only)
  return input.replace(
    /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // Recursively process inner functions
      const processedInner = formatFontSizeCSSFunctionValue(inner);

      // Properly place spaces around operators and commas
      const formattedInner = processedInner
        // First normalize all spaces
        .replace(/\s+/g, ' ')
        .trim()
        // Handle commas (space after comma, remove space before)
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
