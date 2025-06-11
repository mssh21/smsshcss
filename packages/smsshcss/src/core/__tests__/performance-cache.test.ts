import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PerformanceCache,
  globalCache,
  generateContentHash,
  memoize,
  memoizeAsync,
  BatchProcessor,
} from '../performance-cache';
import { ArbitraryValueValidationResult } from '../types';

describe('PerformanceCache', () => {
  let cache: PerformanceCache;

  beforeEach(() => {
    cache = new PerformanceCache(10, 5); // Small cache for testing
  });

  describe('Validation Cache', () => {
    it('should store and retrieve validation results', () => {
      const result: ArbitraryValueValidationResult = {
        isValid: true,
        errors: [],
        sanitizedValue: '1rem',
        warnings: [],
      };

      cache.setValidationResult('test-key', result);
      const retrieved = cache.getValidationResult('test-key');

      expect(retrieved).toEqual(result);
    });

    it('should return null for non-existent keys', () => {
      const result = cache.getValidationResult('non-existent');
      expect(result).toBeNull();
    });

    it('should track cache hits and misses', () => {
      const result: ArbitraryValueValidationResult = {
        isValid: true,
        errors: [],
        sanitizedValue: '1rem',
        warnings: [],
      };

      // Miss
      cache.getValidationResult('test-key');

      // Set and hit
      cache.setValidationResult('test-key', result);
      cache.getValidationResult('test-key');

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(50);
    });
  });

  describe('CSS Class Cache', () => {
    it('should store and retrieve CSS classes', () => {
      const cssClass = '.test { color: red; }';

      cache.setCSSClass('test-key', cssClass);
      const retrieved = cache.getCSSClass('test-key');

      expect(retrieved).toBe(cssClass);
    });

    it('should return null for non-existent keys', () => {
      const result = cache.getCSSClass('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('Content Extraction Cache', () => {
    it('should store and retrieve content extraction results', () => {
      const classes = ['class1', 'class2', 'class3'];

      cache.setContentExtraction('content-hash', classes);
      const retrieved = cache.getContentExtraction('content-hash');

      expect(retrieved).toEqual(classes);
    });

    it('should return null for non-existent hashes', () => {
      const result = cache.getContentExtraction('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('Cache Eviction', () => {
    it('should evict old entries when cache is full', () => {
      // Fill the validation cache beyond its limit (10 items)
      for (let i = 0; i < 15; i++) {
        const result: ArbitraryValueValidationResult = {
          isValid: true,
          errors: [],
          sanitizedValue: `${i}rem`,
          warnings: [],
        };
        cache.setValidationResult(`key-${i}`, result);
      }

      const stats = cache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
      expect(stats.cacheSize.validation).toBeLessThanOrEqual(10);
    });

    it('should evict content extraction cache separately', () => {
      // Fill the content extraction cache beyond its limit (5 items)
      for (let i = 0; i < 8; i++) {
        cache.setContentExtraction(`hash-${i}`, [`class-${i}`]);
      }

      const stats = cache.getStats();
      expect(stats.cacheSize.contentExtraction).toBeLessThanOrEqual(5);
    });
  });

  describe('Cache Management', () => {
    it('should clear all caches', () => {
      // Add some items
      cache.setValidationResult('key1', {
        isValid: true,
        errors: [],
        sanitizedValue: '1rem',
        warnings: [],
      });
      cache.setCSSClass('key2', '.test {}');
      cache.setContentExtraction('hash1', ['class1']);

      // Clear and verify
      cache.clear();
      const stats = cache.getStats();

      expect(stats.cacheSize.validation).toBe(0);
      expect(stats.cacheSize.cssClass).toBe(0);
      expect(stats.cacheSize.contentExtraction).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      const result: ArbitraryValueValidationResult = {
        isValid: true,
        errors: [],
        sanitizedValue: '1rem',
        warnings: [],
      };

      cache.setValidationResult('key1', result);

      // 2 hits, 1 miss
      cache.getValidationResult('key1'); // hit
      cache.getValidationResult('key1'); // hit
      cache.getValidationResult('key2'); // miss

      const stats = cache.getStats();
      expect(stats.hitRate).toBe(66.67); // 2/3 * 100 rounded
    });

    it('should print stats without throwing', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      cache.printStats();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('generateContentHash', () => {
  it('should generate consistent hashes for same content', () => {
    const content = 'test content';
    const hash1 = generateContentHash(content);
    const hash2 = generateContentHash(content);

    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
  });

  it('should generate different hashes for different content', () => {
    const hash1 = generateContentHash('content 1');
    const hash2 = generateContentHash('content 2');

    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty content', () => {
    const hash = generateContentHash('');
    expect(typeof hash).toBe('string');
  });

  it('should handle unicode content', () => {
    const hash = generateContentHash('こんにちは🌸');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });
});

describe('memoize', () => {
  it('should cache function results', () => {
    let callCount = 0;
    const expensiveFunction = (x: number): number => {
      callCount++;
      return x * 2;
    };

    const memoizedFunction = memoize(expensiveFunction);

    // First call
    const result1 = memoizedFunction(5);
    expect(result1).toBe(10);
    expect(callCount).toBe(1);

    // Second call with same input (should use cache)
    const result2 = memoizedFunction(5);
    expect(result2).toBe(10);
    expect(callCount).toBe(1); // Should not increment

    // Third call with different input
    const result3 = memoizedFunction(3);
    expect(result3).toBe(6);
    expect(callCount).toBe(2);
  });

  it('should work with custom key generator', () => {
    let callCount = 0;
    const complexFunction = (obj: { x: number; y: number }): number => {
      callCount++;
      return obj.x + obj.y;
    };

    const memoizedFunction = memoize(complexFunction, (obj): string => `${obj.x}-${obj.y}`);

    const result1 = memoizedFunction({ x: 1, y: 2 });
    const result2 = memoizedFunction({ x: 1, y: 2 });

    expect(result1).toBe(3);
    expect(result2).toBe(3);
    expect(callCount).toBe(1);
  });

  it('should handle multiple arguments', () => {
    let callCount = 0;
    const multiArgFunction = (a: number, b: string, c: boolean): string => {
      callCount++;
      return `${a}-${b}-${c}`;
    };

    const memoizedFunction = memoize(multiArgFunction);

    memoizedFunction(1, 'test', true);
    memoizedFunction(1, 'test', true); // Should use cache

    expect(callCount).toBe(1);
  });
});

describe('memoizeAsync', () => {
  it('should cache async function results', async () => {
    let callCount = 0;
    const asyncFunction = async (x: number): Promise<number> => {
      callCount++;
      return new Promise<number>((resolve) => {
        setTimeout(() => resolve(x * 2), 10);
      });
    };

    const memoizedFunction = memoizeAsync(asyncFunction);

    // First call
    const result1 = await memoizedFunction(5);
    expect(result1).toBe(10);
    expect(callCount).toBe(1);

    // Second call with same input (should use cache)
    const result2 = await memoizedFunction(5);
    expect(result2).toBe(10);
    expect(callCount).toBe(1);
  });

  it('should handle rejected promises', async () => {
    let callCount = 0;
    const failingFunction = async (shouldFail: boolean): Promise<string> => {
      callCount++;
      if (shouldFail) {
        throw new Error('Test error');
      }
      return 'success';
    };

    const memoizedFunction = memoizeAsync(failingFunction);

    // First call that fails
    await expect(memoizedFunction(true)).rejects.toThrow('Test error');
    expect(callCount).toBe(1);

    // Second call with same input should not use cache (since first failed)
    await expect(memoizedFunction(true)).rejects.toThrow('Test error');
    expect(callCount).toBe(2);

    // Successful call
    const result = await memoizedFunction(false);
    expect(result).toBe('success');
    expect(callCount).toBe(3);

    // Second successful call should use cache
    const result2 = await memoizedFunction(false);
    expect(result2).toBe('success');
    expect(callCount).toBe(3);
  });
});

describe('BatchProcessor', () => {
  it('should process items in batches', async () => {
    const processedBatches: number[][] = [];
    const processor = async (_items: number[]): Promise<number[]> => {
      processedBatches.push([..._items]);
      return _items.map((x) => x * 2);
    };

    const batchProcessor = new BatchProcessor(processor, 3, 50);

    // Add items
    const promises = [1, 2, 3, 4, 5].map((x) => batchProcessor.add(x));

    const results = await Promise.all(promises);

    expect(results).toEqual([2, 4, 6, 8, 10]);
    expect(processedBatches.length).toBeGreaterThan(0);

    // Should process in batches of 3
    expect(processedBatches[0]).toEqual([1, 2, 3]);
    expect(processedBatches[1]).toEqual([4, 5]);
  });

  it('should handle processing errors', async () => {
    const processor = async (_items: number[]): Promise<number[]> => {
      throw new Error('Processing failed');
    };

    const batchProcessor = new BatchProcessor(processor, 2, 10);

    const promise1 = batchProcessor.add(1);
    const promise2 = batchProcessor.add(2);

    await expect(promise1).rejects.toThrow('Processing failed');
    await expect(promise2).rejects.toThrow('Processing failed');
  });

  it('should respect batch timeout', async () => {
    const processedBatches: number[][] = [];
    const processor = async (items: number[]): Promise<number[]> => {
      processedBatches.push([...items]);
      return items.map((x) => x * 2);
    };

    const batchProcessor = new BatchProcessor(processor, 10, 20); // Large batch size, short timeout

    // Add just one item
    const promise = batchProcessor.add(1);

    const result = await promise;

    expect(result).toBe(2);
    expect(processedBatches).toEqual([[1]]);
  });

  it('should process immediately when batch size is reached', async () => {
    let processedCount = 0;
    const processor = async (items: number[]): Promise<number[]> => {
      processedCount += items.length;
      return items.map((x) => x * 2);
    };

    const batchProcessor = new BatchProcessor(processor, 2, 1000); // Small batch, long timeout

    // Add two items to trigger immediate processing
    const promise1 = batchProcessor.add(1);
    const promise2 = batchProcessor.add(2);

    await Promise.all([promise1, promise2]);

    expect(processedCount).toBe(2);
  });
});

describe('Global Cache', () => {
  it('should be properly initialized', () => {
    expect(globalCache).toBeInstanceOf(PerformanceCache);
  });

  it('should maintain state across operations', () => {
    // Clear first to ensure clean state
    globalCache.clear();

    const result: ArbitraryValueValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: 'test',
      warnings: [],
    };

    globalCache.setValidationResult('global-test', result);
    const retrieved = globalCache.getValidationResult('global-test');

    expect(retrieved).toEqual(result);
  });
});

describe('Integration Tests', () => {
  it('should work together in realistic scenarios', async () => {
    const cache = new PerformanceCache();

    // Simulate validation caching
    const validationResults = [
      {
        key: 'calc(100%-20px)',
        result: { isValid: true, errors: [], sanitizedValue: 'calc(100% - 20px)', warnings: [] },
      },
      { key: '1rem', result: { isValid: true, errors: [], sanitizedValue: '1rem', warnings: [] } },
      {
        key: 'invalid',
        result: {
          isValid: false,
          errors: ['Invalid value'],
          sanitizedValue: 'invalid',
          warnings: [],
        },
      },
    ];

    // Cache validation results
    validationResults.forEach(({ key, result }) => {
      cache.setValidationResult(key, result);
    });

    // Simulate CSS class caching
    cache.setCSSClass(
      'm-[calc(100%-20px)]',
      '.m-\\[calc\\(100\\%-20px\\)\\] { margin: calc(100% - 20px); }'
    );

    // Simulate content extraction caching
    const contentHash = generateContentHash('<div class="m-[calc(100%-20px)] p-1rem">Test</div>');
    cache.setContentExtraction(contentHash, ['.m-\\[calc\\(100\\%-20px\\)\\]', '.p-1rem']);

    // Verify cache effectiveness
    const stats = cache.getStats();
    expect(stats.cacheSize.validation).toBe(3);
    expect(stats.cacheSize.cssClass).toBe(1);
    expect(stats.cacheSize.contentExtraction).toBe(1);

    // Test retrieval
    const retrievedValidation = cache.getValidationResult('calc(100%-20px)');
    expect(retrievedValidation?.sanitizedValue).toBe('calc(100% - 20px)');

    const retrievedCSS = cache.getCSSClass('m-[calc(100%-20px)]');
    expect(retrievedCSS).toContain('margin: calc(100% - 20px)');

    const retrievedClasses = cache.getContentExtraction(contentHash);
    expect(retrievedClasses).toHaveLength(2);
  });

  it('should demonstrate performance improvement with caching', () => {
    const cache = new PerformanceCache();

    // テスト用の結果を準備
    const testResult = { isValid: true, errors: [], sanitizedValue: 'test', warnings: [] };
    cache.setValidationResult('test-key', testResult);

    // キャッシュヒットを確認（パフォーマンス測定の代わりに機能確認）
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      cache.getValidationResult('test-key');
    }

    const stats = cache.getStats();
    expect(stats.hits).toBe(iterations);
    expect(stats.hitRate).toBe(100);

    // キャッシュサイズが適切に制限されていることを確認
    expect(stats.cacheSize.validation).toBe(1);
  });
});
