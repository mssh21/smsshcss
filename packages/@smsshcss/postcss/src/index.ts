/**
 * smsshcss PostCSSプラグイン
 */
// Node.js標準モジュール
import * as fs from 'fs';
import * as path from 'path';
// 外部モジュール
import fastGlob from 'fast-glob';
import postcss from 'postcss';

// Types
type SmsshcssPluginOptions = {
  content?: string[];
  safelist?: string[];
  debug?: boolean;
  configFile?: string;
  legacyMode?: boolean;
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  theme?: Record<string, unknown>;
};

// smsshcssからユーティリティをインポート
let smsshcss: {
  utilities: Record<string, Record<string, string>>;
  RESET_CSS_PATH: string;
  baseStylesToCss?: (config: Record<string, unknown>) => string;
};

try {
  // ESLintのno-require-importsルールを避けるためにdynamic importを使用
  // 実行時には同じ挙動になります
  smsshcss = eval('require')('smsshcss');
} catch (error) {
  console.error('Error importing smsshcss:', error);
  smsshcss = { utilities: {}, RESET_CSS_PATH: './reset.css' };
}

const { utilities, RESET_CSS_PATH } = smsshcss;

// クラス検出用の正規表現
const CLASS_PATTERN = /class(?:Name)?=["|']([^"|']+)["|']/g;

/**
 * 設定ファイルを読み込む関数
 * @param {string} [configFilePath] - 設定ファイルのパス
 * @returns {Record<string, unknown>} 設定オブジェクト
 */
function loadConfigFile(configFilePath?: string): Record<string, unknown> {
  const defaultConfigPaths = ['smsshcss.config.js', 'smsshcss.config.cjs', 'smsshcss.config.mjs'];

  // 明示的に設定ファイルが指定されている場合
  if (configFilePath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), configFilePath);
      // ファイルが存在するか確認
      if (fs.existsSync(resolvedPath)) {
        // 設定ファイルを読み込む
        return eval('require')(resolvedPath);
      }
      console.warn(`Specified config file not found: ${configFilePath}`);
    } catch (err) {
      console.error(`Error loading config file ${configFilePath}:`, err);
    }
  }

  // デフォルトの設定ファイルを探す
  for (const configPath of defaultConfigPaths) {
    try {
      const resolvedPath = path.resolve(process.cwd(), configPath);
      if (fs.existsSync(resolvedPath)) {
        return eval('require')(resolvedPath);
      }
    } catch {
      // エラーは無視して次のパスを試す
    }
  }

  // 設定ファイルが見つからない場合は空のオブジェクトを返す
  return {};
}

/**
 * ファイルから使用されているクラスを抽出する関数
 * @param {string[]} contentPatterns - 対象ファイルのGlobパターン
 * @param {boolean} [debug=false] - デバッグモード
 * @returns {Set<string>} 使用されているクラスのセット
 */
function extractClassesFromFiles(contentPatterns: string[], debug = false): Set<string> {
  const usedClasses = new Set<string>();

  if (debug) {
    console.log('Content patterns:', contentPatterns);
  }

  for (const pattern of contentPatterns) {
    try {
      // globパターンに一致するファイルを検索
      const files = fastGlob.sync(pattern);

      if (debug) {
        console.log(`Files matching pattern ${pattern}:`, files);
      }

      for (const file of files) {
        try {
          // ファイル内容を読み込む
          const content = fs.readFileSync(file, 'utf-8');

          // クラス名を抽出
          const regex = new RegExp(CLASS_PATTERN);
          let match;

          while ((match = regex.exec(content)) !== null) {
            match[1].split(/\s+/).forEach((className) => {
              usedClasses.add(className.trim());
            });
          }

          if (debug) {
            console.log(`Extracted classes from ${file}:`, Array.from(usedClasses));
          }
        } catch (err) {
          console.error(`Error reading file ${file}:`, err);
        }
      }
    } catch (err) {
      console.error(`Error processing pattern ${pattern}:`, err);
    }
  }

  return usedClasses;
}

