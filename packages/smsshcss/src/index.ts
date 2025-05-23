/**
 * smsshcss main entry point
 */
import { SmsshcssConfig, defaultConfig, mergeConfig } from './config';
import {
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS,
} from './utils';
import type { UtilityValue, UtilityCategory, UtilityDefinition } from './types';
import { TokenLoader } from './tokens/loader';
import fg from 'fast-glob';
import fs from 'fs';

// Path to CSS files
export const RESET_CSS_PATH = './reset.css';

// Export types
export type { SmsshcssConfig, UtilityValue, UtilityCategory, UtilityDefinition };

function extractClassesFromFiles(contentPatterns: string[] = [], debug = false): Set<string> {
  const usedClasses = new Set<string>();
  for (const pattern of contentPatterns) {
    const files = fg.sync(pattern);
    if (debug) console.log('Matched files for pattern', pattern, files);
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        // class="..." や className="..." からクラス名を抽出
        const regex = /class(?:Name)?=["']([^"']+)["']/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          match[1].split(/\s+/).forEach((cls) => {
            if (cls) usedClasses.add(cls.trim());
          });
        }
      } catch (e) {
        if (debug) console.warn('Failed to read', file, e);
      }
    }
  }
  return usedClasses;
}

// CSSセレクタ用エスケープ関数（Tailwind風）
function escapeClassSelector(className: string): string {
  // CSS特殊文字をバックスラッシュでエスケープ
  // https://developer.mozilla.org/ja/docs/Web/CSS/Identifier#escaping
  return className.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
}

/**
 * Generate CSS based on configuration
 * @param options Configuration options
 * @returns Generated CSS string
 */
export async function generateCSS(options: {
  content?: string[];
  safelist?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  legacyMode?: boolean;
  debug?: boolean;
  customCSS?: string;
  theme?: Record<string, Record<string, string>>;
}): Promise<string> {
  try {
    // デバッグモードの場合、受け取った設定を出力
    if (options.debug) {
      console.log('generateCSS - received options:', {
        theme: options.theme,
        includeBaseCSS: options.includeBaseCSS,
        includeResetCSS: options.includeResetCSS,
        legacyMode: options.legacyMode,
        content: options.content,
      });
    }

    // Initialize CSS parts
    let cssContent = '';

    // Add reset CSS if enabled
    if (options.includeResetCSS !== false) {
      cssContent += await applyResetCss();
      cssContent += '\n\n';
    }

    // Add base CSS if enabled - テーマ設定を完全に渡す
    if (options.includeBaseCSS !== false) {
      // SmsshcssConfig形式に変換して渡す
      const config: SmsshcssConfig = {
        includeBaseCSS: options.includeBaseCSS,
        includeResetCSS: options.includeResetCSS,
        theme: options.theme || {},
        debug: options.debug,
      };

      cssContent += baseStylesToCss(config);
      cssContent += '\n\n';
    }

    // トークンを使用して新しいTokenLoaderインスタンスを作成
    const tokenLoader = new TokenLoader({
      theme: options.theme || {},
      debug: options.debug,
    });

    // デバッグ情報としてトークンの状態を出力
    if (options.debug) {
      console.log('TokenLoader created with resolved tokens', {
        fontSize: tokenLoader.fontSize,
        colors: tokenLoader.colors,
        spacing: tokenLoader.spacing,
      });
    }

    // --- ここから「使われているクラス名」ごとにCSSを生成 ---
    const usedClasses = extractClassesFromFiles(options.content, options.debug);
    if (options.safelist) {
      options.safelist.forEach((cls) => usedClasses.add(cls));
    }
    if (options.debug) {
      console.log('Used classes:', Array.from(usedClasses));
    }

    // 各クラス名について
    for (const className of usedClasses) {
      let found = false;
      for (const [, utils] of Object.entries(utilities)) {
        for (const [pattern, style] of Object.entries(utils)) {
          // パターンを正規表現に変換
          let regexPattern = pattern.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
          regexPattern = regexPattern.replace(/\[(.+?)\]/g, '\\[(.+?)\\]');
          const regex = new RegExp('^' + regexPattern + '$');
          const match = className.match(regex);
          if (match) {
            let cssRule = style;
            cssRule = cssRule.replace(/\$(\d+)/g, (_, n) => match[parseInt(n)]);
            cssContent += `.${escapeClassSelector(className)} { ${cssRule} }\n`;
            if (options.debug) {
              console.log('DEBUG: matched', { className, pattern, regexPattern, cssRule, match });
            }
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
    // --- ここまで ---

    // Add custom CSS if provided
    if (options.customCSS) {
      cssContent += '\n\n';
      cssContent += options.customCSS;
    }

    // デバッグモードの場合、生成されたCSSの長さを出力
    if (options.debug) {
      console.log(`Generated CSS: ${cssContent.length} bytes`);
      console.log('Content patterns:', options.content);
    }

    return cssContent;
  } catch (error) {
    console.error('Error generating CSS:', error);
    // エラーが発生した場合でも、最低限のCSSを返す
    return `
      .p-xs { padding: 4px; }
      .p-sm { padding: 8px; }
      .p-md { padding: 16px; }
      .p-lg { padding: 24px; }
      .p-xl { padding: 32px; }
      .m-xs { margin: 4px; }
      .m-sm { margin: 8px; }
      .m-md { margin: 16px; }
      .m-lg { margin: 24px; }
      .m-xl { margin: 32px; }
      .flex { display: flex; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .gap-md { gap: 16px; }
      .gap-lg { gap: 24px; }
    `;
  }
}

// Export values
export {
  defaultConfig,
  mergeConfig,
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS,
};

// Default export
export default {
  utilities,
  config: defaultConfig,
  mergeConfig,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  resetCssPath: RESET_CSS_PATH,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS,
  generateCSS,
};
