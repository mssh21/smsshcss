import { ArbitraryValueValidationResult } from '../core/types';

/**
 * パフォーマンス最適化のためのキャッシュ機能
 */
export class PerformanceCache {
  private validationCache = new Map<string, ArbitraryValueValidationResult>();
  private cssClassCache = new Map<string, string>();
  private contentExtractionCache = new Map<string, string[]>();

  // キャッシュの統計情報
  private cacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  // キャッシュサイズの制限
  private readonly maxCacheSize: number;
  private readonly maxContentCacheSize: number;

  constructor(maxCacheSize: number = 1000, maxContentCacheSize: number = 100) {
    this.maxCacheSize = maxCacheSize;
    this.maxContentCacheSize = maxContentCacheSize;
  }

  /**
   * バリデーション結果をキャッシュから取得
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
   * バリデーション結果をキャッシュに保存
   */
  setValidationResult(key: string, result: ArbitraryValueValidationResult): void {
    this.evictIfNeeded(this.validationCache, this.maxCacheSize);
    this.validationCache.set(key, result);
  }

  /**
   * CSSクラスをキャッシュから取得
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
   * CSSクラスをキャッシュに保存
   */
  setCSSClass(key: string, cssClass: string): void {
    this.evictIfNeeded(this.cssClassCache, this.maxCacheSize);
    this.cssClassCache.set(key, cssClass);
  }

  /**
   * コンテンツ抽出結果をキャッシュから取得
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
   * コンテンツ抽出結果をキャッシュに保存
   */
  setContentExtraction(contentHash: string, classes: string[]): void {
    this.evictIfNeeded(this.contentExtractionCache, this.maxContentCacheSize);
    this.contentExtractionCache.set(contentHash, classes);
  }

  /**
   * キャッシュサイズが制限を超えた場合に古いエントリを削除
   */
  private evictIfNeeded<T>(cache: Map<string, T>, maxSize: number): void {
    if (cache.size >= maxSize) {
      // LRU style: 最初のエントリを削除
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
        this.cacheStats.evictions++;
      }
    }
  }

  /**
   * すべてのキャッシュをクリア
   */
  clear(): void {
    this.validationCache.clear();
    this.cssClassCache.clear();
    this.contentExtractionCache.clear();
    this.cacheStats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * キャッシュの統計情報を取得
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
   * キャッシュの統計情報を表示
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
 * コンテンツのハッシュを生成（簡易版）
 */
export function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit integerに変換
  }
  return Math.abs(hash).toString(36);
}

/**
 * メモ化関数を作成
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
 * 非同期メモ化関数を作成
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

    // エラーの場合はキャッシュから削除
    promise.catch(() => {
      cache.delete(key);
    });

    return promise;
  };
}

/**
 * バッチ処理のためのユーティリティ
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
   * アイテムを処理キューに追加
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