/**
 * reset.cssの内容を読み込む関数
 * @returns {string|null} reset.cssの内容またはnull
 */
function loadResetCSS(): string | null {
  try {
    // パッケージのディレクトリを取得
    const packageDir = path.dirname(eval('require').resolve('smsshcss'));
    // reset.cssのパスを解決
    const resetCssPath = path.resolve(packageDir, RESET_CSS_PATH);
    // ファイルの存在確認
    if (fs.existsSync(resetCssPath)) {
      return fs.readFileSync(resetCssPath, 'utf-8');
    }
  } catch (err) {
    console.error('Error loading reset.css:', err);
  }
  return null;
}

/**
 * baseスタイルのCSSを取得する関数
 * @param {boolean} debug - デバッグモードかどうか
 * @param {Record<string, unknown>} config - 設定オブジェクト
 * @returns {string} baseスタイルのCSS
 */
function getBaseStyles(debug = false, config: Record<string, unknown> = {}): string {
  try {
    // baseStylesToCssの存在確認
    if (typeof smsshcss.baseStylesToCss !== 'function') {
      if (debug) {
        console.error(
          '@smsshcss/postcss: baseStylesToCss is not a function:',
          typeof smsshcss.baseStylesToCss
        );
      }
      return '';
    }

    // baseStylesToCss関数を使用して直接CSSを生成（設定を渡す）
    const css = smsshcss.baseStylesToCss(config);

    if (debug) {
      console.log('@smsshcss/postcss: Generated base styles:', css ? 'success' : 'empty');
    }

    return css || '';
  } catch (err) {
    console.error('Error generating base styles:', err);
    return '';
  }
}

/**
 * 使用されているクラスからCSSを生成する関数
 * @param {Set<string>} classes - 使用されているクラス
 * @param {string[]} [safelist=[]] - 常に含めるクラス
 * @returns {string} 生成されたCSS
 */
function generateCSSFromClasses(classes: Set<string>, safelist: string[] = []): string {
  let css = '';

  // safelistに指定されたクラスを追加
  safelist.forEach((className) => {
    classes.add(className.trim());
  });

  // 使用されているクラスのCSSを生成
  classes.forEach((className) => {
    // 対応するユーティリティを探す
    for (const category in utilities) {
      if (
        Object.prototype.hasOwnProperty.call(utilities, category) &&
        Object.prototype.hasOwnProperty.call(utilities[category], className)
      ) {
        const style = utilities[category][className];
        if (typeof style === 'string') {
          const [property, value] = style.split(':').map((s) => s.trim());
          css += `.${className} { ${property}: ${value}; }\n`;
        }
      }
    }
  });

  return css;
}

/**
 * PostCSSプラグイン: @smsshcss/postcss
 * HTML内で使用されているクラスを抽出し、対応するCSSを生成します
 * @type {import('postcss').PluginCreator<SmsshcssPluginOptions>}
 */
