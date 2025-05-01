import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import { generateCSS, baseStylesToCss } from 'smsshcss';

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
 * CJSとESMどちらの形式でも読み込めるように改良
 */
async function loadConfigFile(configPath: string): Promise<Record<string, unknown>> {
  try {
    const absolutePath = path.resolve(process.cwd(), configPath);

    // ファイルが存在するか確認
    if (fs.existsSync(absolutePath)) {
      try {
        // ESM方式で読み込みを試みる
        const module = await import(absolutePath);
        return module.default || module;
      } catch (esmError) {
        // ESM読み込みに失敗した場合、CJS方式を試す
        try {
          // Node.jsのrequire関数を使用してCJSモジュールを読み込む
          // evalを使用して文字列をJavaScriptコードとして実行
          const requireFn = new Function('require', 'path', `return require(path);`);

          const cjsModule = requireFn(require, absolutePath);
          return cjsModule;
        } catch (cjsError) {
          throw new Error(
            `Failed to load config file: ${configPath}\n` +
              `ESM error: ${esmError}\n` +
              `CJS error: ${cjsError}`
          );
        }
      }
    }
  } catch (error) {
    console.error(
      `Error loading smsshcss config file: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return {};
}

/**
 * リセットCSSの内容を読み込みます
 */
async function loadResetCSS(): Promise<string> {
  try {
    // 複数の可能なパスを試行
    const possiblePaths = [
      // パッケージのインストール先から相対パス
      path.resolve(process.cwd(), 'node_modules/smsshcss/src/reset.css'),

      // ローカル開発用のパス
      path.resolve(process.cwd(), '../../../smsshcss/src/reset.css'),
      path.resolve(process.cwd(), '../../smsshcss/src/reset.css'),

      // プロジェクトルートからの直接パス
      path.resolve(process.cwd(), 'packages/smsshcss/src/reset.css'),

      // インラインのリセットCSSを代わりに使用
      null,
    ];

    // 存在するパスを探す
    for (const filePath of possiblePaths) {
      if (filePath && fs.existsSync(filePath)) {
        // デバッグ情報をより詳細なレベル設定がある場合のみ表示
        if (process.env.DEBUG === 'verbose') {
          console.log(`[@smsshcss/vite] Found reset.css at: ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf-8');
      }
    }

    // どのパスも見つからない場合は、警告を表示せずに組み込みバージョンを使用
    // ビルトインバージョンは標準の動作なので、警告は不要

    // 組み込みのリセットCSS定義
    return `
/* Reset CSS */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

body {
  line-height: 1;
}

ol, ul {
  list-style: none;
}

blockquote, q {
  quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

:focus {
  outline: 0;
}

button, input, select, textarea {
  margin: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
}

button, [type="button"], [type="reset"], [type="submit"] {
  -webkit-appearance: button;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  text-decoration: none;
  color: inherit;
}
`;
  } catch (error) {
    // 実際のエラーは引き続き報告
    console.error('[@smsshcss/vite] Failed to load reset CSS:', error);
    // シンプルなフォールバックのリセットCSSを返す
    return `
      /* Error Fallback Reset CSS */
      *, *::before, *::after { box-sizing: border-box; }
      body, h1, h2, h3, h4, p, ul, ol { margin: 0; padding: 0; }
      body { line-height: 1.5; }
    `;
  }
}

/**
 * Process CSS content and replace @smsshcss directives
 * This is similar to how Tailwind processes its directives
 */
