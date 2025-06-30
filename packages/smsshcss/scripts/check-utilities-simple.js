#!/usr/bin/env node

const { Command } = require('commander');
const { performance } = require('perf_hooks');
const fs = require('fs');

// Import core features (use built module)
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

// Import verification utilities
const { extractUtilityClasses } = require('./utils/class-extractor.js');

/**
 * Available verification categories
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
 * Mapping of core generator functions
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
 * Generate expected CSS and count classes
 */
function generateAndAnalyzeCSS(categories, options = {}) {
  const { includeTemplates = false } = options;

  const cssBlocks = [];
  const categoryStats = {};
  let totalClasses = 0;
  let totalTemplateClasses = 0;

  categories.forEach((category) => {
    const generator = CORE_GENERATORS[category];
    if (generator) {
      const css = generator();
      if (css) {
        cssBlocks.push(`/* ${category.toUpperCase()} */\n${css}`);

        // Count classes
        const extracted = extractUtilityClasses(css, { includeTemplates });
        const classCount = extracted.classes.length;
        const templateCount = extracted.templateClasses.length;

        categoryStats[category] = {
          classes: classCount,
          templates: templateCount,
          total: includeTemplates ? classCount : classCount,
        };

        totalClasses += classCount;
        totalTemplateClasses += templateCount;
      }
    }
  });

  return {
    css: cssBlocks.join('\n\n'),
    totalClasses,
    totalTemplateClasses,
    categoryStats,
    includeTemplates,
  };
}

/**
 * Generate simple statistics report
 */
function generateSimpleReport(result, executionTime) {
  const lines = [];

  lines.push('✅ Core Utility Classes Analysis Report');
  lines.push('');
  lines.push('📊 Statistics:');
  lines.push(`   - Total utility classes generated: ${result.totalClasses.toLocaleString()}`);

  if (result.includeTemplates) {
    lines.push(`   - Template classes included: ${result.totalTemplateClasses.toLocaleString()}`);
    lines.push(`   - Mode: Including template classes`);
  } else {
    lines.push(`   - Template classes excluded: ${result.totalTemplateClasses.toLocaleString()}`);
    lines.push(`   - Mode: Excluding template classes (default)`);
  }

  lines.push(`   - Analysis time: ${(executionTime / 1000).toFixed(1)}s`);
  lines.push('');

  lines.push('📋 Classes by category:');
  Object.entries(result.categoryStats).forEach(([category, stats]) => {
    if (typeof stats === 'object') {
      const displayCount = result.includeTemplates ? stats.total : stats.classes;
      lines.push(
        `   - ${category}: ${displayCount} classes${stats.templates > 0 ? ` (${stats.templates} templates)` : ''}`
      );
    } else {
      // Backward compatibility
      lines.push(`   - ${category}: ${stats} classes`);
    }
  });

  lines.push('');
  lines.push('💡 Next steps:');
  lines.push('   - Run integration tests: yarn test:integration');
  lines.push('   - Check Vite plugin compatibility manually');
  lines.push('   - Review generated CSS output for correctness');

  if (!result.includeTemplates) {
    lines.push('   - Use --include-templates to include template classes in count');
  }

  return lines.join('\n');
}

/**
 * Main process
 */
async function runAnalysis(options) {
  const startTime = performance.now();

  const {
    categories: categoryNames = [],
    verbose = false,
    silent = false,
    outputFile,
    format = 'text',
    includeTemplates = false,
  } = options;

  // Analyze categories
  const categoriesToAnalyze =
    categoryNames.length > 0
      ? categoryNames.filter((cat) => AVAILABLE_CATEGORIES.includes(cat))
      : [...AVAILABLE_CATEGORIES];

  if (!silent) {
    console.log('[Analysis] Starting core utility classes analysis...');
    console.log('[Analysis] Categories to analyze:', categoriesToAnalyze.join(', '));
    if (includeTemplates) {
      console.log('[Analysis] Template classes will be included in counts');
    }
  }

  try {
    if (verbose) {
      console.log('[Analysis] Generating CSS from core functions...');
    }

    const result = generateAndAnalyzeCSS(categoriesToAnalyze, { includeTemplates });

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Generate report
    let report;
    switch (format) {
      case 'json':
        report = JSON.stringify(
          {
            ...result,
            executionTime,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        );
        break;
      case 'summary':
        const modeText = includeTemplates ? 'with templates' : 'without templates';
        report = `Core analysis: ${result.totalClasses} classes (${modeText}) in ${(executionTime / 1000).toFixed(1)}s`;
        break;
      default:
        report = generateSimpleReport(result, executionTime);
        break;
    }

    // Output
    if (outputFile) {
      fs.writeFileSync(outputFile, report, 'utf-8');
      if (!silent) {
        console.log(`[Analysis] Report saved to: ${outputFile}`);
      }
    } else if (!silent) {
      console.log(report);
    }

    if (!silent) {
      console.log('\n✅ Analysis completed successfully!');
    }
  } catch (error) {
    console.error('[Analysis] Analysis failed with error:', error);
    process.exit(1);
  }
}

/**
 * CLI setup
 */
function setupCLI() {
  const program = new Command();

  program
    .name('check-utilities-simple')
    .description('Analyze core utility classes generation')
    .version('1.0.0');

  program
    .option(
      '-c, --categories <categories>',
      'Comma-separated list of categories to analyze',
      (value) => value.split(',')
    )
    .option('-v, --verbose', 'Enable verbose output', false)
    .option('-s, --silent', 'Suppress output (except errors)', false)
    .option('-o, --output-file <file>', 'Save report to file')
    .option('-f, --format <format>', 'Output format (text|json|summary)', 'text')
    .option('-t, --include-templates', 'Include template classes in counts', false);

  program
    .command('list-categories')
    .description('List all available categories')
    .action(() => {
      console.log('Available categories:');
      AVAILABLE_CATEGORIES.forEach((category) => {
        console.log(`  - ${category}`);
      });
    });

  program
    .command('analyze')
    .description('Run the analysis (default command)')
    .action(async () => {
      const options = program.opts();
      await runAnalysis(options);
    });

  // Default command
  program.action(async () => {
    const options = program.opts();
    await runAnalysis(options);
  });

  program.parse();
}

// CLI execution
if (require.main === module) {
  setupCLI();
}
