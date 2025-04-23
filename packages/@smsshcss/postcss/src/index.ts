/**
 * smsshcss PostCSSプラグイン
 */
// Node.js標準モジュール
const fs = require('fs');
const path = require('path');
// 外部モジュール
const fastGlob = require('fast-glob');
const postcss = require('postcss');
// smsshcssからユーティリティをインポート
const { utilities } = require('smsshcss');

/**
 * PostCSSプラグインの設定オプション
 * @typedef {Object} SmsshcssPluginOptions
 * @property {string[]} [content] - スキャン対象のファイルパターン
 * @property {string[]} [safelist] - 常に含めるユーティリティクラス
 * @property {boolean} [debug] - デバッグモード
 * @property {string} [configFile] - 設定ファイルパス
 * @property {boolean} [legacyMode] - 従来の@importを使用するモード（後方互換性のため）
 */

// クラス検出用の正規表現
const CLASS_PATTERN = /class(?:Name)?=["|']([^"|']+)["|']/g;

/**
 * 設定ファイルを読み込む関数
 * @param {string} [configFilePath] - 設定ファイルのパス
 * @returns {Object} 設定オブジェクト
 */
function loadConfigFile(configFilePath) {
  const defaultConfigPaths = [
    'smsshcss.config.js',
    'smsshcss.config.cjs',
    'smsshcss.config.mjs',
  ];
  
  // 明示的に設定ファイルが指定されている場合
  if (configFilePath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), configFilePath);
      // ファイルが存在するか確認
      if (fs.existsSync(resolvedPath)) {
        // 設定ファイルを読み込む
        const config = require(resolvedPath);
        return config;
      }
      console.warn(`Specified config file not found: ${configFilePath}`);
    } catch (error) {
      console.error(`Error loading config file ${configFilePath}:`, error);
    }
  }
  
  // デフォルトの設定ファイルを探す
  for (const configPath of defaultConfigPaths) {
    try {
      const resolvedPath = path.resolve(process.cwd(), configPath);
      if (fs.existsSync(resolvedPath)) {
        const config = require(resolvedPath);
        return config;
      }
    } catch (error) {
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
function extractClassesFromFiles(contentPatterns, debug = false) {
  const usedClasses = new Set();
  
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
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error processing pattern ${pattern}:`, error);
    }
  }
  
  return usedClasses;
}

/**
 * 使用されているクラスからCSSを生成する関数
 * @param {Set<string>} classes - 使用されているクラス
 * @param {string[]} [safelist=[]] - 常に含めるクラス
 * @returns {string} 生成されたCSS
 */
function generateCSSFromClasses(classes, safelist = []) {
  let css = '';
  
  // safelistに指定されたクラスを追加
  safelist.forEach(className => {
    classes.add(className.trim());
  });
  
  // 使用されているクラスのCSSを生成
  classes.forEach(className => {
    // 対応するユーティリティを探す
    for (const category in utilities) {
      if (Object.prototype.hasOwnProperty.call(utilities, category) && 
          Object.prototype.hasOwnProperty.call(utilities[category], className)) {
        const style = utilities[category][className];
        if (typeof style === 'string') {
          const [property, value] = style.split(':').map(s => s.trim());
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
const smsshcssPlugin = (opts = {}) => {
  // 設定ファイルを読み込む
  const configFileOptions = loadConfigFile(opts.configFile);
  
  // PostCSSの設定と設定ファイルのオプションをマージする
  // 設定ファイルよりもPostCSS設定の方が優先される
  const options = {
    content: opts.content || configFileOptions.content || [],
    safelist: opts.safelist || configFileOptions.safelist || [],
    debug: opts.debug !== undefined ? opts.debug : configFileOptions.debug || false,
    legacyMode: opts.legacyMode !== undefined ? opts.legacyMode : configFileOptions.legacyMode || false
  };
  
  return {
    postcssPlugin: '@smsshcss/postcss',
    
    Once(root) {
      // contentの設定が存在するか確認
      if (options.content.length === 0) {
        console.warn('@smsshcss/postcss: No content files specified. Please provide the content option in postcss.config.js or smsshcss.config.js.');
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
              const generatedCSS = generateCSSFromClasses(usedClasses, options.safelist);
              
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
            console.log('@smsshcss/postcss: No @import "smsshcss" found. Legacy mode requires this import.');
          }
        } else {
          // 新しいモード: @importなしで自動的にCSSを生成
          // 使用されているクラスを抽出
          const usedClasses = extractClassesFromFiles(options.content, options.debug);
          
          // 抽出されたクラスからCSSを生成
          const generatedCSS = generateCSSFromClasses(usedClasses, options.safelist);
          
          // 生成したCSSがある場合、CSS末尾に追加
          if (generatedCSS) {
            const parsedCSS = postcss.parse(generatedCSS);
            root.append(parsedCSS);
            
            if (options.debug) {
              console.log('@smsshcss/postcss: Generated CSS and appended to the end of the file.');
            }
          }
        }
      } catch (error) {
        console.error('Error in @smsshcss/postcss plugin:', error);
      }
    }
  };
};

// PostCSSプラグインとして認識されるためのフラグ
smsshcssPlugin.postcss = true;

// コモンJS形式でモジュールをエクスポート
module.exports = smsshcssPlugin; 