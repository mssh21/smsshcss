#!/usr/bin/env node

/**
 * 新しいユーティリティクラスを生成するためのスクリプト
 * Usage: node scripts/generate-utility.js <utilityName> [options]
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const TEMPLATE_DIRECTORY = path.join(__dirname, '../src/utils');

/**
 * ユーティリティテンプレート
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
  } = options;

  return `import { SizeConfig } from '../core/types';
import { escapeValue, formatCSSFunctionValue } from '../core/sizeConfig';
import { generateUtilityClasses, processCSSValue } from './index';

/**
 * Default ${utilityName} configuration
 */
export const default${capitalizeFirst(utilityName)}: Record<string, string> = ${JSON.stringify(defaultValues, null, 2)};

/**
 * Custom value pattern for ${utilityName} classes
 */
const customValuePattern = /\\b(${prefix}${hasDirections ? '[trlbxy]?' : ''})-\\[([^\\]]+)\\]/g;

/**
 * Generate custom ${utilityName} class from prefix and value
 */
function generateCustom${capitalizeFirst(utilityName)}Class(prefix: string, value: string): string | null {
  const originalValue = processCSSValue(value);
  
  ${hasDirections ? generateDirectionalLogic(cssProperty, prefix) : generateSimpleLogic(cssProperty, prefix)}
}

/**
 * Extract custom ${utilityName} classes from HTML content
 */
