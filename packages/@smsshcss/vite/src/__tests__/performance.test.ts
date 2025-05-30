import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

// パフォーマンステスト用のヘルパー
interface PerformanceMetrics {
  transformTime: number;
  memoryUsage: number;
  fileCount: number;
  classCount: number;
  outputSize: number;
}

interface PerformanceTestResult {
  metrics: PerformanceMetrics;
  success: boolean;
  error?: Error;
}

class PerformanceTestHelper {
  private tempDir: string;

  constructor() {
    this.tempDir = fs.mkdtempSync(path.join(tmpdir(), 'smsshcss-perf-'));
  }

  cleanup(): void {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
  }

  async measureTransformPerformance(
    plugin: ReturnType<typeof smsshcss>,
    cssId: string = 'test.css'
  ): Promise<PerformanceTestResult> {
    const startMemory = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    try {
      const result = await plugin.transform('', cssId);
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      return {
        metrics: {
          transformTime: endTime - startTime,
          memoryUsage: endMemory - startMemory,
          fileCount: this.countFiles(),
          classCount: this.countClasses(result?.code || ''),
          outputSize: result?.code?.length || 0,
        },
        success: true,
      };
    } catch (error) {
      return {
        metrics: {
          transformTime: 0,
          memoryUsage: 0,
          fileCount: 0,
          classCount: 0,
          outputSize: 0,
        },
        success: false,
        error: error as Error,
      };
    }
  }

  createTestFiles(fileCount: number, classesPerFile: number): void {
    const srcDir = path.join(this.tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    for (let i = 0; i < fileCount; i++) {
      const classes = [];
      for (let j = 0; j < classesPerFile; j++) {
        classes.push(
          `m-[${i + j}px]`,
          `p-[${j * 2}rem]`,
          `gap-[${i * j + 1}em]`,
          `w-[${(i + 1) * 10}px]`,
          `h-[${(j + 1) * 5}vh]`
        );
      }

      const content = `
export function Component${i}() {
  return (
    <div className="${classes.join(' ')}">
      <h2>Performance Test Component ${i}</h2>
      <div className="flex gap-md p-lg">
        <span className="m-sm">Child ${i}</span>
      </div>
    </div>
  );
}`;
      fs.writeFileSync(path.join(srcDir, `Component${i}.tsx`), content);
    }
  }

  createComplexProject(complexity: 'small' | 'medium' | 'large' | 'huge'): void {
    const configs = {
      small: { files: 10, classesPerFile: 5 },
      medium: { files: 50, classesPerFile: 10 },
      large: { files: 100, classesPerFile: 15 },
      huge: { files: 500, classesPerFile: 20 },
    };

    const config = configs[complexity];
    this.createTestFiles(config.files, config.classesPerFile);
  }

  private countFiles(): number {
    return this.getAllFiles(this.tempDir).length;
  }

  private countClasses(css: string): number {
    return (css.match(/\.[a-zA-Z_-][\w-]*\s*\{/g) || []).length;
  }

  private getAllFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];

    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }
}

