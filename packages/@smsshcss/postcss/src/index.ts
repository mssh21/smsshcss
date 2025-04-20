/**
 * smsshcss PostCSSプラグイン
 */
// @ts-ignore
import * as fs from 'fs';
// @ts-ignore
import * as path from 'path';
// @ts-ignore
import fastGlob from 'fast-glob';
// @ts-ignore
import { PluginCreator, Root, AtRule } from 'postcss';
// @ts-ignore
import { utilities } from 'smsshcss';

/**
 * PostCSSプラグインの設定オプション
 */
interface SmsshcssPluginOptions {
  /** スキャン対象のファイルパターン */
  content: string[];
  /** 常に含めるユーティリティクラス */
  safelist?: string[];
  /** デバッグモード */
  debug?: boolean;
}

// クラス検出用の正規表現
const CLASS_PATTERN = /class(?:Name)?=["|']([^"|']+)["|']/g;

/**
 * ファイルから使用されているクラスを抽出する関数
 */
function extractClassesFromFiles(contentPatterns: string[], debug: boolean = false): Set<string> {
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
            match[1].split(/\s+/).forEach((className: string) => {
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
 */
function generateCSSFromClasses(classes: Set<string>, safelist: string[] = []): string {
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
 */
const smsshcssPlugin: PluginCreator<SmsshcssPluginOptions> = (opts: any) => {
  const options = {
    content: opts?.content || [],
    safelist: opts?.safelist || [],
    debug: opts?.debug || false
  };
  
  return {
    postcssPlugin: '@smsshcss/postcss',
    
    Once(root: Root) {
      // @import "smsshcss"を検索
      root.walkAtRules('import', (atRule: AtRule) => {
        if (atRule.params.includes('"smsshcss"') || atRule.params.includes("'smsshcss'")) {
          try {
            if (options.content.length === 0) {
              console.warn('@smsshcss/postcss: No content files specified. Please provide the content option.');
              return;
            }
            
            // 使用されているクラスを抽出
            const usedClasses = extractClassesFromFiles(options.content, options.debug);
            
            // 抽出されたクラスからCSSを生成
            const generatedCSS = generateCSSFromClasses(usedClasses, options.safelist);
            
            // @importを生成したCSSに置き換え
            if (generatedCSS) {
              // @ts-ignore
              const parsedCSS = require('postcss').parse(generatedCSS);
              atRule.replaceWith(parsedCSS);
            } else {
              // 生成するCSSがなければ@importを削除
              atRule.remove();
            }
          } catch (error) {
            console.error('Error in @smsshcss/postcss plugin:', error);
            // エラーが発生した場合は@importを削除
            atRule.remove();
          }
        }
      });
    }
  };
};

// PostCSSプラグインとして認識されるためのフラグ
smsshcssPlugin.postcss = true;

// ESモジュールの場合のエクスポート
export default smsshcssPlugin;

// CommonJSの場合のエクスポート
// @ts-ignore
if (typeof module !== 'undefined' && module.exports) {
  // @ts-ignore
  module.exports = smsshcssPlugin;
} 