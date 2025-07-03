import { ArbitraryValueValidationResult } from '../core/types';

/**
 * Cache functionality for performance optimization
 */
export class PerformanceCache {
  private validationCache = new Map<string, ArbitraryValueValidationResult>();
  private cssClassCache = new Map<string, string>();
  private contentExtractionCache = new Map<string, string[]>();

  // Cache statistics
  private cacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  // Cache size limits
  private readonly maxCacheSize: number;
  private readonly maxContentCacheSize: number;

  constructor(maxCacheSize: number = 1000, maxContentCacheSize: number = 100) {
    this.maxCacheSize = maxCacheSize;
    this.maxContentCacheSize = maxContentCacheSize;
  }

  /**
   * Get validation result from cache
   */
  getValidationResult(key: string): ArbitraryValueValidationResult | null {
    if (this.validationCache.has(key)) {
      this.cacheStats.hits++;
      return this.validationCache.get(key)!;
    }
    this.cacheStats.misses++;
    return null;
  }

  /**
   * Save validation result to cache
   */
  setValidationResult(key: string, result: ArbitraryValueValidationResult): void {
    this.evictIfNeeded(this.validationCache, this.maxCacheSize);
    this.validationCache.set(key, result);
  }

  /**
   * Get CSS class from cache
   */
  getCSSClass(key: string): string | null {
    if (this.cssClassCache.has(key)) {
      this.cacheStats.hits++;
      return this.cssClassCache.get(key)!;
    }
    this.cacheStats.misses++;
    return null;
  }

  /**
   * Save CSS class to cache
   */
  setCSSClass(key: string, cssClass: string): void {
    this.evictIfNeeded(this.cssClassCache, this.maxCacheSize);
    this.cssClassCache.set(key, cssClass);
  }

  /**
   * Get content extraction result from cache
   */
  getContentExtraction(contentHash: string): string[] | null {
    if (this.contentExtractionCache.has(contentHash)) {
      this.cacheStats.hits++;
      return this.contentExtractionCache.get(contentHash)!;
    }
    this.cacheStats.misses++;
    return null;
  }

  /**
   * Save content extraction result to cache
   */
  setContentExtraction(contentHash: string, classes: string[]): void {
    this.evictIfNeeded(this.contentExtractionCache, this.maxContentCacheSize);
    this.contentExtractionCache.set(contentHash, classes);
  }

  /**
   * Remove old entries when cache size exceeds limit
   */
  private evictIfNeeded<T>(cache: Map<string, T>, maxSize: number): void {
    if (cache.size >= maxSize) {
      // LRU style: remove first entry
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
        this.cacheStats.evictions++;
      }
    }
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.validationCache.clear();
    this.cssClassCache.clear();
    this.contentExtractionCache.clear();
    this.cacheStats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    hits: number;
    misses: number;
    evictions: number;
    total: number;
    hitRate: number;
    cacheSize: {
      validation: number;
      cssClass: number;
      contentExtraction: number;
    };
  } {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? (this.cacheStats.hits / total) * 100 : 0;

    return {
      ...this.cacheStats,
      total,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheSize: {
        validation: this.validationCache.size,
        cssClass: this.cssClassCache.size,
        contentExtraction: this.contentExtractionCache.size,
      },
    };
  }

  /**
   * Display cache statistics
   */
  printStats(): void {
    const stats = this.getStats();
    console.log('📊 Performance Cache Statistics:');
    console.log(`  Cache Hits: ${stats.hits}`);
    console.log(`  Cache Misses: ${stats.misses}`);
    console.log(`  Hit Rate: ${stats.hitRate}%`);
    console.log(`  Evictions: ${stats.evictions}`);
    console.log(`  Cache Sizes:`);
    console.log(`    Validation: ${stats.cacheSize.validation}`);
    console.log(`    CSS Classes: ${stats.cacheSize.cssClass}`);
    console.log(`    Content Extraction: ${stats.cacheSize.contentExtraction}`);
  }
}

/**
 * Generate content hash (simplified version)
 */
export function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create memoization function
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Create async memoization function
 */
export function memoizeAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => Promise<TReturn> {
  const cache = new Map<string, Promise<TReturn>>();

  return (...args: TArgs): Promise<TReturn> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = fn(...args);
    cache.set(key, promise);

    // Remove from cache on error
    promise.catch(() => {
      cache.delete(key);
    });

    return promise;
  };
}

/**
 * Utility for batch processing
 */
export class BatchProcessor<TInput, TOutput> {
  private queue: Array<{
    item: TInput;
    resolve: (value: TOutput) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private processing = false;
  private batchSize: number;
  private batchTimeout: number;
  private processor: (items: TInput[]) => Promise<TOutput[]>;

  constructor(
    processor: (items: TInput[]) => Promise<TOutput[]>,
    batchSize: number = 50,
    batchTimeout: number = 10
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
  }

  /**
   * Add item to processing queue
   */
  add(item: TInput): Promise<TOutput> {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      this.scheduleProcessing();
    });
  }

  /**
   * バッチ処理をスケジュール
   */
  private scheduleProcessing(): void {
    if (this.processing) return;

    // バッチサイズに達した場合は即座に処理
    if (this.queue.length >= this.batchSize) {
      this.processBatch();
    } else {
      // タイムアウト後に処理
      setTimeout(() => {
        if (this.queue.length > 0 && !this.processing) {
          this.processBatch();
        }
      }, this.batchTimeout);
    }
  }

  /**
   * バッチを処理
   */
  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      const items = batch.map((entry) => entry.item);
      const results = await this.processor(items);

      // 結果を対応するresolverに渡す
      batch.forEach((entry, index) => {
        if (results[index] !== undefined) {
          entry.resolve(results[index]);
        }
      });
    } catch (error) {
      // エラーを対応するrejecterに渡す
      batch.forEach((entry) => {
        entry.reject(error);
      });
    } finally {
      this.processing = false;

      // まだキューにアイテムがあれば次のバッチを処理
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }
}

/**
 * グローバルキャッシュインスタンス
 */
export const globalCache = new PerformanceCache();

/**
 * デバッグ用：キャッシュ統計をログ出力
 */
export function logCacheStats(): void {
  globalCache.printStats();
}
