const { parse, walk } = require('css-tree');

/**
 * CSSからクラス名を抽出
 */
function extractClassNames(css) {
  const classes = new Set();

  try {
    const ast = parse(css, { parseValue: false, parseRulePrelude: true });

    walk(ast, function (node) {
      if (node.type === 'ClassSelector') {
        classes.add(node.name);
      }
    });
  } catch (error) {
    console.warn(
      '[CSS Parser] Failed to parse CSS:',
      error instanceof Error ? error.message : String(error)
    );
  }

  return classes;
}

/**
 * CSSルールの詳細解析
 */
function parseCSS(css) {
  const result = {
    selectors: [],
    rules: [],
    totalRules: 0,
  };

  try {
    const ast = parse(css, { parseValue: false, parseRulePrelude: true });

    walk(ast, function (node) {
      if (node.type === 'Rule') {
        const rule = node;
        const selector = generateSelectorString(rule.prelude);
        result.selectors.push(selector);

        const properties = {};

        walk(rule.block, function (blockNode) {
          if (blockNode.type === 'Declaration') {
            const declaration = blockNode;
            properties[declaration.property] = generateValueString(declaration.value);
          }
        });

        result.rules.push({
          selector,
          properties,
        });

        result.totalRules++;
      }
    });
  } catch (error) {
    console.warn(
      '[CSS Parser] Failed to parse CSS:',
      error instanceof Error ? error.message : String(error)
    );
  }

  return result;
}

/**
 * セレクター部分を文字列として生成
 */
function generateSelectorString(prelude) {
  // 簡易的な実装 - 実際のプロジェクトでは css-tree の generate 関数を使用
  const selectors = [];

  walk(prelude, function (node) {
    if (node.type === 'ClassSelector') {
      selectors.push(`.${node.name}`);
    } else if (node.type === 'TypeSelector') {
      selectors.push(node.name);
    }
  });

  return selectors.join('');
}

/**
 * CSS値を文字列として生成
 */
function generateValueString(value) {
  // 簡易的な実装
  if (value && value.children) {
    const values = [];

    walk(value, function (node) {
      if (node.type === 'Identifier') {
        values.push(node.name);
      } else if (node.type === 'Dimension') {
        const dim = node;
        values.push(`${dim.value}${dim.unit}`);
      } else if (node.type === 'Number') {
        values.push(node.value);
      }
    });

    return values.join(' ');
  }

  return '';
}

/**
 * 特定のクラス名パターンにマッチするセレクターを検索
 */
function findMatchingSelectors(css, pattern) {
  const parsed = parseCSS(css);
  return parsed.selectors.filter((selector) => pattern.test(selector));
}

/**
 * クラス名のプロパティ値を取得
 */
function getClassProperties(css, className) {
  const parsed = parseCSS(css);
  const rule = parsed.rules.find((r) => r.selector.includes(`.${className}`));
  return rule ? rule.properties : null;
}

/**
 * CSS統計情報を取得
 */
function getCSSStats(css) {
  const parsed = parseCSS(css);
  const classes = extractClassNames(css);

  const totalProperties = parsed.rules.reduce(
    (sum, rule) => sum + Object.keys(rule.properties).length,
    0
  );

  return {
    totalRules: parsed.totalRules,
    totalClasses: classes.size,
    totalSelectors: parsed.selectors.length,
    averagePropertiesPerRule: parsed.totalRules > 0 ? totalProperties / parsed.totalRules : 0,
  };
}

module.exports = {
  extractClassNames,
  parseCSS,
  findMatchingSelectors,
  getClassProperties,
  getCSSStats,
};
