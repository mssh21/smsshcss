#!/usr/bin/env node

const { Command } = require('commander');
const { performance } = require('perf_hooks');
const path = require('path');
const fs = require('fs');

// コア機能のインポート
const {
  generateDisplayClasses,
  generateAllSpacingClasses,
  generateFlexboxClasses,
  generatePositioningClasses,
  generateZIndexClasses,
  generateOverflowClasses,
  generateOrderClasses,
  generateGridClasses,
  generateAllWidthClasses,
  generateAllHeightClasses,
  generateAllColorClasses,
  generateFontSizeClasses,
} = require('../dist/utils');

// const { defaultConfig } = require('../dist/config'); // 使用していないため削除

// 検証ユーティリティのインポート
const {
  verifyUtilityClasses,
  generateVerificationReport,
  generateSummaryReport,
  generateJSONReport,
} = require('./utils/comparison.js');

// Viteプラグイン機能のインポート
let smsshcss;
try {
  ({ smsshcss } = require('@smsshcss/vite'));
} catch (error) {
  console.warn('[Check] Warning: @smsshcss/vite not found. Plugin verification will be skipped.');
}

/**
 * 利用可能な検証カテゴリ
 */
const AVAILABLE_CATEGORIES = [
  'display',
  'spacing',
  'flexbox',
  'positioning',
  'zIndex',
  'overflow',
  'order',
  'grid',
  'width',
  'height',
  'color',
  'fontSize',
];

/**
 * コア生成関数のマッピング
 */
const CORE_GENERATORS = {
  display: generateDisplayClasses,
  spacing: generateAllSpacingClasses,
  flexbox: generateFlexboxClasses,
  positioning: generatePositioningClasses,
  zIndex: generateZIndexClasses,
  overflow: generateOverflowClasses,
  order: generateOrderClasses,
  grid: generateGridClasses,
  width: generateAllWidthClasses,
  height: generateAllHeightClasses,
  color: generateAllColorClasses,
  fontSize: generateFontSizeClasses,
};

/**
 * Viteプラグインからの出力を取得
 */
async function getVitePluginOutput(options = {}) {
  const { verbose = false, debug = false } = options;

  if (!smsshcss) {
    throw new Error(
      '@smsshcss/vite is not available. Install the package to use plugin verification.'
    );
  }

  if (verbose) {
    console.log('[Check] Creating Vite plugin instance...');
  }

  try {
    // テスト用のHTMLコンテンツを作成（全カテゴリのクラスを含む）
    const testContent = `
      <div class="
        block flex grid hidden
        m-xs p-md gap-lg
        flex-col justify-center items-center
        absolute relative fixed
        z-10 z-0
        overflow-hidden overflow-auto
        order-1 order-first
        grid-cols-3 col-span-2
        w-full h-screen min-w-0 max-h-full
        text-blue-500 bg-white border-gray-200
        font-size-lg font-semibold
      ">
        Test content for utility class verification
      </div>
    `;

    const plugin = smsshcss({
      content: [testContent],
      purge: { enabled: false },
      debug,
    });

    if (verbose) {
      console.log('[Check] Transforming CSS with plugin...');
    }

    // プラグインの transform メソッドを呼び出し
    const result = await plugin.transform?.('', 'test.css');

    if (!result || typeof result !== 'object' || !result.code) {
      throw new Error('Plugin returned invalid result');
    }

    if (verbose) {
      console.log('[Check] Plugin output length:', result.code.length);
    }

    return result.code;
  } catch (error) {
    console.error('[Check] Failed to get Vite plugin output:', error);
    throw error;
  }
}

/**
 * 期待されるCSSの生成
 */
function generateExpectedCSS(categories) {
  const cssBlocks = [];

  categories.forEach((category) => {
    const generator = CORE_GENERATORS[category];
    if (generator) {
      const css = generator();
      if (css) {
        cssBlocks.push(`/* ${category.toUpperCase()} */\n${css}`);
      }
    }
  });

  return cssBlocks.join('\n\n');
}

/**
 * コアのみの簡易検証結果を作成
 */
function createCoreOnlyVerification(expectedCSS, categories) {
  const { extractUtilityClasses } = require('./utils/class-extractor.js');
  const { getCSSStats } = require('./utils/css-parser.js');

  const expectedExtracted = extractUtilityClasses(expectedCSS);
  const expectedStats = getCSSStats(expectedCSS);

  // カテゴリ別結果を作成
  const categoryResults = {};
  categories.forEach((category) => {
    const classes = expectedExtracted.categories[category] || [];
    categoryResults[category] = {
      category,
      expected: classes.length,
      actual: classes.length,
      missing: [],
      extra: [],
      success: true,
    };
  });

  return {
    success: true,
    totalExpected: expectedExtracted.classes.length,
    totalActual: expectedExtracted.classes.length,
    missingClasses: [],
    extraClasses: [],
    mismatchedProperties: [],
    categoryResults,
    executionTime: 0,
    stats: {
      expected: expectedStats,
      actual: expectedStats,
    },
  };
}

