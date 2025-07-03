import { ColorConfig } from '../core/types';

/**
 * Size configuration for Width/Height
 * Uses larger values as base, suitable for layout elements
 */
export const defaultColorConfig: ColorConfig = {
  transparent: 'transparent',
  black: 'hsl(0 0% 0% / 1)',
  white: 'hsl(0 0% 100% / 1)',

  // gray - Primary: gray-500
  'gray-050': 'hsl(210 8% 98% / 1)',
  'gray-100': 'hsl(210 6% 95% / 1)',
  'gray-200': 'hsl(210 5% 90% / 1)',
  'gray-300': 'hsl(210 4% 80% / 1)',
  'gray-400': 'hsl(210 3% 70% / 1)',
  'gray-500': 'hsl(210 2% 50% / 1)', // Primary
  'gray-600': 'hsl(210 3% 40% / 1)',
  'gray-700': 'hsl(210 4% 30% / 1)',
  'gray-800': 'hsl(210 5% 20% / 1)',
  'gray-900': 'hsl(210 6% 10% / 1)',

  // blue - Primary: blue-500
  'blue-050': 'hsl(214 100% 98% / 1)',
  'blue-100': 'hsl(214 100% 95% / 1)',
  'blue-200': 'hsl(214 95% 88% / 1)',
  'blue-300': 'hsl(214 85% 75% / 1)',
  'blue-400': 'hsl(214 80% 65% / 1)',
  'blue-500': 'hsl(214 85% 55% / 1)', // Primary
  'blue-600': 'hsl(214 90% 45% / 1)',
  'blue-700': 'hsl(214 95% 35% / 1)',
  'blue-800': 'hsl(214 100% 25% / 1)',
  'blue-900': 'hsl(214 100% 15% / 1)',

  // red - Primary: red-500
  'red-050': 'hsl(358 100% 98% / 1)',
  'red-100': 'hsl(358 100% 95% / 1)',
  'red-200': 'hsl(358 95% 88% / 1)',
  'red-300': 'hsl(358 85% 75% / 1)',
  'red-400': 'hsl(358 80% 65% / 1)',
  'red-500': 'hsl(358 85% 55% / 1)', // Primary
  'red-600': 'hsl(358 90% 45% / 1)',
  'red-700': 'hsl(358 95% 35% / 1)',
  'red-800': 'hsl(358 100% 25% / 1)',
  'red-900': 'hsl(358 100% 15% / 1)',

  // green - Primary: green-500
  'green-050': 'hsl(125 100% 98% / 1)',
  'green-100': 'hsl(125 100% 95% / 1)',
  'green-200': 'hsl(125 95% 88% / 1)',
  'green-300': 'hsl(125 85% 75% / 1)',
  'green-400': 'hsl(125 75% 65% / 1)',
  'green-500': 'hsl(125 80% 50% / 1)', // Primary
  'green-600': 'hsl(125 85% 40% / 1)',
  'green-700': 'hsl(125 90% 30% / 1)',
  'green-800': 'hsl(125 95% 20% / 1)',
  'green-900': 'hsl(125 100% 12% / 1)',

  // yellow - Primary: yellow-500
  'yellow-050': 'hsl(55 100% 98% / 1)',
  'yellow-100': 'hsl(55 100% 95% / 1)',
  'yellow-200': 'hsl(55 95% 85% / 1)',
  'yellow-300': 'hsl(55 90% 70% / 1)',
  'yellow-400': 'hsl(55 85% 60% / 1)',
  'yellow-500': 'hsl(55 90% 50% / 1)', // Primary
  'yellow-600': 'hsl(55 85% 40% / 1)',
  'yellow-700': 'hsl(55 80% 30% / 1)',
  'yellow-800': 'hsl(55 75% 20% / 1)',
  'yellow-900': 'hsl(55 70% 12% / 1)',

  // purple - Primary: purple-500
  'purple-050': 'hsl(280 100% 98% / 1)',
  'purple-100': 'hsl(280 100% 95% / 1)',
  'purple-200': 'hsl(280 95% 88% / 1)',
  'purple-300': 'hsl(280 85% 75% / 1)',
  'purple-400': 'hsl(280 80% 65% / 1)',
  'purple-500': 'hsl(280 85% 55% / 1)', // Primary
  'purple-600': 'hsl(280 90% 45% / 1)',
  'purple-700': 'hsl(280 95% 35% / 1)',
  'purple-800': 'hsl(280 100% 25% / 1)',
  'purple-900': 'hsl(280 100% 15% / 1)',

  // orange - Primary: orange-500
  'orange-050': 'hsl(24 100% 98% / 1)',
  'orange-100': 'hsl(24 100% 95% / 1)',
  'orange-200': 'hsl(24 95% 88% / 1)',
  'orange-300': 'hsl(24 90% 75% / 1)',
  'orange-400': 'hsl(24 85% 65% / 1)',
  'orange-500': 'hsl(24 85% 55% / 1)', // Primary
  'orange-600': 'hsl(24 80% 45% / 1)',
  'orange-700': 'hsl(24 75% 35% / 1)',
  'orange-800': 'hsl(24 70% 25% / 1)',
  'orange-900': 'hsl(24 65% 15% / 1)',

  // pink - Primary: pink-500
  'pink-050': 'hsl(330 100% 98% / 1)',
  'pink-100': 'hsl(330 100% 95% / 1)',
  'pink-200': 'hsl(330 95% 88% / 1)',
  'pink-300': 'hsl(330 85% 75% / 1)',
  'pink-400': 'hsl(330 80% 65% / 1)',
  'pink-500': 'hsl(330 85% 60% / 1)', // Primary
  'pink-600': 'hsl(330 90% 50% / 1)',
  'pink-700': 'hsl(330 95% 40% / 1)',
  'pink-800': 'hsl(330 100% 30% / 1)',
  'pink-900': 'hsl(330 100% 20% / 1)',

  // indigo - Primary: indigo-500
  'indigo-050': 'hsl(235 100% 98% / 1)',
  'indigo-100': 'hsl(235 100% 95% / 1)',
  'indigo-200': 'hsl(235 95% 88% / 1)',
  'indigo-300': 'hsl(235 85% 75% / 1)',
  'indigo-400': 'hsl(235 80% 65% / 1)',
  'indigo-500': 'hsl(235 85% 55% / 1)', // Primary
  'indigo-600': 'hsl(235 90% 45% / 1)',
  'indigo-700': 'hsl(235 95% 35% / 1)',
  'indigo-800': 'hsl(235 100% 25% / 1)',
  'indigo-900': 'hsl(235 100% 15% / 1)',

  // sky - Primary: sky-500
  'sky-050': 'hsl(195 100% 98% / 1)',
  'sky-100': 'hsl(195 100% 95% / 1)',
  'sky-200': 'hsl(195 95% 88% / 1)',
  'sky-300': 'hsl(195 85% 75% / 1)',
  'sky-400': 'hsl(195 80% 65% / 1)',
  'sky-500': 'hsl(195 85% 55% / 1)', // Primary
  'sky-600': 'hsl(195 90% 45% / 1)',
  'sky-700': 'hsl(195 95% 35% / 1)',
  'sky-800': 'hsl(195 100% 25% / 1)',
  'sky-900': 'hsl(195 100% 15% / 1)',

  // teal - Primary: teal-500
  'teal-050': 'hsl(175 100% 98% / 1)',
  'teal-100': 'hsl(175 100% 95% / 1)',
  'teal-200': 'hsl(175 95% 88% / 1)',
  'teal-300': 'hsl(175 85% 75% / 1)',
  'teal-400': 'hsl(175 80% 65% / 1)',
  'teal-500': 'hsl(175 85% 50% / 1)', // Primary
  'teal-600': 'hsl(175 90% 40% / 1)',
  'teal-700': 'hsl(175 95% 30% / 1)',
  'teal-800': 'hsl(175 100% 20% / 1)',
  'teal-900': 'hsl(175 100% 12% / 1)',

  // emerald - Primary: emerald-500
  'emerald-050': 'hsl(155 100% 98% / 1)',
  'emerald-100': 'hsl(155 100% 95% / 1)',
  'emerald-200': 'hsl(155 95% 88% / 1)',
  'emerald-300': 'hsl(155 85% 75% / 1)',
  'emerald-400': 'hsl(155 80% 65% / 1)',
  'emerald-500': 'hsl(155 85% 50% / 1)', // Primary
  'emerald-600': 'hsl(155 90% 40% / 1)',
  'emerald-700': 'hsl(155 95% 30% / 1)',
  'emerald-800': 'hsl(155 100% 20% / 1)',
  'emerald-900': 'hsl(155 100% 12% / 1)',

  // amber - Primary: amber-500
  'amber-050': 'hsl(35 100% 98% / 1)',
  'amber-100': 'hsl(35 100% 95% / 1)',
  'amber-200': 'hsl(35 95% 88% / 1)',
  'amber-300': 'hsl(35 85% 75% / 1)',
  'amber-400': 'hsl(35 80% 65% / 1)',
  'amber-500': 'hsl(35 85% 55% / 1)', // Primary
  'amber-600': 'hsl(35 90% 45% / 1)',
  'amber-700': 'hsl(35 95% 35% / 1)',
  'amber-800': 'hsl(35 100% 25% / 1)',
  'amber-900': 'hsl(35 70% 12% / 1)',
};

