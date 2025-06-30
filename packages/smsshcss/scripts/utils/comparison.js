const {
  extractUtilityClasses,
  compareClassLists,
  verifyPropertyValues,
} = require('./class-extractor.js');
const { getCSSStats } = require('./css-parser.js');

/**
 * メイン検証関数
 */
async function verifyUtilityClasses(expectedCSS, actualCSS, options = {}) {
  const startTime = Date.now();

  const {
    categories = [],
    strictProperties = true,
    verbose = false,
    allowExtraClasses = false,
    propertyTolerance = 'strict',
  } = options;

  if (verbose) {
    console.log('[Verification] Starting utility class verification...');
    console.log('[Verification] Expected CSS length:', expectedCSS.length);
    console.log('[Verification] Actual CSS length:', actualCSS.length);
  }

  // CSS統計の取得
  const expectedStats = getCSSStats(expectedCSS);
  const actualStats = getCSSStats(actualCSS);

  // クラス抽出
  const expectedExtracted = extractUtilityClasses(expectedCSS);
  const actualExtracted = extractUtilityClasses(actualCSS);

  // 全体的な比較
  const overallComparison = compareClassLists(expectedExtracted.classes, actualExtracted.classes);

  // カテゴリ別検証
  const categoryResults = {};

  if (categories.length > 0) {
    // 指定されたカテゴリのみ検証
    for (const category of categories) {
      categoryResults[category] = await verifyCategoryClasses(
        expectedExtracted.categories[category] || [],
        actualExtracted.categories[category] || [],
        category,
        verbose
      );
    }
  } else {
    // 全カテゴリを検証
    const allCategories = new Set([
      ...Object.keys(expectedExtracted.categories),
      ...Object.keys(actualExtracted.categories),
    ]);

    for (const category of allCategories) {
      if (category === 'unknown') continue; // unknownカテゴリはスキップ

      categoryResults[category] = await verifyCategoryClasses(
        expectedExtracted.categories[category] || [],
        actualExtracted.categories[category] || [],
        category,
        verbose
      );
    }
  }

  // プロパティ値の詳細検証
  const mismatchedProperties = [];

  if (strictProperties) {
    const propertyVerification = verifyPropertyValues(
      expectedCSS,
      actualCSS,
      overallComparison.matching
    );

    propertyVerification.forEach((result) => {
      if (!result.matches) {
        Object.entries(result.differences).forEach(([prop, diff]) => {
          mismatchedProperties.push({
            className: result.className,
            expected: `${prop}: ${diff.expected}`,
            actual: `${prop}: ${diff.actual}`,
          });
        });
      }
    });
  }

  const executionTime = Date.now() - startTime;

  // 成功判定
  const categorySuccess = Object.values(categoryResults).every((r) => r.success);
  const noMissingClasses = overallComparison.missing.length === 0;
  const noExtraClasses = allowExtraClasses || overallComparison.extra.length === 0;
  const noPropertyMismatches = mismatchedProperties.length === 0;

  const success = categorySuccess && noMissingClasses && noExtraClasses && noPropertyMismatches;

  if (verbose) {
    console.log('[Verification] Completed in', executionTime, 'ms');
    console.log('[Verification] Success:', success);
  }

  return {
    success,
    totalExpected: expectedExtracted.classes.length,
    totalActual: actualExtracted.classes.length,
    missingClasses: overallComparison.missing,
    extraClasses: overallComparison.extra,
    mismatchedProperties,
    categoryResults,
    executionTime,
    stats: {
      expected: expectedStats,
      actual: actualStats,
    },
  };
}

/**
 * カテゴリ別のクラス検証
 */