describe('SmsshCSS Vite Plugin - Performance Tests', () => {
  let helper: PerformanceTestHelper;

  beforeEach(() => {
    helper = new PerformanceTestHelper();
  });

  afterEach(() => {
    helper.cleanup();
  });

  describe('Transform Performance', () => {
    it('should transform small projects efficiently', async () => {
      helper.createComplexProject('small');

      const plugin = smsshcss({
        content: [`${helper['tempDir']}/**/*.tsx`],
      });

      const result = await helper.measureTransformPerformance(plugin);

      expect(result.success).toBe(true);
      expect(result.metrics.transformTime).toBeLessThan(1000); // 1秒以内
      expect(result.metrics.memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB以内
      expect(result.metrics.outputSize).toBeGreaterThan(0);

      console.log('Small project metrics:', result.metrics);
    });

    it('should handle medium projects within reasonable limits', async () => {
      helper.createComplexProject('medium');

      const plugin = smsshcss({
        content: [`${helper['tempDir']}/**/*.tsx`],
      });

      const result = await helper.measureTransformPerformance(plugin);

      expect(result.success).toBe(true);
      expect(result.metrics.transformTime).toBeLessThan(5000); // 5秒以内
      expect(result.metrics.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB以内

      console.log('Medium project metrics:', result.metrics);
    });

    it('should scale reasonably with large projects', async () => {
      helper.createComplexProject('large');

      const plugin = smsshcss({
        content: [`${helper['tempDir']}/**/*.tsx`],
      });

      const result = await helper.measureTransformPerformance(plugin);

      expect(result.success).toBe(true);
      expect(result.metrics.transformTime).toBeLessThan(15000); // 15秒以内
      expect(result.metrics.memoryUsage).toBeLessThan(200 * 1024 * 1024); // 200MB以内

      console.log('Large project metrics:', result.metrics);
    });
  });

  describe('Memory Efficiency', () => {
    it('should not have memory leaks during multiple transforms', async () => {
      helper.createComplexProject('medium');

      const plugin = smsshcss({
        content: [`${helper['tempDir']}/**/*.tsx`],
      });

      const initialMemory = process.memoryUsage().heapUsed;
      const results: PerformanceTestResult[] = [];

      // 複数回のtransformを実行
      for (let i = 0; i < 10; i++) {
        const result = await helper.measureTransformPerformance(plugin, `test-${i}.css`);
        results.push(result);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // 全て成功
      expect(results.every((r) => r.success)).toBe(true);

      // メモリリークがないことを確認（適度な増加は許容）
      expect(memoryIncrease).toBeLessThan(500 * 1024 * 1024); // 500MB以内

      console.log(
        'Memory increase after 10 transforms:',
        Math.round(memoryIncrease / 1024 / 1024),
        'MB'
      );
    });

    it('should clean up resources properly', async () => {
      helper.createComplexProject('small');

      const beforeGC = process.memoryUsage().heapUsed;

      // 複数のプラグインインスタンスを作成・破棄
      for (let i = 0; i < 20; i++) {
        const tempPlugin = smsshcss({
          content: [`${helper['tempDir']}/**/*.tsx`],
        });
        await tempPlugin.transform('', `cleanup-test-${i}.css`);
      }

      // ガベージコレクションを実行
      if (global.gc) {
        global.gc();
      }

      const afterGC = process.memoryUsage().heapUsed;
      const memoryIncrease = afterGC - beforeGC;

      // リソースが適切にクリーンアップされていることを確認
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB以内

      console.log(
        'Memory increase after cleanup test:',
        Math.round(memoryIncrease / 1024 / 1024),
        'MB'
      );
    });
  });

  describe('Concurrent Processing', () => {
    it('should handle concurrent transforms efficiently', async () => {
      helper.createComplexProject('medium');

      const plugin = smsshcss({
        content: [`${helper['tempDir']}/**/*.tsx`],
      });

      const startTime = performance.now();

      // 10個の並行transform
      const promises = Array.from({ length: 10 }, (_, i) =>
        helper.measureTransformPerformance(plugin, `concurrent-${i}.css`)
      );

      const results = await Promise.all(promises);
      const endTime = performance.now();

      // 全て成功
      expect(results.every((r) => r.success)).toBe(true);

      // 並行処理の効率性確認（単純な10倍よりも早い）
      const totalTime = endTime - startTime;
      const averageSequentialTime = results.reduce((sum, r) => sum + r.metrics.transformTime, 0);

      expect(totalTime).toBeLessThan(averageSequentialTime * 0.8); // 20%以上の改善

      console.log('Concurrent processing efficiency:', {
        totalTime: Math.round(totalTime),
        averageSequential: Math.round(averageSequentialTime / 10),
        improvement: Math.round((1 - totalTime / averageSequentialTime) * 100) + '%',
      });
    });
  });

  describe('Output Size Optimization', () => {
    it('should generate reasonable output sizes for different project scales', async () => {
      const scales = ['small', 'medium', 'large'] as const;
      const results: Record<string, PerformanceTestResult> = {};

      for (const scale of scales) {
        helper.createComplexProject(scale);

        const plugin = smsshcss({
          content: [`${helper['tempDir']}/**/*.tsx`],
          minify: true,
        });

        results[scale] = await helper.measureTransformPerformance(plugin);

        // クリーンアップして次のテストに備える
        helper.cleanup();
        helper = new PerformanceTestHelper();
      }

      // 出力サイズがプロジェクトサイズに比例していることを確認
      expect(results.small.metrics.outputSize).toBeLessThan(results.medium.metrics.outputSize);
      expect(results.medium.metrics.outputSize).toBeLessThan(results.large.metrics.outputSize);

      // 各スケールで適切なサイズであることを確認
      expect(results.small.metrics.outputSize).toBeLessThan(100 * 1024); // 100KB以内
      expect(results.medium.metrics.outputSize).toBeLessThan(500 * 1024); // 500KB以内
      expect(results.large.metrics.outputSize).toBeLessThan(2 * 1024 * 1024); // 2MB以内

      console.log('Output size scaling:', {
        small: Math.round(results.small.metrics.outputSize / 1024) + 'KB',
        medium: Math.round(results.medium.metrics.outputSize / 1024) + 'KB',
        large: Math.round(results.large.metrics.outputSize / 1024) + 'KB',
      });
    });
  });
});
