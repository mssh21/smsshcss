import type { Plugin, ViteDevServer } from 'vite';
import {
  SmsshCSSConfig,
  generateCSS as smsshGenerateCSS,
  generatePurgeReport,
  extractCustomSpacingClasses,
  extractCustomWidthClasses,
  extractCustomHeightClasses,
  extractCustomGridClasses,
  extractCustomOrderClasses,
  extractCustomZIndexClasses,
  extractCustomColorClasses,
  extractCustomFontSizeClasses,
  extractCustomPositioningClasses,
  extractCustomFlexClasses,
  extractCustomDisplayClasses,
  extractCustomOverflowClasses,
} from 'smsshcss';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import micromatch from 'micromatch';
const { isMatch } = micromatch;
import { createHash } from 'crypto';

export interface SmsshCSSViteOptions {
  /**
   * File patterns to scan
   * @default ['index.html', 'src/(all-subdirs)/(all-files).{html,js,ts,jsx,tsx,vue,svelte,astro}']
   */
  content?: string[];
  /**
   * Whether to include reset CSS
   * @default true
   */
  includeResetCSS?: boolean;
  /**
   * Whether to include base CSS
   * @default true
   */
  includeBaseCSS?: boolean;
  /**
   * Purge settings
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
   * Apply settings (define frequently used utility class combinations)
   */
  apply?: Record<string, string>;
  /**
   * Whether to show purge report during development
   * @default false
   */
  showPurgeReport?: boolean;
  /**
   * Whether to enable CSS minify
   * @default true
   */
  minify?: boolean;
  /**
   * Whether to enable cache
   * @default true
   */
  cache?: boolean;
  /**
   * Whether to enable debug log
   * @default false
   */
  debug?: boolean;
}

/**
 * Check if file pattern matches
 * Use micromatch to accurately process glob patterns
 */
function matchesPattern(filePath: string, patterns: string[]): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return patterns.some((pattern) => isMatch(normalizedPath, pattern));
}

/**
 * Cache class
 */
