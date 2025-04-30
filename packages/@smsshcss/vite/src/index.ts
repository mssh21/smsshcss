import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import { generateCSS } from 'smsshcss';

// テーマオプションのインターフェイス
export interface ThemeOptions {
  colors?: Record<string, string>;
  fontWeight?: Record<string, string>;
  fontSize?: Record<string, string>;
  lineHeight?: Record<string, string>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadow?: Record<string, string>;
  [key: string]: unknown;
}

export interface SMSSHCSSOptions {
  /**
   * File patterns to scan for class names
   * @default [./src/**.js]
   */
  content?: string[];

  /**
   * Classes to always include in the output CSS
   */
  safelist?: string[];

  /**
   * Whether to use the built-in reset.css
   * @default true
   */
  includeResetCSS?: boolean;

  /**
   * Whether to use the built-in base.css
   * @default true
   */
  includeBaseCSS?: boolean;

  /**
   * Legacy mode for compatibility
   * @default false
   */
  legacyMode?: boolean;

  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean;

  /**
   * Output CSS file name
   * @default 'smsshcss.css'
   */
  outputFile?: string;

  /**
   * Custom CSS to be included at the end of the generated CSS
   */
  customCSS?: string;

  /**
   * Path to config file (relative to project root)
   * @default 'smsshcss.config.js'
   */
  configFile?: string;

  /**
   * テーマ設定 - トークンのカスタマイズ
   */
  theme?: ThemeOptions;
}

/**
 * Load config from smsshcss.config.js file
 */
async function loadConfigFile(configPath: string): Promise<Record<string, unknown>> {
  try {
    const absolutePath = path.resolve(process.cwd(), configPath);
    if (fs.existsSync(absolutePath)) {
      const module = await import(absolutePath);
      return module.default || module;
    }
  } catch (error) {
    console.error(
      `Error loading smsshcss config file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  return {};
}

export default function smsshcss(options: SMSSHCSSOptions = {}): Plugin {
  // Default options
  const defaultOptions: SMSSHCSSOptions = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
    outputFile: 'smsshcss.css',
    safelist: [],
    includeResetCSS: true,
    includeBaseCSS: true,
    legacyMode: false,
    debug: false,
    customCSS: '',
    configFile: 'smsshcss.config.js',
    theme: {},
  };

  // Merge options with defaults
  let mergedOptions = { ...defaultOptions, ...options };
  let configFileContent: SMSSHCSSOptions = {};
  let cache = '';

  return {
    name: 'smsshcss-vite',

    configResolved(): void {
      // Load config file if it exists
      if (mergedOptions.configFile) {
        const loadedConfig = loadConfigFile(mergedOptions.configFile || 'smsshcss.config.js');
        configFileContent = loadedConfig as unknown as SMSSHCSSOptions;

        // Final options with config file taking precedence
        mergedOptions = { ...mergedOptions, ...configFileContent };

        // Deep merge theme options if both exist
        if (options.theme && configFileContent.theme) {
          mergedOptions.theme = { ...options.theme, ...configFileContent.theme };
        }

        if (mergedOptions.debug) {
          console.log('[smsshcss] Config loaded:', mergedOptions);
        }
      }
    },

    configureServer(server): void {
      // Watch content files
      if (mergedOptions.content && mergedOptions.content.length > 0) {
        mergedOptions.content.forEach((pattern: string) => {
          // Convert glob patterns to directories for watching
          const baseDir = pattern.split('*')[0].replace(/\/+$/, '');
          if (baseDir && fs.existsSync(path.resolve(process.cwd(), baseDir))) {
            server.watcher.add(path.resolve(process.cwd(), baseDir));
          }
        });
      }

      // Also watch config file for changes
      if (mergedOptions.configFile) {
        const configPath = path.resolve(process.cwd(), mergedOptions.configFile);
        server.watcher.add(configPath);
      }

      server.watcher.on('change', async (changedPath: string) => {
        // Reload config if config file changes
        if (changedPath.endsWith(mergedOptions.configFile || 'smsshcss.config.js')) {
          const loadedConfig = loadConfigFile(mergedOptions.configFile || 'smsshcss.config.js');
          configFileContent = loadedConfig as unknown as SMSSHCSSOptions;
          mergedOptions = { ...defaultOptions, ...options, ...configFileContent };

          // Deep merge theme options if both exist
          if (options.theme && configFileContent.theme) {
            mergedOptions.theme = { ...options.theme, ...configFileContent.theme };
          }

          if (mergedOptions.debug) {
            console.log('[smsshcss] Config reloaded:', mergedOptions);
          }
          server.restart();
          return;
        }

        // Check if changed file matches content patterns
        const relativePath = path.relative(process.cwd(), changedPath);
        const contentPatterns = mergedOptions.content || [
          './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
        ];

        // Simple pattern matching (could be enhanced with micromatch or similar)
        const shouldRegenerate = contentPatterns.some((pattern: string) => {
          const regex = new RegExp(
            pattern.replace(/\./g, '\\.').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
          );
          return regex.test(relativePath);
        });

        if (shouldRegenerate) {
          if (mergedOptions.debug) {
            console.log(`[smsshcss] File changed: ${relativePath}, regenerating CSS...`);
          }
          server.restart();
        }
      });
    },

    async buildStart(): Promise<void> {
      try {
        const css = await generateCSS({
          content: mergedOptions.content,
          safelist: mergedOptions.safelist,
          includeResetCSS: mergedOptions.includeResetCSS,
          includeBaseCSS: mergedOptions.includeBaseCSS,
          legacyMode: mergedOptions.legacyMode,
          debug: mergedOptions.debug,
          customCSS: mergedOptions.customCSS,
          theme: mergedOptions.theme,
        });

        cache = css;

        if (mergedOptions.debug) {
          console.log(`[smsshcss] Generated CSS (${css.length} bytes)`);
        }

        // Write to virtual output file for dev mode
        this.emitFile({
          type: 'asset',
          fileName: mergedOptions.outputFile || 'smsshcss.css',
          source: css,
        });
      } catch (error) {
        this.error(
          `Failed to generate SMSSHCSS: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },

    resolveId(id: string): string | null {
      const outputFile = mergedOptions.outputFile || 'smsshcss.css';
      if (id === `/${outputFile}` || id === outputFile) {
        return `\0${outputFile}`;
      }
      return null;
    },

    load(id: string): string | null {
      const outputFile = mergedOptions.outputFile || 'smsshcss.css';
      if (id === `\0${outputFile}`) {
        return cache;
      }
      return null;
    },

    generateBundle(): void {
      // Write the CSS file for production build
      this.emitFile({
        type: 'asset',
        fileName: mergedOptions.outputFile || 'smsshcss.css',
        source: cache,
      });
    },
  };
}

// Export types
export type { SMSSHCSSOptions, ThemeOptions };