async function verifyCategoryClasses(expectedClasses, actualClasses, category, verbose) {
  if (verbose) {
    console.log(`[Verification] Verifying category: ${category}`);
    console.log(
      `[Verification] Expected: ${expectedClasses.length}, Actual: ${actualClasses.length}`
    );
  }

  const comparison = compareClassLists(expectedClasses, actualClasses);
  const success = comparison.missing.length === 0 && comparison.extra.length === 0;

  return {
    category,
    expected: expectedClasses.length,
    actual: actualClasses.length,
    missing: comparison.missing,
    extra: comparison.extra,
    success,
  };
}

/**
 * 詳細検証レポートの生成
 */
function generateVerificationReport(result) {
  const lines = [];

  lines.push('🔍 Utility Class Verification Report');
  lines.push('=====================================');
  lines.push('');

  // 概要
  lines.push('📊 Summary');
  lines.push(`Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Total Expected Classes: ${result.totalExpected}`);
  lines.push(`Total Actual Classes: ${result.totalActual}`);
  lines.push(`Execution Time: ${result.executionTime}ms`);
  lines.push('');

  // 統計情報
  lines.push('📈 CSS Statistics');
  lines.push('Expected:');
  lines.push(`  - Rules: ${result.stats.expected.totalRules}`);
  lines.push(`  - Classes: ${result.stats.expected.totalClasses}`);
  lines.push(`  - Selectors: ${result.stats.expected.totalSelectors}`);
  lines.push(
    `  - Avg Properties/Rule: ${result.stats.expected.averagePropertiesPerRule.toFixed(2)}`
  );
  lines.push('Actual:');
  lines.push(`  - Rules: ${result.stats.actual.totalRules}`);
  lines.push(`  - Classes: ${result.stats.actual.totalClasses}`);
  lines.push(`  - Selectors: ${result.stats.actual.totalSelectors}`);
  lines.push(`  - Avg Properties/Rule: ${result.stats.actual.averagePropertiesPerRule.toFixed(2)}`);
  lines.push('');

  // カテゴリ別結果
  lines.push('📋 Category Results');
  Object.entries(result.categoryResults).forEach(([category, categoryResult]) => {
    const status = categoryResult.success ? '✅' : '❌';
    lines.push(
      `${status} ${category}: ${categoryResult.actual}/${categoryResult.expected} classes`
    );

    if (categoryResult.missing.length > 0) {
      lines.push(`   Missing: ${categoryResult.missing.join(', ')}`);
    }
    if (categoryResult.extra.length > 0) {
      lines.push(`   Extra: ${categoryResult.extra.join(', ')}`);
    }
  });
  lines.push('');

  // 不一致詳細
  if (result.missingClasses.length > 0) {
    lines.push('❌ Missing Classes');
    result.missingClasses.forEach((cls) => {
      lines.push(`   - ${cls}`);
    });
    lines.push('');
  }

  if (result.extraClasses.length > 0) {
    lines.push('⚠️  Extra Classes');
    result.extraClasses.forEach((cls) => {
      lines.push(`   - ${cls}`);
    });
    lines.push('');
  }

  if (result.mismatchedProperties.length > 0) {
    lines.push('⚠️  Property Mismatches');
    result.mismatchedProperties.forEach((mismatch) => {
      lines.push(`   - ${mismatch.className}:`);
      lines.push(`     Expected: ${mismatch.expected}`);
      lines.push(`     Actual: ${mismatch.actual}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * サマリーレポートの生成
 */
function generateSummaryReport(result) {
  const status = result.success ? '✅ PASSED' : '❌ FAILED';
  const categories = Object.keys(result.categoryResults).length;
  const issues =
    result.missingClasses.length + result.extraClasses.length + result.mismatchedProperties.length;

  return `Verification ${status}: ${result.totalActual}/${result.totalExpected} classes across ${categories} categories. ${issues} issues found. (${result.executionTime}ms)`;
}

/**
 * JSONレポートの生成
 */
function generateJSONReport(result) {
  return JSON.stringify(result, null, 2);
}

module.exports = {
  verifyUtilityClasses,
  generateVerificationReport,
  generateSummaryReport,
  generateJSONReport,
};
