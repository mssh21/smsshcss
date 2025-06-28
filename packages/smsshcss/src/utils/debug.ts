/**
 * Debug utilities for SmsshCSS
 * Provides structured logging with different levels and namespaces
 */
import debug from 'debug';

// Create debug instances for different components
export const debugGenerator = debug('smsshcss:generator');
export const debugPurger = debug('smsshcss:purger');
export const debugValidator = debug('smsshcss:validator');
export const debugCache = debug('smsshcss:cache');
export const debugConfig = debug('smsshcss:config');
export const debugPlugin = debug('smsshcss:vite');
export const debugUtils = debug('smsshcss:utils');

// Performance timing utilities
export const performanceTiming = {
  start: (label: string): void => {
    if (debugGenerator.enabled) {
      console.time(`[SmsshCSS] ${label}`);
    }
  },
  end: (label: string): void => {
    if (debugGenerator.enabled) {
      console.timeEnd(`[SmsshCSS] ${label}`);
    }
  },
};

// Structured log output for reports
export const logReport = {
  purge: (data: {
    totalClasses: number;
    usedClasses: number;
    purgedClasses: number;
    buildTime: number;
    reductionPercentage?: number;
  }): void => {
    if (debugPurger.enabled || process.env.SMSSHCSS_SHOW_REPORTS === 'true') {
      console.log('\n🎯 CSS Purge Report');
      console.log('==================');
      console.log(`📊 Total classes: ${data.totalClasses}`);
      console.log(`✅ Used classes: ${data.usedClasses}`);
      console.log(`🗑️  Purged classes: ${data.purgedClasses}`);
      console.log(`⏱️  Build time: ${data.buildTime}ms`);
      if (data.reductionPercentage !== undefined) {
        console.log(`📉 Size reduction: ${data.reductionPercentage}%`);
      }
    }
  },

  cache: (stats: {
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    cacheSize: Record<string, number>;
  }): void => {
    if (debugCache.enabled || process.env.SMSSHCSS_SHOW_CACHE_STATS === 'true') {
      console.log('📊 Performance Cache Statistics:');
      console.log(`  Cache Hits: ${stats.hits}`);
      console.log(`  Cache Misses: ${stats.misses}`);
      console.log(`  Hit Rate: ${stats.hitRate}%`);
      console.log(`  Evictions: ${stats.evictions}`);
      console.log(`  Cache Sizes:`);
      Object.entries(stats.cacheSize).forEach(([key, size]) => {
        console.log(`    ${key}: ${size}`);
      });
    }
  },

  validation: (formatted: string): void => {
    if (debugConfig.enabled || process.env.SMSSHCSS_SHOW_VALIDATION === 'true') {
      console.log('\n📋 SmsshCSS Configuration Validation:');
      console.log(formatted);
    }
  },
};

// Warning system with deprecation tracking
export const logWarning = {
  deprecation: (functionName: string, replacement: string, migrationUrl?: string): void => {
    if (process.env.NODE_ENV === 'development' && process.env.SMSSHCSS_SILENT !== 'true') {
      console.warn(
        `⚠️  [SmsshCSS] ${functionName} は非推奨です。${replacement} への移行を検討してください。` +
          (migrationUrl ? `\n詳細: ${migrationUrl}` : '')
      );
    }
  },

  performance: (message: string, context?: Record<string, unknown>): void => {
    if (debugGenerator.enabled) {
      debugGenerator(`Performance warning: ${message}`, context);
    }
  },

  fileProcessing: (file: string, error: Error): void => {
    if (debugGenerator.enabled) {
      debugGenerator(`Failed to process file ${file}: ${error.message}`);
    }
  },
};

// Development helpers
export const devHelpers = {
  logGeneratedSections: (sections: string[]): void => {
    if (debugGenerator.enabled) {
      debugGenerator(`Generated CSS sections: ${sections.length}`);
      sections.forEach((section, index) => {
        debugGenerator(`Section ${index + 1}: ${section.substring(0, 100)}...`);
      });
    }
  },

  logClassExtraction: (source: string, classes: string[]): void => {
    if (debugPurger.enabled) {
      debugPurger(`Extracted ${classes.length} classes from ${source}`);
      if (classes.length > 0) {
        debugPurger(`Sample classes: ${classes.slice(0, 5).join(', ')}`);
      }
    }
  },

  logCacheHit: (key: string, type: string): void => {
    if (debugCache.enabled) {
      debugCache(`Cache hit for ${type}: ${key}`);
    }
  },

  logCacheMiss: (key: string, type: string): void => {
    if (debugCache.enabled) {
      debugCache(`Cache miss for ${type}: ${key}`);
    }
  },
};

// Check if any debug namespace is enabled
export const isDebugEnabled = (): boolean => {
  return (
    debugGenerator.enabled ||
    debugPurger.enabled ||
    debugValidator.enabled ||
    debugCache.enabled ||
    debugConfig.enabled ||
    debugPlugin.enabled ||
    debugUtils.enabled
  );
};

// Legacy console.log replacement for gradual migration
export const legacyLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development' && process.env.SMSSHCSS_LEGACY_LOGS === 'true') {
    console.log('[SmsshCSS Legacy]', ...args);
  }
};
