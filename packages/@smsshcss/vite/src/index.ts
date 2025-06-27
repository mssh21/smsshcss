import type { Plugin, ViteDevServer } from 'vite';
import {
  SmsshCSSConfig,
  generateCSS as smsshGenerateCSS,
  generateCSSSync as smsshGenerateCSSSync,
  extractCustomSpacingClasses,
  extractCustomWidthClasses,
  extractCustomHeightClasses,
  extractCustomGridClasses,
  extractCustomOrderClasses,
  extractCustomZIndexClasses,
  extractCustomColorClasses,
} from 'smsshcss';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { createHash } from 'crypto';

export interface SmsshCSSViteOptions {
  /**
   * スキャンするファイルパターン
   * @default ['index.html', 'src/(all-subdirs)/(all-files).{html,js,ts,jsx,tsx,vue,svelte,astro}']
   */
  content?: string[];
  /**
   * リセットCSSを含めるかどうか
   * @default true
   */
  includeReset?: boolean;
  /**
   * ベースCSSを含めるかどうか
   * @default true
   */
  includeBase?: boolean;
  /**
   * パージ設定
   */
  purge?: {
    enabled?: boolean;
    safelist?: (string | RegExp)[];
    blocklist?: (string | RegExp)[];
    keyframes?: boolean;
    fontFace?: boolean;
    variables?: boolean;
  };
  /**
   * Apply設定（よく使うユーティリティクラスの組み合わせを定義）
   */
  apply?: Record<string, string>;
  /**
   * 開発時にパージレポートを表示するかどうか
   * @default false
   */
  showPurgeReport?: boolean;
  /**
   * CSS minifyを有効にするかどうか
   * @default true
   */
  minify?: boolean;
  /**
   * キャッシュを有効にするかどうか
   * @default true
   */
  cache?: boolean;
  /**
   * デバッグログを有効にするかどうか
   * @default false
   */
  debug?: boolean;
}

/**
 * カスタムクラス抽出関数の型定義
 */
type CustomClassExtractor = (content: string) => string[];

/**
 * カスタムクラス抽出関数のマップ
 */
const CUSTOM_CLASS_EXTRACTORS: Record<string, CustomClassExtractor> = {
  spacing: extractCustomSpacingClasses,
  width: extractCustomWidthClasses,
  height: extractCustomHeightClasses,
  grid: extractCustomGridClasses,
  order: extractCustomOrderClasses,
  zIndex: extractCustomZIndexClasses,
  color: extractCustomColorClasses,
};

/**
 * ファイルパターンをマッチングするための正規表現を生成
 */
function createPatternRegex(pattern: string): RegExp {
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\{([^}]+)\}/g, '($1)')
    .replace(/,/g, '|')
    .replace(/\./g, '\\.');
  return new RegExp(regexPattern);
}

/**
 * キャッシュクラス
 */
