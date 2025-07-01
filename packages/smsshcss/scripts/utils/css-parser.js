const { parse, walk } = require('css-tree');

/**
 * Extract class names from CSS
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
 * Detailed analysis of CSS rules
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
 * Generate selector part as string
 */
function generateSelectorString(prelude) {
  // Simple implementation - use css-tree's generate function in actual projects
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
 * Generate CSS value as string
 */
function generateValueString(value) {
  // Simple implementation
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
 * Search for selectors that match specific class name patterns
 */
function findMatchingSelectors(css, pattern) {
  const parsed = parseCSS(css);
  return parsed.selectors.filter((selector) => pattern.test(selector));
}

/**
 * Get property values for class names
 */
function getClassProperties(css, className) {
  const parsed = parseCSS(css);
  const rule = parsed.rules.find((r) => r.selector.includes(`.${className}`));
  return rule ? rule.properties : null;
}

/**
 * Get CSS statistics
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