export function extractCustom${capitalizeFirst(utilityName)}Classes(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    const cssClass = generateCustom${capitalizeFirst(utilityName)}Class(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

/**
 * Generate ${utilityName} utility classes
 */
export function generate${capitalizeFirst(utilityName)}Classes(config: Record<string, string> = default${capitalizeFirst(utilityName)}): string {
  return generateUtilityClasses(
    {
      prefix: '${prefix}',
      property: '${cssProperty}',
      hasDirections: ${hasDirections},
      supportsArbitraryValues: ${supportsArbitraryValues}
    },
    config
  );
}

/**
 * Generate all ${utilityName} classes with custom configuration support
 */
export function generateAll${capitalizeFirst(utilityName)}Classes(customConfig?: Record<string, string>): string {
  const config = customConfig ? { ...default${capitalizeFirst(utilityName)}, ...customConfig } : default${capitalizeFirst(utilityName)};
  return generate${capitalizeFirst(utilityName)}Classes(config);
}
`;
}

/**
 * 方向性のあるプロパティ用のロジック生成
 * @param {string} cssProperty
 * @param {string} prefix
 * @returns {string}
 */
function generateDirectionalLogic(cssProperty, prefix) {
  return `
  const direction = prefix.slice(${prefix.length});
  
  switch (direction) {
    case 't':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-top: \${originalValue}; }\`;
    case 'r':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-right: \${originalValue}; }\`;
    case 'b':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-bottom: \${originalValue}; }\`;
    case 'l':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-left: \${originalValue}; }\`;
    case 'x':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-left: \${originalValue}; ${cssProperty}-right: \${originalValue}; }\`;
    case 'y':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}-top: \${originalValue}; ${cssProperty}-bottom: \${originalValue}; }\`;
    case '':
      return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}: \${originalValue}; }\`;
    default:
      return null;
  }
`;
}

/**
 * シンプルなプロパティ用のロジック生成
 * @param {string} cssProperty
 * @param {string} prefix
 * @returns {string}
 */
function generateSimpleLogic(cssProperty, prefix) {
  return `return \`.\${prefix}-\\[\${escapeValue(value)}\\] { ${cssProperty}: \${originalValue}; }\`;`;
}

/**
 * テストファイルテンプレート
 * @param {string} utilityName
 * @param {object} options
 * @returns {string}
 */
function generateTestTemplate(utilityName, options = {}) {
  const { hasDirections = false, prefix = utilityName.charAt(0) } = options;

  return `import { 
  generate${capitalizeFirst(utilityName)}Classes,
  extractCustom${capitalizeFirst(utilityName)}Classes,
  default${capitalizeFirst(utilityName)}
} from '../${utilityName}';

describe('${capitalizeFirst(utilityName)} Utilities', () => {
  describe('generate${capitalizeFirst(utilityName)}Classes', () => {
    it('should generate basic ${utilityName} classes', () => {
      const result = generate${capitalizeFirst(utilityName)}Classes();
      
      // 基本クラスの確認
      Object.keys(default${capitalizeFirst(utilityName)}).forEach(size => {
        expect(result).toContain(\`.\${prefix}-\${size}\`);
      });
    });

    ${
      hasDirections
        ? `
    it('should generate directional ${utilityName} classes', () => {
      const result = generate${capitalizeFirst(utilityName)}Classes();
      
      const directions = ['t', 'r', 'b', 'l', 'x', 'y'];
      directions.forEach(dir => {
        Object.keys(default${capitalizeFirst(utilityName)}).forEach(size => {
          expect(result).toContain(\`.\${prefix}\${dir}-\${size}\`);
        });
      });
    });
    `
        : ''
    }

    it('should support custom configuration', () => {
      const customConfig = { custom: '10px' };
      const result = generate${capitalizeFirst(utilityName)}Classes(customConfig);
      
      expect(result).toContain('.${prefix}-custom');
    });
  });

  describe('extractCustom${capitalizeFirst(utilityName)}Classes', () => {
    it('should extract custom ${utilityName} classes', () => {
      const html = '<div class="${prefix}-[20px]">test</div>';
      const result = extractCustom${capitalizeFirst(utilityName)}Classes(html);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('20px');
    });

    ${
      hasDirections
        ? `
    it('should extract directional custom ${utilityName} classes', () => {
      const html = '<div class="${prefix}t-[15px]">test</div>';
      const result = extractCustom${capitalizeFirst(utilityName)}Classes(html);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('15px');
    });
    `
        : ''
    }
  });
});
`;
}

/**
 * 文字列の最初の文字を大文字にする
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * メイン実行関数
 * @returns {void}
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node scripts/generate-utility.js <utilityName> [options]

Options:
  --directions          Enable directional support (t, r, b, l, x, y)
  --no-arbitrary       Disable arbitrary value support
  --css-property=<name> Set custom CSS property name
  --prefix=<prefix>     Set custom class prefix
  --default-values=<json> Set default values as JSON string

Examples:
  node scripts/generate-utility.js color --css-property=color --prefix=text
  node scripts/generate-utility.js border --directions --default-values='{"sm":"1px","md":"2px"}'
`);
    process.exit(1);
  }

  const utilityName = args[0];
  const options = {
    hasDirections: args.includes('--directions'),
    supportsArbitraryValues: !args.includes('--no-arbitrary'),
    cssProperty: getArgValue(args, '--css-property') || utilityName,
    prefix: getArgValue(args, '--prefix') || utilityName.charAt(0),
    defaultValues: JSON.parse(getArgValue(args, '--default-values') || '{}'),
  };

  // ファイルパス
  const utilityFile = path.join(TEMPLATE_DIRECTORY, `${utilityName}.ts`);
  const testFile = path.join(TEMPLATE_DIRECTORY, '__tests__', `${utilityName}.test.ts`);

  // ファイル生成
  fs.writeFileSync(utilityFile, generateUtilityTemplate(utilityName, options));

  // テストディレクトリが存在しない場合は作成
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
  console.log(`   4. Run tests: npm test ${utilityName}`);
}

/**
 * 引数から値を取得
 * @param {string[]} args
 * @param {string} flag
 * @returns {string|null}
 */
function getArgValue(args, flag) {
  const arg = args.find((a) => a.startsWith(flag + '='));
  return arg ? arg.split('=')[1] : null;
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { generateUtilityTemplate, generateTestTemplate };