class CSSCache {
  private cache = new Map<string, { content: string; hash: string; timestamp: number }>();
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  /**
   * ファイル内容のハッシュを生成
   */
  private generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }

  /**
   * キャッシュから取得
   */
  get(key: string, content: string): string | null {
    if (!this.enabled) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    const currentHash = this.generateHash(content);
    if (cached.hash !== currentHash) {
      this.cache.delete(key);
      return null;
    }

    return cached.content;
  }

  /**
   * キャッシュに保存
   */
  set(key: string, content: string, result: string): void {
    if (!this.enabled) return;

    const hash = this.generateHash(content);
    this.cache.set(key, {
      content: result,
      hash,
      timestamp: Date.now(),
    });
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 古いキャッシュエントリを削除
   */
  cleanup(maxAge = 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * ファイルからカスタムクラスを抽出する統合関数
 */
async function extractAllCustomClassesFromFiles(
  content: string[],
  cache: CSSCache,
  debug = false
): Promise<string[]> {
  const allCustomClasses: string[] = [];
  const seenClasses = new Set<string>();
  const fileCache = new Map<string, string>();

  if (debug) {
    console.log('[smsshcss] Extracting custom classes from files...');
  }

  try {
    // ファイルパターンをまとめて処理
    const allFiles = new Set<string>();
    const extractionPromises: Promise<void>[] = [];

    for (const pattern of content) {
      extractionPromises.push(
        (async (): Promise<void> => {
          try {
            const files = glob.sync(pattern, {
              cwd: process.cwd(),
              ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '*.min.*'],
              dot: false,
            });
            files.forEach((file) => allFiles.add(file));
          } catch (error) {
            if (debug) {
              console.warn(
                `[smsshcss] Failed to glob pattern "${pattern}": ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
            }
          }
        })()
      );
    }

    // 全てのglobパターンを並列実行
    await Promise.all(extractionPromises);

    // ファイルを並列処理
    const filePromises = Array.from(allFiles).map(async (file) => {
      try {
        const filePath = path.resolve(process.cwd(), file);
        const cacheKey = `file:${filePath}`;

        // キャッシュから取得または読み込み
        let fileContent: string;
        if (fileCache.has(filePath)) {
          fileContent = fileCache.get(filePath)!;
        } else {
          fileContent = fs.readFileSync(filePath, 'utf-8');
          fileCache.set(filePath, fileContent);
        }

        // キャッシュされた結果をチェック
        const cachedResult = cache.get(cacheKey, fileContent);
        if (cachedResult) {
          return JSON.parse(cachedResult) as string[];
        }

        // 各種カスタムクラスを抽出
        const extractionResults = await Promise.all(
          Object.values(CUSTOM_CLASS_EXTRACTORS).map((extractor) =>
            Promise.resolve(extractor(fileContent))
          )
        );

        const fileClasses = extractionResults.flat();

        // 結果をキャッシュ
        cache.set(cacheKey, fileContent, JSON.stringify(fileClasses));

        return fileClasses;
      } catch (error) {
        if (debug) {
          console.warn(
            `[smsshcss] Failed to process file "${file}": ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
        return [];
      }
    });

    const results = await Promise.all(filePromises);

    // 重複を除去して結果をマージ
    for (const fileClasses of results) {
      for (const cssClass of fileClasses) {
        if (!seenClasses.has(cssClass)) {
          seenClasses.add(cssClass);
          allCustomClasses.push(cssClass);
        }
      }
    }

    if (debug) {
      console.log(`[smsshcss] Extracted ${allCustomClasses.length} unique custom classes`);
    }
  } catch (error) {
    if (debug) {
      console.error(
        `[smsshcss] Error extracting custom classes: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return allCustomClasses;
}

export function smsshcss(options: SmsshCSSViteOptions = {}): Plugin {
  const {
    includeReset = true,
    includeBase = true,
    apply = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
    purge = { enabled: true },
    showPurgeReport = false,
    minify = true,
    cache = true,
    debug = false,
  } = options;

  let isProduction = false;
  const cssCache = new CSSCache(cache);
  let patternRegexes: RegExp[] = [];

  return {
    name: 'smsshcss',

    configResolved(config): void {
      isProduction = config.command === 'build';

      // パターンの正規表現を事前に作成
      patternRegexes = content.map(createPatternRegex);

      // minifyオプションがfalseの場合、ViteのCSS minifyを無効化
      if (!minify && isProduction) {
        if (config.build && config.build.cssMinify !== false) {
          config.build.cssMinify = false;
          if (debug) {
            console.log(
              '[smsshcss] CSS minify disabled to prevent arbitrary value syntax warnings'
            );
          }
        }
      }

      // プロダクションビルド時はキャッシュをリセット
      if (isProduction) {
        cssCache.clear();
      }

      if (debug) {
        console.log(
          `[smsshcss] Configured for ${isProduction ? 'production' : 'development'} mode`
        );
      }
    },

    configureServer(devServer: ViteDevServer): void {
      /**
       * ファイルが監視対象かどうかを判定
       */
      const shouldReload = (file: string): boolean => {
        const normalizedFile = file.replace(/\\/g, '/');
        return patternRegexes.some((regex) => regex.test(normalizedFile));
      };

      /**
       * CSSモジュールをリロード
       */
      const reloadCSSModules = async (file: string): Promise<void> => {
        if (debug) {
          console.log(`[smsshcss] File changed: ${file}, regenerating CSS...`);
        }

        // CSSモジュールを見つけて無効化
        const cssModules = Array.from(devServer.moduleGraph.idToModuleMap.values()).filter(
          (module) => module.id?.endsWith('.css')
        );

        // CSSモジュールをリロード
        for (const cssModule of cssModules) {
          devServer.moduleGraph.invalidateModule(cssModule);
          devServer.reloadModule(cssModule);
        }
      };

      // ファイルの変更を監視
      devServer.watcher.on('change', async (file) => {
        if (shouldReload(file)) {
          await reloadCSSModules(file);
        }
      });

      // 新しいファイルが追加された場合も監視
      devServer.watcher.on('add', async (file) => {
        if (shouldReload(file)) {
          await reloadCSSModules(file);
        }
      });

      // 定期的にキャッシュをクリーンアップ
      setInterval(
        () => {
          cssCache.cleanup();
        },
        10 * 60 * 1000
      ); // 10分ごと
    },

    async transform(code: string, id: string): Promise<{ code: string } | null> {
      if (!id.endsWith('.css')) return null;

      let css = code;

      // SmsshCSSの設定を構築
      const smsshConfig: SmsshCSSConfig = {
        content,
        includeResetCSS: includeReset,
        includeBaseCSS: includeBase,
        apply,
        purge: {
          enabled: isProduction ? purge.enabled : false, // 開発時はパージを無効化
          content,
          ...purge,
        },
      };

      try {
        let generatedCSS: string;
        const configHash = createHash('md5').update(JSON.stringify(smsshConfig)).digest('hex');
        const cacheKey = `css:${configHash}:${isProduction ? 'prod' : 'dev'}`;

        // キャッシュから取得を試行
        const cachedCSS = cssCache.get(cacheKey, JSON.stringify(smsshConfig));
        if (cachedCSS && !isProduction) {
          generatedCSS = cachedCSS;
          if (debug) {
            console.log('[smsshcss] Using cached CSS');
          }
        } else {
          if (isProduction && purge.enabled) {
            // プロダクションビルド時はパージ機能を使用
            generatedCSS = await smsshGenerateCSS(smsshConfig);

            if (showPurgeReport) {
              // パージレポートを表示
              const { generatePurgeReport } = await import('smsshcss');
              const report = await generatePurgeReport(smsshConfig);
              if (report) {
                console.log('\n🎯 SmsshCSS Purge Report (Vite Plugin)');
                console.log('=====================================');
                console.log(`📊 Total classes: ${report.totalClasses}`);
                console.log(`✅ Used classes: ${report.usedClasses}`);
                console.log(`🗑️  Purged classes: ${report.purgedClasses}`);
                console.log(`⏱️  Build time: ${report.buildTime}ms`);

                if (report.purgedClasses > 0) {
                  const reductionPercentage = (
                    (report.purgedClasses / report.totalClasses) *
                    100
                  ).toFixed(1);
                  console.log(`📉 Size reduction: ${reductionPercentage}%`);
                }
              }
            }
          } else {
            // 開発時は同期版を使用（パフォーマンス重視）
            generatedCSS = smsshGenerateCSSSync(smsshConfig);
          }

          // キャッシュに保存
          cssCache.set(cacheKey, JSON.stringify(smsshConfig), generatedCSS);
        }

        // 生成されたCSSを追加
        css = `${css}\n\n/* SmsshCSS Generated Styles */\n${generatedCSS}`;

        // カスタムクラスを動的に抽出して追加
        const customClasses = await extractAllCustomClassesFromFiles(content, cssCache, debug);

        if (customClasses.length > 0) {
          css = `${css}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
        }

        if (debug) {
          console.log(`[smsshcss] Generated CSS length: ${css.length} characters`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[smsshcss] Error generating CSS: ${errorMessage}`);

        // エラー時はフォールバック処理
        css = `${css}\n\n/* SmsshCSS Error: ${errorMessage} */`;

        if (debug) {
          console.error('[smsshcss] Full error details:', error);
        }
      }

      return {
        code: css,
      };
    },

    // ビルド終了時の後処理
    closeBundle(): void {
      if (debug) {
        console.log('[smsshcss] Build completed, clearing cache...');
      }
      cssCache.clear();
    },
  };
}

/**
 * CSS生成とパージを行うユーティリティ関数
 */
export async function generateCSSWithPurge(options: SmsshCSSViteOptions = {}): Promise<string> {
  const {
    includeReset = true,
    includeBase = true,
    apply = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
    purge = { enabled: true },
  } = options;

  const smsshConfig: SmsshCSSConfig = {
    content,
    includeResetCSS: includeReset,
    includeBaseCSS: includeBase,
    apply,
    purge: {
      enabled: purge.enabled,
      content,
      ...purge,
    },
  };

  return await smsshGenerateCSS(smsshConfig);
}

export default smsshcss;

// 互換性のためのエイリアス
export { smsshcss as smsshcssVite };