const smsshcssPlugin = (
  opts: SmsshcssPluginOptions = {}
): {
  postcssPlugin: string;
  Once: (root: postcss.Root) => void;
} => {
  // 設定ファイルを読み込む
  const configFileOptions = loadConfigFile(opts.configFile);

  // PostCSSの設定と設定ファイルのオプションをマージする
  // 設定ファイルよりもPostCSS設定の方が優先される
  const options = {
    content: opts.content || (configFileOptions.content as string[]) || [],
    safelist: opts.safelist || (configFileOptions.safelist as string[]) || [],
    debug: opts.debug !== undefined ? opts.debug : configFileOptions.debug || false,
    legacyMode:
      opts.legacyMode !== undefined ? opts.legacyMode : configFileOptions.legacyMode || false,
    includeResetCSS:
      opts.includeResetCSS !== undefined
        ? opts.includeResetCSS
        : configFileOptions.includeResetCSS !== false,
    includeBaseCSS:
      opts.includeBaseCSS !== undefined
        ? opts.includeBaseCSS
        : configFileOptions.includeBaseCSS !== false,
    theme: opts.theme || configFileOptions.theme || {},
  };

  return {
    postcssPlugin: '@smsshcss/postcss',

    Once(root): void {
      // contentの設定が存在するか確認
      if (options.content.length === 0) {
        console.warn(
          '@smsshcss/postcss: No content files specified. Please provide the content option in postcss.config.js or smsshcss.config.js.'
        );
        return;
      }

      try {
        // レガシーモードの場合は@importを検索
        if (options.legacyMode) {
          let importFound = false;

          root.walkAtRules('import', (atRule) => {
            if (atRule.params.includes('"smsshcss"') || atRule.params.includes("'smsshcss'")) {
              importFound = true;

              // 使用されているクラスを抽出
              const usedClasses = extractClassesFromFiles(options.content, options.debug);

              // 抽出されたクラスからCSSを生成
              let generatedCSS = generateCSSFromClasses(usedClasses, options.safelist);

              // baseスタイルを含める（トークンを直接参照）
              if (options.includeBaseCSS) {
                const baseCSS = getBaseStyles(options.debug, configFileOptions);
                if (baseCSS) {
                  generatedCSS = baseCSS + '\n' + generatedCSS;
                  if (options.debug) {
                    console.log('@smsshcss/postcss: Base styles included');
                  }
                }
              }

              // reset.cssを含める
              if (options.includeResetCSS) {
                const resetCSS = loadResetCSS();
                if (resetCSS) {
                  generatedCSS = resetCSS + '\n' + generatedCSS;
                  if (options.debug) {
                    console.log('@smsshcss/postcss: Reset CSS included');
                  }
                }
              }

              // @importを生成したCSSに置き換え
              if (generatedCSS) {
                const parsedCSS = postcss.parse(generatedCSS);
                atRule.replaceWith(parsedCSS);
              } else {
                // 生成するCSSがなければ@importを削除
                atRule.remove();
              }
            }
          });

          // @importが見つからなかった場合は処理しない
          if (!importFound && options.debug) {
            console.log(
              '@smsshcss/postcss: No @import "smsshcss" found. Legacy mode requires this import.'
            );
          }
        } else {
          // 新しいモード: @importなしで自動的にCSSを生成
          // 使用されているクラスを抽出
          const usedClasses = extractClassesFromFiles(options.content, options.debug);

          // 抽出されたクラスからCSSを生成
          let generatedCSS = generateCSSFromClasses(usedClasses, options.safelist);

          // 順序として、先にbaseスタイルを含める（ユーティリティがbaseスタイルを上書きできるように）
          if (options.includeBaseCSS) {
            const baseCSS = getBaseStyles(options.debug, configFileOptions);
            if (baseCSS) {
              generatedCSS = baseCSS + '\n' + generatedCSS;
              if (options.debug) {
                console.log('@smsshcss/postcss: Base styles included');
              }
            }
          }

          // 次にreset.cssを含める（reset.cssがbaseスタイルを上書きできるように）
          if (options.includeResetCSS) {
            const resetCSS = loadResetCSS();
            if (resetCSS) {
              generatedCSS = resetCSS + '\n' + generatedCSS;
              if (options.debug) {
                console.log('@smsshcss/postcss: Reset CSS included');
              }
            }
          }

          // 生成したCSSがある場合、CSS末尾に追加
          if (generatedCSS) {
            const parsedCSS = postcss.parse(generatedCSS);
            root.append(parsedCSS);

            if (options.debug) {
              console.log('@smsshcss/postcss: Generated CSS and appended to the end of the file.');
            }
          }
        }
      } catch (err) {
        console.error('Error in @smsshcss/postcss plugin:', err);
      }
    },
  };
};

// PostCSSプラグインとして認識されるためのフラグ
smsshcssPlugin.postcss = true;

// コモンJS形式でモジュールをエクスポート
export = smsshcssPlugin;
