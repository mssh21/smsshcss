import type { Plugin, ViteDevServer } from 'vite';
import {
  SmsshCSSConfig,
  generateCSS as smsshGenerateCSS,
  generateCSSSync as smsshGenerateCSSSync,
} from 'smsshcss';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface SmsshCSSViteOptions {
  /**
   * スキャンするファイルパターン
   * @default ['index.html', 'src/all-subdirs/all-files.{html,js,ts,jsx,tsx,vue,svelte,astro}']
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
   * テーマのカスタマイズ
   */
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
  };
  /**
   * 開発時にパージレポートを表示するかどうか
   * @default false
   */
  showPurgeReport?: boolean;
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
  // CSS値内の特殊文字をエスケープ（クラス名用）
  const escapeValue = (val: string): string => {
    // calc関数の場合は特別処理 - 既にスペースは除去済み
    if (val.includes('calc(')) {
      return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
    }
    // CSS変数（var(--name)）の場合は特別処理
    if (val.includes('var(--')) {
      return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
    }
    // 通常の値の場合は-も含めてエスケープ
    return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
  };

  // 元の値を復元（CSS値用）- calc関数の場合はスペースを復元
  const originalValue = value.includes('calc(')
    ? value.replace(/calc\(([^)]+)\)/, (match, inner) => {
        // calc関数内の演算子の前後にスペースを追加
        return `calc(${inner
          .replace(/([+\-*/])/g, ' $1 ')
          .replace(/\s+/g, ' ')
          .trim()})`;
      })
    : value;

  // gap プロパティの処理
  if (prefix === 'gap') {
    return `.gap-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`;
  }

  // gap-x (column-gap) プロパティの処理
  if (prefix === 'gap-x') {
    return `.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`;
  }

  // gap-y (row-gap) プロパティの処理
  if (prefix === 'gap-y') {
    return `.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`;
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
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`;
    case 'y':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`;
    case '':
      // 全方向
      break;
    default:
      return null;
  }

  return `.${prefix}-\\[${escapeValue(value)}\\] { ${cssProperty}: ${originalValue}; }`;
}

export function smsshcss(options: SmsshCSSViteOptions = {}): Plugin {
  const {
    includeReset = true,
    includeBase = true,
    theme = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
    purge = { enabled: true },
    showPurgeReport = false,
  } = options;

  let isProduction = false;

  return {
    name: 'smsshcss',

    configResolved(config): void {
      isProduction = config.command === 'build';
    },

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

    async transform(code: string, id: string): Promise<{ code: string } | null> {
      if (!id.endsWith('.css')) return null;

      let css = code;

      // SmsshCSSの設定を構築
      const smsshConfig: SmsshCSSConfig = {
        content,
        includeResetCSS: includeReset,
        includeBaseCSS: includeBase,
        theme,
        purge: {
          enabled: isProduction ? purge.enabled : false, // 開発時はパージを無効化
          content,
          ...purge,
        },
      };

      try {
        let generatedCSS: string;

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

        // 生成されたCSSを追加
        css = `${css}\n\n/* SmsshCSS Generated Styles */\n${generatedCSS}`;

        // カスタムクラスを動的に抽出して追加
        const customClasses = await extractCustomClassesFromFiles(content);
        if (customClasses.length > 0) {
          css = `${css}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
        }
      } catch (error) {
        console.error('[smsshcss] Error generating CSS:', error);
        // エラー時はフォールバック処理
        css = `${css}\n\n/* SmsshCSS Error: ${error} */`;
      }

      return {
        code: css,
      };
    },
  };
}

// ファイルからカスタムクラスを非同期で抽出
async function extractCustomClassesFromFiles(content: string[]): Promise<string[]> {
  const allCustomClasses: string[] = [];
  const seenClasses = new Set<string>();

  try {
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
  } catch (error) {
    console.warn('[smsshcss] Failed to scan files for custom classes:', error);
  }

  return allCustomClasses;
}

export async function generateCSSWithPurge(options: SmsshCSSViteOptions = {}): Promise<string> {
  const {
    includeReset = true,
    includeBase = true,
    theme = {},
    content = ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
    purge = { enabled: true },
  } = options;

  const smsshConfig: SmsshCSSConfig = {
    content,
    includeResetCSS: includeReset,
    includeBaseCSS: includeBase,
    theme,
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
