#!/usr/bin/env node

const { performance } = require('perf_hooks');

// Import built core features
try {
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
  } = require('../dist/utils/index.js');

  // Available categories
  const CATEGORIES = {
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
   * Simple count of classes from CSS
   */
  function countClasses(css) {
    const matches = css.match(/\.[a-zA-Z][a-zA-Z0-9_-]*\s*{/g) || [];
    return matches.length;
  }

  /**
   * Main verification process
   */
  function runVerification() {
    const startTime = performance.now();

    console.log('✅ Core Utility Classes Verification Report');
    console.log('='.repeat(50));
    console.log('');

    let totalClasses = 0;
    let successCount = 0;
    let failCount = 0;

    // Verify each category
    Object.entries(CATEGORIES).forEach(([name, generator]) => {
      try {
        const css = generator();
        const classCount = countClasses(css);

        if (classCount > 0) {
          console.log(`✅ ${name.padEnd(12)}: ${classCount.toString().padStart(4)} classes`);
          totalClasses += classCount;
          successCount++;
        } else {
          console.log(
            `⚠️  ${name.padEnd(12)}: ${classCount.toString().padStart(4)} classes (empty)`
          );
          failCount++;
        }
      } catch (error) {
        console.log(`❌ ${name.padEnd(12)}: ERROR - ${error.message}`);
        failCount++;
      }
    });

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Total utility classes: ${totalClasses.toLocaleString()}`);
    console.log(`   - Successful categories: ${successCount}/${Object.keys(CATEGORIES).length}`);
    console.log(`   - Failed categories: ${failCount}`);
    console.log(`   - Execution time: ${(executionTime / 1000).toFixed(2)}s`);
    console.log('');

    if (failCount === 0) {
      console.log('🎉 All utility classes generated successfully!');
      console.log('');
      console.log('💡 Next steps:');
      console.log('   - Test integration: yarn test:integration');
      console.log('   - Check manual output: yarn debug:classes');
      process.exit(0);
    } else {
      console.log('❌ Some categories failed. Please check the implementation.');
      process.exit(1);
    }
  }

  /**
   * Display available categories
   */
  function listCategories() {
    console.log('Available utility categories:');
    Object.keys(CATEGORIES).forEach((category) => {
      console.log(`  - ${category}`);
    });
  }

  // CLI processing
  const args = process.argv.slice(2);

  if (args.includes('list-categories') || args.includes('--list')) {
    listCategories();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  node scripts/verify-utilities.js           Run verification');
    console.log('  node scripts/verify-utilities.js --list    List categories');
    console.log('  node scripts/verify-utilities.js --help    Show this help');
  } else {
    runVerification();
  }
} catch (error) {
  console.error('❌ Failed to load utility modules.');
  console.error('   Make sure to run "yarn build" first.');
  console.error('   Error:', error.message);
  process.exit(1);
}
