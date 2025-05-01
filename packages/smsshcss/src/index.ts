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

// Path to CSS files
export const RESET_CSS_PATH = './reset.css';

// Export types
export type { SmsshcssConfig, UtilityValue, UtilityCategory, UtilityDefinition };

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
    // Initialize CSS parts
    let cssContent = '';

    // Add reset CSS if enabled
    if (options.includeResetCSS !== false) {
      cssContent += await applyResetCss();
      cssContent += '\n\n';
    }

    // Add base CSS if enabled
    if (options.includeBaseCSS !== false) {
      cssContent += applyBaseCSS();
      cssContent += '\n\n';
    }

    // テーマ設定からカラーのカスタマイズを適用
    const colors = options.theme?.colors || {};
    Object.entries(colors).forEach(([name, value]) => {
      cssContent += `.text-${name} { color: ${value}; }\n`;
      cssContent += `.bg-${name} { background-color: ${value}; }\n`;
      cssContent += `.border-${name} { border-color: ${value}; }\n`;
    });

    // スペーシング設定を適用
    const spacing = options.theme?.spacing || {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    };

    // パディング
    Object.entries(spacing).forEach(([name, value]) => {
      cssContent += `.p-${name} { padding: ${value}; }\n`;
      cssContent += `.p-block-start-${name} { padding-block-start: ${value}; }\n`;
      cssContent += `.p-block-end-${name} { padding-block-end: ${value}; }\n`;
      cssContent += `.p-inline-start-${name} { padding-inline-start: ${value}; }\n`;
      cssContent += `.p-inline-end-${name} { padding-inline-end: ${value}; }\n`;
    });

    // マージン
    Object.entries(spacing).forEach(([name, value]) => {
      cssContent += `.m-${name} { margin: ${value}; }\n`;
      cssContent += `.m-block-start-${name} { margin-block-start: ${value}; }\n`;
      cssContent += `.m-block-end-${name} { margin-block-end: ${value}; }\n`;
      cssContent += `.m-inline-start-${name} { margin-inline-start: ${value}; }\n`;
      cssContent += `.m-inline-end-${name} { margin-inline-end: ${value}; }\n`;
    });

    // ギャップ
    Object.entries(spacing).forEach(([name, value]) => {
      cssContent += `.gap-${name} { gap: ${value}; }\n`;
    });

    // フレックスボックスユーティリティ
    cssContent += `.flex { display: flex; }\n`;
    cssContent += `.items-center { align-items: center; }\n`;
    cssContent += `.justify-between { justify-content: space-between; }\n`;
    cssContent += `.justify-center { justify-content: center; }\n`;
    cssContent += `.flex-col { flex-direction: column; }\n`;
    cssContent += `.flex-row { flex-direction: row; }\n`;
    cssContent += `.flex-wrap { flex-wrap: wrap; }\n`;

    // グリッドユーティリティ
    cssContent += `.grid { display: grid; }\n`;
    cssContent += `.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n`;
    cssContent += `.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n`;
    cssContent += `.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n`;

    // フォントウェイト設定
    const fontWeights = options.theme?.fontWeight || {
      normal: '400',
      bold: '700',
    };

    Object.entries(fontWeights).forEach(([name, value]) => {
      cssContent += `.font-${name} { font-weight: ${value}; }\n`;
    });

    // Add custom CSS if provided
    if (options.customCSS) {
      cssContent += '\n\n';
      cssContent += options.customCSS;
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