async function processSmsshcssDirectives(css: string, options: SMSSHCSSOptions): Promise<string> {
  // Generate base and utility CSS separately
  const resetCSS = options.includeResetCSS !== false ? await loadResetCSS() : '';

  // ベーススタイルにテーマオプションを適用
  const baseCSS =
    options.includeBaseCSS !== false ? baseStylesToCss({ theme: options.theme || {} }) : '';

  const utilitiesCSS = await generateUtilitiesCSS(options);

  // Replace directives with generated CSS
  let result = css;

  // For base directive, include both reset and base styles if enabled
  let baseStyles = '';
  if (options.includeResetCSS !== false) baseStyles += resetCSS;
  if (options.includeBaseCSS !== false) baseStyles += baseCSS;

  result = result.replace(/@smsshcss\s+base\s*;/g, baseStyles);
  result = result.replace(/@smsshcss\s+utilities\s*;/g, utilitiesCSS);

  // Also handle combined directive (@smsshcss)
  result = result.replace(/@smsshcss\s*;/g, `${baseStyles}\n${utilitiesCSS}`);

  return result;
}

/**
 * Generate utility CSS styles
 */
async function generateUtilitiesCSS(options: SMSSHCSSOptions): Promise<string> {
  try {
    // Only generate utility classes without base or reset
    const utilitiesOnlyOptions = {
      ...options,
      includeBaseCSS: false,
      includeResetCSS: false,
    };
    const css = await generateCSS(utilitiesOnlyOptions);
    return css;
  } catch (error) {
    console.error('Error generating utilities CSS:', error);
    return '/* Error generating utilities CSS */';
  }
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
  let isBuild = false;

  return {
    name: '@smsshcss/vite',

    configResolved(config): void {
      // Determine if we're in build mode
      isBuild = config.command === 'build';

      if (mergedOptions.debug) {
        console.log(`[@smsshcss/vite] Running in ${isBuild ? 'build' : 'development'} mode`);
      }

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
          console.log('[@smsshcss/vite] Config loaded:', mergedOptions);
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
            console.log('[@smsshcss/vite] Config reloaded:', mergedOptions);
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
            console.log(
              `[@smsshcss/vite] File changed: ${relativePath}, CSS will be regenerated on next request`
            );
          }
        }
      });
    },

    // Transform CSS files to process @smsshcss directives
    async transform(code: string, id: string): Promise<{ code: string; map: null } | null> {
      // Only process CSS files
      if (!id.match(/\.(css|postcss)$/)) {
        return null;
      }

      // Skip if the file doesn't contain @smsshcss directives
      if (!code.includes('@smsshcss')) {
        return null;
      }

      if (mergedOptions.debug) {
        console.log(`[@smsshcss/vite] Processing ${id} with @smsshcss directives`);
      }

      try {
        const result = await processSmsshcssDirectives(code, mergedOptions);

        if (mergedOptions.debug) {
          console.log(`[@smsshcss/vite] Processed CSS size: ${result.length} bytes`);
        }

        return {
          code: result,
          map: null,
        };
      } catch (error) {
        console.error(`[@smsshcss/vite] Error processing ${id}:`, error);
        return null;
      }
    },

    // For production builds, add to CSS post-processing steps
    async buildStart(): Promise<void> {
      if (mergedOptions.debug) {
        console.log(`[@smsshcss/vite] Build started`);
      }

      // Only needed for non-CSS imports of smsshcss
      try {
        const css = await generateCSS(mergedOptions);
        cache = css;

        if (mergedOptions.debug) {
          console.log(`[@smsshcss/vite] Generated standalone CSS (${css.length} bytes)`);
        }
      } catch (error) {
        this.error(
          `Failed to generate SMSSHCSS: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },

    // Support direct import of smsshcss.css
    resolveId(id: string): string | null {
      const outputFile = mergedOptions.outputFile || 'smsshcss.css';
      if (id === `/${outputFile}` || id === outputFile) {
        return `\0${outputFile}`;
      }
      return null;
    },

    // Provide generated CSS for direct imports
    load(id: string): string | null {
      const outputFile = mergedOptions.outputFile || 'smsshcss.css';
      if (id === `\0${outputFile}`) {
        return cache;
      }
      return null;
    },
  };
}

// Export types
export type { SMSSHCSSOptions, ThemeOptions };