class CSSCache {
  private cache = new Map<string, { content: string; hash: string; timestamp: number }>();
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  /**
   * Generate hash from file content
   */
  private generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }

  /**
   * Get from cache
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
   * Save to cache
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
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove old cache entries
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
 * Integrated function to extract custom classes from files
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
    console.log('[smsshcss] Content patterns:', content);
  }

  try {
    // Process all file patterns together
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
            if (debug) {
              console.log(`[smsshcss] Pattern "${pattern}" found ${files.length} files:`, files);
            }
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

    // Execute all glob patterns in parallel
    await Promise.all(extractionPromises);

    if (debug) {
      console.log(`[smsshcss] Total files found: ${allFiles.size}`, Array.from(allFiles));
    }

    // Process files in parallel
    const filePromises = Array.from(allFiles).map(async (file) => {
      try {
        const filePath = path.resolve(process.cwd(), file);
        const cacheKey = `file:${filePath}`;

        // Get from cache or read
        let fileContent: string;
        if (fileCache.has(filePath)) {
          fileContent = fileCache.get(filePath)!;
        } else {
          fileContent = await fs.promises.readFile(filePath, 'utf-8');
          fileCache.set(filePath, fileContent);
        }

        // Check cached result
        const cachedResult = cache.get(cacheKey, fileContent);
        if (cachedResult) {
          return JSON.parse(cachedResult) as string[];
        }

        // Extract various custom classes
        const extractionResults = [
          extractCustomSpacingClasses(fileContent),
          extractCustomWidthClasses(fileContent),
          extractCustomHeightClasses(fileContent),
          extractCustomGridClasses(fileContent),
          extractCustomOrderClasses(fileContent),
          extractCustomZIndexClasses(fileContent),
          extractCustomColorClasses(fileContent),
          extractCustomFontSizeClasses(fileContent),
          extractCustomPositioningClasses(fileContent),
          extractCustomFlexClasses(fileContent),
          extractCustomDisplayClasses(fileContent),
          extractCustomOverflowClasses(fileContent),
        ];

        const fileClasses = extractionResults.flat();

        if (debug && fileClasses.length > 0) {
          console.log(`[smsshcss] File "${file}" extracted ${fileClasses.length} custom classes:`);
          console.log(fileClasses.slice(0, 3).map((cls) => cls.substring(0, 100)));
        }

        // Cache the result
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

    // Remove duplicates and merge results
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
      if (allCustomClasses.length > 0) {
        console.log('[smsshcss] Sample custom classes:');
        allCustomClasses.slice(0, 5).forEach((cls) => {
          console.log(`  - ${cls.substring(0, 100)}${cls.length > 100 ? '...' : ''}`);
        });
      }
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
    includeResetCSS = true,
    includeBaseCSS = true,
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

  return {
    name: 'smsshcss',

    configResolved(config): void {
      isProduction = config.command === 'build';

      // Disable Vite's CSS minify if minify option is false
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

      // Reset cache during production build
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
       * Check if file is being watched
       */
      const shouldReload = (file: string): boolean => {
        return matchesPattern(file, content);
      };

      /**
       * Reload CSS modules
       */
      const reloadCSSModules = async (file: string): Promise<void> => {
        if (debug) {
          console.log(`[smsshcss] File changed: ${file}, regenerating CSS...`);
        }

        // Find and invalidate CSS modules
        const cssModules = Array.from(devServer.moduleGraph.idToModuleMap.values()).filter(
          (module) => module.id?.endsWith('.css')
        );

        // Reload CSS modules
        for (const cssModule of cssModules) {
          devServer.moduleGraph.invalidateModule(cssModule);
          devServer.reloadModule(cssModule);
        }
      };

      // Watch for file changes
      devServer.watcher.on('change', async (file) => {
        if (shouldReload(file)) {
          await reloadCSSModules(file);
        }
      });

      // Also watch when new files are added
      devServer.watcher.on('add', async (file) => {
        if (shouldReload(file)) {
          await reloadCSSModules(file);
        }
      });

      // Periodically clean up cache
      const cleanupInterval = setInterval(
        () => {
          cssCache.cleanup();
        },
        10 * 60 * 1000
      ); // Every 10 minutes

      // Clear cleanup interval when server ends
      devServer.watcher.on('close', () => {
        clearInterval(cleanupInterval);
        if (debug) {
          console.log('[smsshcss] Dev server closed, cleanup interval cleared');
        }
      });
    },

    async transform(code: string, id: string): Promise<{ code: string } | null> {
      if (!id.endsWith('.css')) return null;

      let css = code;

      // Build SmsshCSS configuration
      const smsshConfig: SmsshCSSConfig = {
        content,
        includeResetCSS,
        includeBaseCSS,
        apply,
        purge: {
          enabled: isProduction ? purge.enabled : false, // Disable purge during development
          content,
          ...purge,
        },
      };

      try {
        let generatedCSS: string;
        const configHash = createHash('md5').update(JSON.stringify(smsshConfig)).digest('hex');
        const cacheKey = `css:${configHash}:${isProduction ? 'prod' : 'dev'}`;

        // Try to get from cache
        const cachedCSS = cssCache.get(cacheKey, JSON.stringify(smsshConfig));
        if (cachedCSS && !isProduction) {
          generatedCSS = cachedCSS;
        } else {
          if (isProduction && purge.enabled) {
            generatedCSS = await smsshGenerateCSS(smsshConfig);
            if (showPurgeReport) {
              const report = await generatePurgeReport(smsshConfig);
              if (report) {
                // Purge report output can be kept, but can be removed if not needed
              }
            }
          } else {
            generatedCSS = await smsshGenerateCSS(smsshConfig);
          }
          cssCache.set(cacheKey, JSON.stringify(smsshConfig), generatedCSS);
        }

        // Dynamically extract and add custom classes
        const customClasses = await extractAllCustomClassesFromFiles(content, cssCache, debug);
        if (customClasses.length > 0) {
          if (generatedCSS.includes('/* Custom Value Classes */')) {
            generatedCSS = generatedCSS.replace(
              '/* Custom Value Classes */',
              `/* Custom Value Classes */\n${customClasses.join('\n')}`
            );
          } else {
            generatedCSS = `${generatedCSS}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
          }
        }

        css = `${css}\n\n/* SmsshCSS Generated Styles */\n${generatedCSS}`;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        css = `${css}\n\n/* SmsshCSS Error: ${errorMessage} */`;
      }

      return {
        code: css,
      };
    },

    // Post-processing when build completes
    closeBundle(): void {
      if (debug) {
        console.log('[smsshcss] Build completed, clearing cache...');
      }
      cssCache.clear();
    },
  };
}

/**
 * Utility function for CSS generation and purging
 */
export async function generateCSSWithPurge(options: SmsshCSSViteOptions = {}): Promise<string> {
  const {
    includeResetCSS = true,
    includeBaseCSS = true,
    apply = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
    purge = { enabled: true },
  } = options;

  const smsshConfig: SmsshCSSConfig = {
    content,
    includeResetCSS,
    includeBaseCSS,
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

// Alias for compatibility
export { smsshcss as smsshcssVite };