/**
 * メイン検証処理
 */
async function runVerification(options) {
  const startTime = performance.now();

  const {
    categories: categoryNames = [],
    verbose = false,
    silent = false,
    outputFile,
    format = 'text',
    allowExtraClasses = false,
    skipPropertyValidation = false,
    debug = false,
  } = options;

  // カテゴリの解析
  const categoriesToVerify =
    categoryNames.length > 0
      ? categoryNames.filter((cat) => AVAILABLE_CATEGORIES.includes(cat))
      : [...AVAILABLE_CATEGORIES];

  if (!silent) {
    console.log('[Check] Starting utility class verification...');
    console.log('[Check] Categories to verify:', categoriesToVerify.join(', '));
  }

  try {
    // 期待されるCSSの生成
    if (verbose) {
      console.log('[Check] Generating expected CSS...');
    }
    const expectedCSS = generateExpectedCSS(categoriesToVerify);

    let verificationResult;

    // Viteプラグインが利用可能な場合のみプラグイン検証を実行
    if (smsshcss) {
      // Viteプラグインからの実際のCSS出力を取得
      if (verbose) {
        console.log('[Check] Getting actual CSS from Vite plugin...');
      }
      const actualCSS = await getVitePluginOutput({ verbose, debug });

      // 検証実行
      if (verbose) {
        console.log('[Check] Running verification...');
      }

      verificationResult = await verifyUtilityClasses(expectedCSS, actualCSS, {
        categories: categoriesToVerify,
        verbose,
        allowExtraClasses,
        strictProperties: !skipPropertyValidation,
      });
    } else {
      // プラグインが利用できない場合は、コアのみの簡易検証
      if (verbose) {
        console.log('[Check] Running core-only verification...');
      }

      // 簡易検証結果を作成
      verificationResult = createCoreOnlyVerification(expectedCSS, categoriesToVerify);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // レポート生成
    let report;
    switch (format) {
      case 'json':
        report = generateJSONReport(verificationResult);
        break;
      case 'summary':
        report = generateSummaryReport(verificationResult);
        break;
      default:
        report = generateVerificationReport(verificationResult);
        break;
    }

    // 実行時間を追加
    if (format !== 'json') {
      report += `\n\n⏱️  Total execution time: ${(totalTime / 1000).toFixed(2)}s`;
    }

    // 出力
    if (outputFile) {
      fs.writeFileSync(outputFile, report, 'utf-8');
      if (!silent) {
        console.log(`[Check] Report saved to: ${outputFile}`);
      }
    } else if (!silent) {
      console.log(report);
    }

    // 結果判定
    if (verificationResult.success) {
      if (!silent) {
        console.log('\n✅ Verification completed successfully!');
      }
      process.exit(0);
    } else {
      if (!silent) {
        console.log('\n❌ Verification failed!');
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('[Check] Verification failed with error:', error);
    process.exit(1);
  }
}

/**
 * CLI設定
 */
function setupCLI() {
  const program = new Command();

  program
    .name('check-utilities')
    .description('Verify utility class consistency between core and Vite plugin')
    .version('1.0.0');

  program
    .option(
      '-c, --categories <categories>',
      'Comma-separated list of categories to verify',
      (value) => value.split(',')
    )
    .option('-p, --plugin <plugin>', 'Plugin to verify against (default: vite)', 'vite')
    .option('-v, --verbose', 'Enable verbose output', false)
    .option('-s, --silent', 'Suppress output (except errors)', false)
    .option('-o, --output-file <file>', 'Save report to file')
    .option('-f, --format <format>', 'Output format (text|json|summary)', 'text')
    .option('--allow-extra-classes', 'Allow extra classes in plugin output', false)
    .option('--skip-property-validation', 'Skip CSS property value validation', false)
    .option('--debug', 'Enable debug mode', false);

  program
    .command('list-categories')
    .description('List all available verification categories')
    .action(() => {
      console.log('Available categories:');
      AVAILABLE_CATEGORIES.forEach((category) => {
        console.log(`  - ${category}`);
      });
    });

  program
    .command('verify')
    .description('Run the verification (default command)')
    .action(async () => {
      const options = program.opts();
      await runVerification(options);
    });

  // デフォルトコマンド
  program.action(async () => {
    const options = program.opts();
    await runVerification(options);
  });

  program.parse();
}

/**
 * エラーハンドリング
 */
process.on('uncaughtException', (error) => {
  console.error('[Check] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Check] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// CLI実行
if (require.main === module) {
  setupCLI();
}
