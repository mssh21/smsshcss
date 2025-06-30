const { extractClassNames, parseCSS } = require('./css-parser.js');

/**
 * ユーティリティカテゴリのパターン定義
 */
const CATEGORY_PATTERNS = {
  spacing: /^(m|p|gap)([trbllxy]?)-/,
  display: /^(block|inline|flex|grid|hidden|contents|flow-root|list-item|table)/,
  flexbox: /^(flex|justify|items|content|self|grow|shrink|basis|wrap)/,
  positioning: /^(absolute|relative|fixed|sticky|static|inset|top|right|bottom|left)/,
  zIndex: /^z-/,
  overflow: /^overflow/,
  order: /^order-/,
  grid: /^(grid|col|row)-/,
  width: /^(w|min-w|max-w)-/,
  height: /^(h|min-h|max-h)-/,
  color: /^(text|bg|border|fill)-/,
  fontSize: /^font-size-/,
};

/**
 * カスタム値のパターン（[]記法）
 */
const CUSTOM_VALUE_PATTERN = /[a-zA-Z]+-\[[^\]]+\]/g;

/**
 * 任意値テンプレートパターン(${value}を含むもの)
 */
const ARBITRARY_VALUE_TEMPLATE_PATTERN = /\\\[\\\$\\\{value\\\}\\\]/;

/**
 * CSSからユーティリティクラスを抽出してカテゴリ分け
 */
function extractUtilityClasses(css) {
  const classNames = Array.from(extractClassNames(css));
  const categories = {};
  const customValues = [];
  const templateClasses = [];

  // カテゴリの初期化
  Object.keys(CATEGORY_PATTERNS).forEach((category) => {
    categories[category] = [];
  });
  categories.unknown = [];

  classNames.forEach((className) => {
    // 任意値テンプレートクラスをチェック（先にチェックして除外）
    if (ARBITRARY_VALUE_TEMPLATE_PATTERN.test(className)) {
      templateClasses.push(className);
      return;
    }

    // カスタム値チェック
    if (CUSTOM_VALUE_PATTERN.test(className)) {
      customValues.push(className);
      return;
    }

    // カテゴリ分類
    let categorized = false;
    for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
      if (pattern.test(className)) {
        categories[category].push(className);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories.unknown.push(className);
    }
  });

  return {
    classes: classNames.filter((className) => !ARBITRARY_VALUE_TEMPLATE_PATTERN.test(className)), // テンプレートクラスを除外
    categories,
    customValues,
    templateClasses, // テンプレートクラスを別途記録
  };
}

/**
 * 期待されるクラス一覧と実際のクラス一覧を比較
 */
function compareClassLists(expected, actual) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  const missing = expected.filter((cls) => !actualSet.has(cls));
  const extra = actual.filter((cls) => !expectedSet.has(cls));
  const matching = expected.filter((cls) => actualSet.has(cls));

  return { missing, extra, matching };
}

/**
 * 特定カテゴリのクラスを抽出
 */
function extractCategoryClasses(css, category) {
  const pattern = CATEGORY_PATTERNS[category];
  if (!pattern) {
    throw new Error(`Unknown category: ${category}`);
  }

  const classNames = Array.from(extractClassNames(css));
  return classNames.filter((className) => pattern.test(className));
}

/**
 * CSSプロパティ値のマッピングを作成
 */
function createPropertyMapping(css) {
  const parsed = parseCSS(css);
  const mapping = {};

  parsed.rules.forEach((rule) => {
    // クラスセレクターのみを対象とする
    const classMatch = rule.selector.match(/\.([a-zA-Z0-9_-]+)/);
    if (classMatch) {
      const className = classMatch[1];
      mapping[className] = rule.properties;
    }
  });

  return mapping;
}

/**
 * プロパティ値の一致を検証
 */
function verifyPropertyValues(expectedCSS, actualCSS, classNames) {
  const expectedMapping = createPropertyMapping(expectedCSS);
  const actualMapping = createPropertyMapping(actualCSS);

  return classNames.map((className) => {
    const expected = expectedMapping[className] || {};
    const actual = actualMapping[className] || {};

    const differences = {};
    let matches = true;

    // 期待されるプロパティをチェック
    Object.entries(expected).forEach(([prop, expectedValue]) => {
      const actualValue = actual[prop];
      if (actualValue !== expectedValue) {
        matches = false;
        differences[prop] = { expected: expectedValue, actual: actualValue || 'undefined' };
      }
    });

    // 余分なプロパティをチェック
    Object.entries(actual).forEach(([prop, actualValue]) => {
      if (!(prop in expected)) {
        matches = false;
        differences[prop] = { expected: 'undefined', actual: actualValue };
      }
    });

    return {
      className,
      expected,
      actual,
      matches,
      differences,
    };
  });
}

/**
 * クラス名を自然順序でソート
 */
function sortClassNames(classNames) {
  return classNames.sort((a, b) => {
    // 数値部分を考慮した自然順序ソート
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

/**
 * デバッグ用の詳細レポート生成
 */
function generateDetailedReport(extracted) {
  const lines = [];

  lines.push('=== Utility Classes Extraction Report ===');
  lines.push(`Total classes: ${extracted.classes.length}`);
  lines.push(`Custom value classes: ${extracted.customValues.length}`);
  lines.push(
    `Template classes (excluded): ${extracted.templateClasses ? extracted.templateClasses.length : 0}`
  );

  lines.push('\nClasses by category:');
  Object.entries(extracted.categories).forEach(([category, classes]) => {
    if (classes.length > 0) {
      lines.push(`  ${category}: ${classes.length} classes`);
      if (classes.length <= 20) {
        lines.push(`    ${classes.join(', ')}`);
      } else {
        lines.push(`    ${classes.slice(0, 20).join(', ')}...`);
      }
    }
  });

  if (extracted.customValues.length > 0) {
    lines.push('\nCustom value classes:');
    lines.push(`  ${extracted.customValues.join(', ')}`);
  }

  if (extracted.templateClasses && extracted.templateClasses.length > 0) {
    lines.push('\nTemplate classes (excluded from counts):');
    if (extracted.templateClasses.length <= 10) {
      lines.push(`  ${extracted.templateClasses.join(', ')}`);
    } else {
      lines.push(`  ${extracted.templateClasses.slice(0, 10).join(', ')}...`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  extractUtilityClasses,
  compareClassLists,
  extractCategoryClasses,
  createPropertyMapping,
  verifyPropertyValues,
  sortClassNames,
  generateDetailedReport,
};
