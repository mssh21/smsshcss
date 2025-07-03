import { SpacingDirection, SpacingProperty, SizeConfig } from '../core/types';
import { defaultSpacingConfig, escapeSpacingValue } from '../config/spacingConfig';
import { validateArbitraryValue, isSafeArbitraryValue } from '../core/arbitrary-value-validator';

// Alias for backward compatibility
export type SpacingConfig = SizeConfig;
export const defaultSpacing: SpacingConfig = defaultSpacingConfig;

const directionMap: Record<SpacingDirection, string> = {
  '': '',
  t: '-block-start',
  r: '-inline-end',
  b: '-block-end',
  l: '-inline-start',
  x: '-inline',
  y: '-block',
};

// Regular expression to detect custom value classes
const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;

// Generate custom spacing classes (enhanced validation version)
function generateCustomSpacingClass(prefix: string, value: string): string | null {
  try {
    // Validate value using new validator
    const validationResult = validateArbitraryValue(value, `spacing.${prefix}`);

    if (!validationResult.isValid) {
      console.warn(`⚠️  Invalid spacing value for ${prefix}: ${value}`);
      console.warn(`Errors: ${validationResult.errors.join(', ')}`);
      return null;
    }

    // Display warnings if any
    if (validationResult.warnings.length > 0) {
      console.warn(
        `⚠️  Spacing warnings for ${prefix}[${value}]: ${validationResult.warnings.join(', ')}`
      );
    }

    // Use sanitized value
    const sanitizedValue = validationResult.sanitizedValue;

    // Handle gap property
    if (prefix === 'gap') {
      return `.${prefix}-\\[${escapeSpacingValue(value)}\\] { gap: ${sanitizedValue}; }`;
    }

    // Handle gap-x (column-gap) property
    if (prefix === 'gap-x') {
      return `.gap-x-\\[${escapeSpacingValue(value)}\\] { column-gap: ${sanitizedValue}; }`;
    }

    // Handle gap-y (row-gap) property
    if (prefix === 'gap-y') {
      return `.gap-y-\\[${escapeSpacingValue(value)}\\] { row-gap: ${sanitizedValue}; }`;
    }

    const property = prefix.startsWith('m') ? 'margin' : 'padding';
    const direction = prefix.slice(1); // Remove 'm' or 'p' part

    let cssProperty = property;

    switch (direction) {
      case 't':
        cssProperty = `${property}-block-start`;
        break;
      case 'r':
        cssProperty = `${property}-inline-end`;
        break;
      case 'b':
        cssProperty = `${property}-block-end`;
        break;
      case 'l':
        cssProperty = `${property}-inline-start`;
        break;
      case 'x':
        return `.${prefix}-\\[${escapeSpacingValue(value)}\\] { ${property}-inline: ${sanitizedValue}; }`;
      case 'y':
        return `.${prefix}-\\[${escapeSpacingValue(value)}\\] { ${property}-block: ${sanitizedValue}; }`;
      case '':
        // All directions
        break;
      default:
        console.warn(`⚠️  Unknown spacing direction: ${direction}`);
        return null;
    }

    return `.${prefix}-\\[${escapeSpacingValue(value)}\\] { ${cssProperty}: ${sanitizedValue}; }`;
  } catch (error) {
    console.error(`❌ Error generating spacing class for ${prefix}[${value}]:`, error);
    return null;
  }
}

// Extract custom value classes from HTML files (enhanced error handling version)
export function extractCustomSpacingClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];
  const errors: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    try {
      // Security check
      if (!isSafeArbitraryValue(value)) {
        errors.push(`Unsafe spacing value detected: ${prefix}[${value}]`);
        continue;
      }

      // Generate CSS class
      const cssClass = generateCustomSpacingClass(prefix, value);
      if (cssClass) {
        customClasses.push(cssClass);
      } else {
        errors.push(`Failed to generate spacing class: ${prefix}[${value}]`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Error processing spacing class ${prefix}[${value}]: ${errorMessage}`);
    }
  }

  // Display warnings if there are errors
  if (errors.length > 0) {
    console.warn('⚠️  Spacing extraction errors:');
    errors.forEach((error) => console.warn(`  • ${error}`));
  }

  return customClasses;
}

export function generateSpacingClasses(
  config: SpacingConfig = defaultSpacing,
  property: SpacingProperty = 'margin'
): string {
  const classes: string[] = [];

  // Generate classes for each spacing size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., m-md, p-md)
    classes.push(`.${property[0]}-${size} { ${property}: ${value}; }`);

    // Generate directional classes
    Object.entries(directionMap).forEach(([dir, suffix]) => {
      if (dir === 'x') {
        // Handle x direction (left and right)
        classes.push(`.${property[0]}x-${size} { ${property}-inline: ${value}; }`);
      } else if (dir === 'y') {
        // Handle y direction (top and bottom)
        classes.push(`.${property[0]}y-${size} { ${property}-block: ${value}; }`);
      } else if (dir !== '') {
        // Handle individual directions
        classes.push(`.${property[0]}${dir}-${size} { ${property}${suffix}: ${value}; }`);
      }
    });
  });

  // Generate arbitrary value classes
  const arbitraryValueTemplate = `
/* Arbitrary value classes */
.${property[0]}-\\[\\$\\{value\\}\\] { ${property}: var(--value); }
.${property[0]}t-\\[\\$\\{value\\}\\] { ${property}-block-start: var(--value); }
.${property[0]}r-\\[\\$\\{value\\}\\] { ${property}-inline-end: var(--value); }
.${property[0]}b-\\[\\$\\{value\\}\\] { ${property}-block-end: var(--value); }
.${property[0]}l-\\[\\$\\{value\\}\\] { ${property}-inline-start: var(--value); }
.${property[0]}x-\\[\\$\\{value\\}\\] { ${property}-inline: var(--value); }
.${property[0]}y-\\[\\$\\{value\\}\\] { ${property}-block: var(--value); }
`;

  // Add arbitrary value class template
  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

export function generateGapClasses(config: SpacingConfig = defaultSpacing): string {
  const classes: string[] = [];

  // Generate gap classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.gap-${size} { gap: ${value}; }`);
    classes.push(`.gap-x-${size} { column-gap: ${value}; }`);
    classes.push(`.gap-y-${size} { row-gap: ${value}; }`);
  });

  // Add arbitrary value gap classes
  classes.push(`
/* Arbitrary gap values */
.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }
.gap-x-\\[\\$\\{value\\}\\] { column-gap: var(--value); }
.gap-y-\\[\\$\\{value\\}\\] { row-gap: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllSpacingClasses(): string {
  return [
    generateSpacingClasses(defaultSpacing, 'margin'),
    generateSpacingClasses(defaultSpacing, 'padding'),
    generateGapClasses(defaultSpacing),
  ].join('\n\n');
}
