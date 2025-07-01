#!/usr/bin/env node

/**
 * Script to generate new utility classes
 * Usage: node scripts/generate-utility.js <utilityName> [options]
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const TEMPLATE_DIRECTORY = path.join(__dirname, '../src/utils');

/**
 * Utility template
 * @param {string} utilityName
 * @param {object} options
 * @returns {string}
 */
function generateUtilityTemplate(utilityName, options = {}) {
  const {
    hasDirections = false,
    supportsArbitraryValues = true,
    cssProperty = utilityName,
    prefix = utilityName.charAt(0),
    defaultValues = {},
    configType = 'SizeConfig',
    configFile = 'sizeConfig',
    customVariants = [],
  } = options;

  const camelUtilityName = toCamelCase(utilityName);
  const pascalUtilityName = toPascalCase(utilityName);

  const configName = `default${capitalizeFirst(configFile.replace('Config', ''))}`; // defaultSize, defaultColor etc.
  const escapeFunctionName = getEscapeFunctionName(configFile);
  const formatFunctionName = getFormatFunctionName(configFile);

  const customValuePatternString = generateCustomValuePattern(
    prefix,
    hasDirections,
    customVariants
  );
  const customClassLogicString = generateCustomClassLogic(
    cssProperty,
    prefix,
    hasDirections,
    customVariants,
    escapeFunctionName
  );
  const variantFunctionsString = generateVariantFunctions(
    camelUtilityName,
    cssProperty,
    prefix,
    customVariants,
    configType,
    hasDirections
  );
  const variantCallsString =
    customVariants.length > 0
      ? customVariants
          .map((v) => `generate${capitalizeFirst(v.name)}Classes(config)`)
          .join(',\n    ')
      : `generate${pascalUtilityName}Classes(config)`;

  return `import { ${configType} } from '../core/types';
import {
  ${configName},${escapeFunctionName ? `\n  ${escapeFunctionName},` : ''}${formatFunctionName ? `\n  ${formatFunctionName},` : ''}
} from '../config/${configFile}';
import { generateUtilityClasses } from './index';

/**
 * Default ${utilityName} configuration
 */
export const default${pascalUtilityName}: ${configType} = {
  ...${configName}${
    Object.keys(defaultValues).length > 0
      ? `,\n  ${Object.entries(defaultValues)
          .map(([k, v]) => `${k}: '${v}'`)
          .join(',\n  ')}`
      : ''
  }
};

/**
 * Custom value pattern for ${utilityName} classes
 */
const customValuePattern = ${customValuePatternString};

/**
 * Generate custom ${utilityName} class from prefix and value
 */
function generateCustom${pascalUtilityName}Class(prefix: string, value: string): string | null {
  ${formatFunctionName ? `const cssMathFunctions = /\\b(calc|min|max|clamp|minmax)\\s*\\(/;` : ''}
  const originalValue = ${formatFunctionName ? `cssMathFunctions.test(value) ? ${formatFunctionName}(value) : value` : 'value'};
  
  ${customClassLogicString}
}

/**
 * Extract custom ${utilityName} classes from HTML content
 */
export function extractCustom${pascalUtilityName}Classes(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    const cssClass = generateCustom${pascalUtilityName}Class(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

${variantFunctionsString}

/**
 * Generate all ${utilityName} classes with custom configuration support
 */
export function generateAll${pascalUtilityName}Classes(customConfig?: ${configType}): string {
  const config = customConfig ? { ...default${pascalUtilityName}, ...customConfig } : default${pascalUtilityName};
  return [
    ${variantCallsString}
  ].join('\\n\\n');
}
`;
}

/**
 * Generate custom value pattern
 */
function generateCustomValuePattern(prefix, hasDirections, customVariants) {
  if (customVariants.length > 0) {
    const prefixes = customVariants.map((v) => v.prefix).join('|');
    return `/\\b(${prefixes})${hasDirections ? '[trlbxy]?' : ''}-\\[([^\\]]+)\\]/g`;
  }
  return `/\\b(${prefix}${hasDirections ? '[trlbxy]?' : ''})-\\[([^\\]]+)\\]/g`;
}

/**
 * Custom class generation logic
 */
function generateCustomClassLogic(
  cssProperty,
  prefix,
  hasDirections,
  customVariants,
  escapeFunctionName
) {
  if (customVariants.length > 0) {
    return (
      customVariants
        .map(
          (variant) => `
  if (prefix === '${variant.prefix}') {
    return \`.${variant.prefix}-\\[\${${escapeFunctionName ? `${escapeFunctionName}(value)` : 'value'}}\\] { ${variant.property}: \${originalValue}; }\`;
  }`
        )
        .join('\n') + '\n\n  return null;'
    );
  }

  if (hasDirections) {
    return generateDirectionalLogic(cssProperty, prefix, escapeFunctionName);
  } else {
    return generateSimpleLogic(cssProperty, prefix, escapeFunctionName);
  }
}

/**
 * Generate variant functions
 */
function generateVariantFunctions(
  utilityName,
  cssProperty,
  prefix,
  customVariants,
  configType,
  hasDirections
) {
  const pascalUtilityName = toPascalCase(utilityName);

  if (customVariants.length === 0) {
    return `/**
 * Generate ${utilityName} utility classes
 */
export function generate${pascalUtilityName}Classes(config: ${configType} = default${pascalUtilityName}): string {
  return generateUtilityClasses(
    {
      prefix: '${prefix}',
      property: '${cssProperty}',
      hasDirections: ${hasDirections || false},
      supportsArbitraryValues: true
    },
    config
  );
}`;
  }

  return customVariants
    .map(
      (variant) => `/**
 * Generate ${variant.name} utility classes
 */
export function generate${capitalizeFirst(variant.name)}Classes(config: ${configType} = default${pascalUtilityName}): string {
  return generateUtilityClasses(
    {
      prefix: '${variant.prefix}',
      property: '${variant.property}',
      hasDirections: false,
      supportsArbitraryValues: true
    },
    config
  );
}`
    )
    .join('\n\n');
}

/**
 * Get escape function name
 */
function getEscapeFunctionName(configFile) {
  const mapping = {
    sizeConfig: 'escapeSizeValue',
    colorConfig: 'escapeColorValue',
    spacingConfig: 'escapeSpacingValue',
    fontSizeConfig: 'escapeFontSizeValue',
  };
  return mapping[configFile] || null;
}

/**
 * Get format function name
 */
function getFormatFunctionName(configFile) {
  const mapping = {
    sizeConfig: 'formatSizeCSSFunctionValue',
    colorConfig: 'formatColorCSSFunctionValue',
    spacingConfig: null,
    fontSizeConfig: null,
  };
  return mapping[configFile] || null;
}

/**
 * Generate logic for directional properties
 * @param {string} cssProperty
 * @param {string} prefix
 * @param {string} escapeFunctionName
 * @returns {string}
 */
function generateDirectionalLogic(cssProperty, prefix, escapeFunctionName) {
  const escapeValue = escapeFunctionName ? `${escapeFunctionName}(value)` : 'value';

  return `
  const direction = prefix.slice(${prefix.length});
  
  switch (direction) {
    case 't':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-top: \${originalValue}; }\`;
    case 'r':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-right: \${originalValue}; }\`;
    case 'b':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-bottom: \${originalValue}; }\`;
    case 'l':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-left: \${originalValue}; }\`;
    case 'x':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-left: \${originalValue}; ${cssProperty}-right: \${originalValue}; }\`;
    case 'y':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}-top: \${originalValue}; ${cssProperty}-bottom: \${originalValue}; }\`;
    case '':
      return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}: \${originalValue}; }\`;
    default:
      return null;
  }
`;
}

/**
 * Generate logic for simple properties
 * @param {string} cssProperty
 * @param {string} prefix
 * @param {string} escapeFunctionName
 * @returns {string}
 */
function generateSimpleLogic(cssProperty, prefix, escapeFunctionName) {
  const escapeValue = escapeFunctionName ? `${escapeFunctionName}(value)` : 'value';
  return `return \`.\${prefix}-\\[\${${escapeValue}}\\] { ${cssProperty}: \${originalValue}; }\`;`;
}

/**
 * Test file template
 * @param {string} utilityName
 * @param {object} options
 * @returns {string}
 */
function generateTestTemplate(utilityName, options = {}) {
  const { hasDirections = false, prefix = utilityName.charAt(0), customVariants = [] } = options;

  const pascalUtilityName = toPascalCase(utilityName);

  const importList =
    customVariants.length > 0
      ? customVariants.map((v) => `generate${capitalizeFirst(v.name)}Classes`).join(',\n  ')
      : `generate${pascalUtilityName}Classes`;

  const generateTestCases =
    customVariants.length > 0
      ? customVariants
          .map(
            (variant) => `
    it('should generate ${variant.name} classes', () => {
      const result = generate${capitalizeFirst(variant.name)}Classes();
      
      // Check basic classes
      Object.keys(default${pascalUtilityName}).forEach(size => {
        expect(result).toContain(\`.\${variant.prefix}-\${size}\`);
      });
    });`
          )
          .join('\n')
      : `
    it('should generate basic ${utilityName} classes', () => {
      const result = generate${pascalUtilityName}Classes();
      
      // Check basic classes
      Object.keys(default${pascalUtilityName}).forEach(size => {
        expect(result).toContain(\`.${prefix}-\${size}\`);
      });
    });`;

  return `import { 
  ${importList},
  extractCustom${pascalUtilityName}Classes,
  generateAll${pascalUtilityName}Classes,
  default${pascalUtilityName}
} from '../${utilityName}';

describe('${pascalUtilityName} Utilities', () => {
  describe('generate${pascalUtilityName}Classes', () => {
    ${generateTestCases}

    ${
      hasDirections
        ? `
    it('should generate directional ${utilityName} classes', () => {
      const result = generate${pascalUtilityName}Classes();
      
      const directions = ['t', 'r', 'b', 'l', 'x', 'y'];
      directions.forEach(dir => {
        Object.keys(default${pascalUtilityName}).forEach(size => {
          expect(result).toContain(\`.${prefix}\${dir}-\${size}\`);
        });
      });
    });
    `
        : ''
    }

    it('should support custom configuration', () => {
      const customConfig = { custom: '10px' };
      const result = generate${pascalUtilityName}Classes(customConfig);
      
      expect(result).toContain('.${prefix}-custom');
    });
  });

  describe('extractCustom${pascalUtilityName}Classes', () => {
    it('should extract custom ${utilityName} classes', () => {
      const html = '<div class="${prefix}-[20px]">test</div>';
      const result = extractCustom${pascalUtilityName}Classes(html);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('20px');
    });

    ${
      hasDirections
        ? `
    it('should extract directional custom ${utilityName} classes', () => {
      const html = '<div class="${prefix}t-[15px]">test</div>';
      const result = extractCustom${pascalUtilityName}Classes(html);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('15px');
    });
    `
        : ''
    }
  });

  describe('generateAll${pascalUtilityName}Classes', () => {
    it('should generate all ${utilityName} classes', () => {
      const result = generateAll${pascalUtilityName}Classes();
      
      ${
        customVariants.length > 0
          ? customVariants.map((v) => `expect(result).toContain('.${v.prefix}-');`).join('\n      ')
          : `expect(result).toContain('.${prefix}-');`
      }
    });
  });
});
`;
}

/**
 * Capitalize the first character of a string
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert hyphenated string to camelCase
 * @param {string} str
 * @returns {string}
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert hyphenated string to PascalCase
 * @param {string} str
 * @returns {string}
 */
function toPascalCase(str) {
  return capitalizeFirst(toCamelCase(str));
}

/**
 * Main execution function
 * @returns {void}
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node scripts/generate-utility.js <utilityName> [options]

Options:
  --directions                Enable directional support (t, r, b, l, x, y)
  --no-arbitrary             Disable arbitrary value support
  --css-property=<name>      Set custom CSS property name
  --prefix=<prefix>          Set custom class prefix
  --config-type=<type>       Set configuration type (SizeConfig, ColorConfig, etc.)
  --config-file=<file>       Set configuration file name (sizeConfig, colorConfig, etc.)
  --default-values=<json>    Set default values as JSON string
  --variants=<json>          Set custom variants as JSON array

Examples:
  # Basic utilities
  node scripts/generate-utility.js border \\
    --css-property=border-width \\
    --prefix=border \\
    --config-type=SizeConfig \\
    --config-file=sizeConfig

  # Color utilities (multiple variants)
  node scripts/generate-utility.js text-color \\
    --config-type=ColorConfig \\
    --config-file=colorConfig \\
    --variants='[{"name":"text","prefix":"text","property":"color"},{"name":"bg","prefix":"bg","property":"background-color"}]'

  # Utilities with directional support
  node scripts/generate-utility.js margin \\
    --directions \\
    --css-property=margin \\
    --prefix=m \\
    --config-type=SizeConfig \\
    --config-file=spacingConfig
`);
    process.exit(1);
  }

  const utilityName = args[0];
  const options = {
    hasDirections: args.includes('--directions'),
    supportsArbitraryValues: !args.includes('--no-arbitrary'),
    cssProperty: getArgValue(args, '--css-property') || utilityName,
    prefix: getArgValue(args, '--prefix') || utilityName.charAt(0),
    configType: getArgValue(args, '--config-type') || 'SizeConfig',
    configFile: getArgValue(args, '--config-file') || 'sizeConfig',
    defaultValues: JSON.parse(getArgValue(args, '--default-values') || '{}'),
    customVariants: JSON.parse(getArgValue(args, '--variants') || '[]'),
  };

  // File paths
  const utilityFile = path.join(TEMPLATE_DIRECTORY, `${utilityName}.ts`);
  const testFile = path.join(TEMPLATE_DIRECTORY, '__tests__', `${utilityName}.test.ts`);

  // File generation
  fs.writeFileSync(utilityFile, generateUtilityTemplate(utilityName, options));

  // Create test directory if it doesn't exist
  const testDir = path.dirname(testFile);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  fs.writeFileSync(testFile, generateTestTemplate(utilityName, options));

  console.log(`✅ Generated utility files:`);
  console.log(`   📄 ${utilityFile}`);
  console.log(`   🧪 ${testFile}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Add export to src/utils/index.ts`);
  console.log(`   2. Add to generator.ts imports and generation`);
  console.log(`   3. Add to types.ts if needed`);
  console.log(`   4. Add to apply-plugins/index.ts if needed`);
  console.log(`   5. Run tests: npm test ${utilityName}`);
}

/**
 * Get value from arguments
 * @param {string[]} args
 * @param {string} flag
 * @returns {string|null}
 */
function getArgValue(args, flag) {
  const arg = args.find((a) => a.startsWith(flag + '='));
  return arg ? arg.split('=')[1] : null;
}

// Script execution
if (require.main === module) {
  main();
}

module.exports = { generateUtilityTemplate, generateTestTemplate };
