import type { Plugin, ViteDevServer } from 'vite';
import {
  applyResetCss,
  applyBaseCss,
  generateAllSpacingClasses,
  generateDisplayClasses,
} from 'smsshcss/utils';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface SmsshCSSViteOptions {
  /**
   * スキャンするファイルパターン
   * @default ['index.html', 'src/files.{html,js,ts,jsx,tsx,vue,svelte,astro}']
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
   * テーマのカスタマイズ
   */
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
  };
}

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;

// HTMLファイルからカスタム値クラスを抽出
function extractCustomClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomSpacingClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

// カスタムスペーシングクラスを生成
function generateCustomSpacingClass(prefix: string, value: string): string | null {
  // CSS値内の特殊文字をエスケープ
  const escapeValue = (val: string): string => {
    // CSS変数（var(--name)）の場合は特別処理
    if (val.includes('var(--')) {
      return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
    }
    // 通常の値の場合は-も含めてエスケープ
    return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
  };

  // gap プロパティの処理
  if (prefix === 'gap') {
    return `.gap-\\[${escapeValue(value)}\\] { gap: ${value}; }`;
  }

  // gap-x (column-gap) プロパティの処理
  if (prefix === 'gap-x') {
    return `.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${value}; }`;
  }

  // gap-y (row-gap) プロパティの処理
  if (prefix === 'gap-y') {
    return `.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${value}; }`;
  }

  const property = prefix.startsWith('m') ? 'margin' : 'padding';
  const direction = prefix.slice(1); // 'm' or 'p' を除いた部分

  let cssProperty = property;

  switch (direction) {
    case 't':
      cssProperty = `${property}-top`;
      break;
    case 'r':
      cssProperty = `${property}-right`;
      break;
    case 'b':
      cssProperty = `${property}-bottom`;
      break;
    case 'l':
      cssProperty = `${property}-left`;
      break;
    case 'x':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${value}; ${property}-right: ${value}; }`;
    case 'y':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${value}; ${property}-bottom: ${value}; }`;
    case '':
      // 全方向
      break;
    default:
      return null;
  }

  return `.${prefix}-\\[${escapeValue(value)}\\] { ${cssProperty}: ${value}; }`;
}

export function smsshcss(options: SmsshCSSViteOptions = {}): Plugin {
  const {
    includeReset = true,
    includeBase = true,
    theme = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
  } = options;

  return {
    name: 'smsshcss',

    configureServer(devServer: ViteDevServer): void {
      // ファイルの変更を監視
      devServer.watcher.on('change', async (file) => {
        // 監視対象のファイルが変更された場合
        const shouldReload = content.some((pattern) => {
          // シンプルなパターンマッチング（globパターンを正規表現に変換）
          const regex = new RegExp(
            pattern
              .replace(/\*\*/g, '.*')
              .replace(/\*/g, '[^/]*')
              .replace(/\{([^}]+)\}/g, '($1)')
              .replace(/,/g, '|')
          );
          return regex.test(file.replace(/\\/g, '/'));
        });

        if (shouldReload) {
          console.log(`[smsshcss] File changed: ${file}, regenerating CSS...`);

          // CSSモジュールを見つけて無効化
          const cssModules = Array.from(devServer.moduleGraph.idToModuleMap.values()).filter(
            (module) => module.id?.endsWith('.css')
          );

          // CSSモジュールをリロード
          for (const cssModule of cssModules) {
            devServer.moduleGraph.invalidateModule(cssModule);
            devServer.reloadModule(cssModule);
          }
        }
      });

      // 新しいファイルが追加された場合も監視
      devServer.watcher.on('add', async (file) => {
        const shouldReload = content.some((pattern) => {
          const regex = new RegExp(
            pattern
              .replace(/\*\*/g, '.*')
              .replace(/\*/g, '[^/]*')
              .replace(/\{([^}]+)\}/g, '($1)')
              .replace(/,/g, '|')
          );
          return regex.test(file.replace(/\\/g, '/'));
        });

        if (shouldReload) {
          console.log(`[smsshcss] New file added: ${file}, regenerating CSS...`);

          const cssModules = Array.from(devServer.moduleGraph.idToModuleMap.values()).filter(
            (module) => module.id?.endsWith('.css')
          );

          for (const cssModule of cssModules) {
            devServer.moduleGraph.invalidateModule(cssModule);
            devServer.reloadModule(cssModule);
          }
        }
      });
    },

    transform(code: string, id: string): { code: string; map: null } | null {
      if (!id.endsWith('.css')) return null;

      let css = code;

      // SmsshCSSのユーティリティクラスを生成
      const spacingClasses = generateAllSpacingClasses(theme.spacing);
      const displayClasses = generateDisplayClasses(theme.display);
      const utilityClasses = `${spacingClasses}\n${displayClasses}`;

      // リセットCSSを追加
      if (includeReset) {
        css = applyResetCss(css);
      }

      // ベースCSSを追加
      if (includeBase) {
        css = applyBaseCss(css);
      }

      // ユーティリティクラスを追加
      css = `${css}\n\n/* SmsshCSS Utility Classes */\n${utilityClasses}`;

      // 複数のファイルからカスタムクラスを動的に抽出
      let customClasses: string[] = [];
      try {
        // 同期版の実装（パフォーマンスのため）
        const allCustomClasses: string[] = [];
        const seenClasses = new Set<string>();

        for (const pattern of content) {
          try {
            const files = glob.sync(pattern, {
              cwd: process.cwd(),
              ignore: ['node_modules/**', 'dist/**', 'build/**'],
            });

            for (const file of files) {
              try {
                const filePath = path.resolve(process.cwd(), file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const fileCustomClasses = extractCustomClasses(fileContent);

                for (const cssClass of fileCustomClasses) {
                  if (!seenClasses.has(cssClass)) {
                    seenClasses.add(cssClass);
                    allCustomClasses.push(cssClass);
                  }
                }
              } catch (error) {
                // ファイル読み込みエラーは無視
              }
            }
          } catch (error) {
            // globエラーは無視
          }
        }

        customClasses = allCustomClasses;
      } catch (error) {
        console.warn('Failed to scan files for custom classes:', error);
      }

      // カスタムクラスを追加
      if (customClasses.length > 0) {
        css = `${css}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
      }

      return {
        code: css,
        map: null,
      };
    },
  };
}

export function generateCSS(options: SmsshCSSViteOptions = {}): string {
  const { includeReset = true, includeBase = true, theme = {} } = options;
  let css = '';

  // SmsshCSSのユーティリティクラスを生成
  const spacingClasses = generateAllSpacingClasses(theme.spacing);
  const displayClasses = generateDisplayClasses(theme.display);
  const utilityClasses = `${spacingClasses}\n${displayClasses}`;

  // リセットCSSを追加
  if (includeReset) {
    css = applyResetCss(css);
  }

  // ベースCSSを追加
  if (includeBase) {
    css = applyBaseCss(css);
  }

  // ユーティリティクラスを追加
  css = `${css}\n\n/* SmsshCSS Utility Classes */\n${utilityClasses}`;

  return css;
}

export default smsshcss;