// Escape special characters in CSS values (for class names)
export const escapeColorValue = (val: string): string => {
  // Regular expression to detect CSS math functions (basic functions only)
  const cssMathFunctions = /\b(rgb|rgba|hsl|hsla)\s*\(/;

  // Regular expression to detect new color functions (hwb, lab, oklab, lch, oklch)
  const newColorFunctions = /\b(hwb|lab|oklab|lch|oklch)\s*\(/;

  // Special handling for new color functions (don't escape hyphens, but escape commas)
  if (newColorFunctions.test(val)) {
    return val.replace(/[()[\]{}+*/.\\%,#]/g, '\\$&');
  }

  // Special handling for traditional CSS math functions (also escape commas)
  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,#]/g, '\\$&');
  }
  // Special handling for CSS variables (var(--name)) - don't escape hyphens
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%#]/g, '\\$&');
  }

  // For normal values, escape including hyphens (also add #)
  return val.replace(/[()[\]{}+\-*/.\\%#]/g, '\\$&');
};

// Function to recursively format values within CSS functions
export const formatColorCSSFunctionValue = (input: string): string => {
  // Recursively process CSS functions (basic functions only)
  return input.replace(
    /(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // Recursively process inner functions
      const processedInner = formatColorCSSFunctionValue(inner);

      // For specific functions (hwb, lab, oklab, lch, oklch), convert commas to spaces
      if (['hwb', 'lab', 'oklab', 'lch', 'oklch'].includes(funcName)) {
        const formattedInner = processedInner
          // First normalize all spaces
          .replace(/\s+/g, ' ')
          .trim()
          // Convert commas to spaces
          .replace(/\s*,\s*/g, ' ')
          // Handle slashes (space before slash, space after slash)
          .replace(/\s*\/\s*/g, ' / ');

        return `${funcName}(${formattedInner})`;
      }

      // For traditional functions (rgb, rgba, hsl, hsla), preserve commas
      const formattedInner = processedInner
        // First normalize all spaces
        .replace(/\s+/g, ' ')
        .trim()
        // Handle commas (space after comma, remove spaces before)
        .replace(/\s*,\s*/g, ', ')
        // Handle slashes (space before slash, space after slash)
        .replace(/\s*\/\s*/g, ' / ');

      return `${funcName}(${formattedInner})`;
    }
  );
};
