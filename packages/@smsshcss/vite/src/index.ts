import type { Plugin } from 'vite';
import {
  applyResetCss,
  applyBaseCss,
  generateAllSpacingClasses,
  generateDisplayClasses,
} from 'smsshcss/utils';
import fs from 'fs';
import path from 'path';

export interface SmsshCSSViteOptions {
  /**
   * 生成するCSSの内容をカスタマイズ
   */
  content?: string;
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
const customValuePattern = /\b([mp][trlbxy]?)-\[([^\]]+)\]/g;

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
      return `.${prefix}-\\[${value.replace(/[()]/g, '\\$&')}\\] { ${property}-left: ${value}; ${property}-right: ${value}; }`;
    case 'y':
      return `.${prefix}-\\[${value.replace(/[()]/g, '\\$&')}\\] { ${property}-top: ${value}; ${property}-bottom: ${value}; }`;
    case '':
      // 全方向
      break;
    default:
      return null;
  }

  return `.${prefix}-\\[${value.replace(/[()]/g, '\\$&')}\\] { ${cssProperty}: ${value}; }`;
}

export function smsshcss(options: SmsshCSSViteOptions = {}): Plugin {
  const { includeReset = true, includeBase = true, theme = {} } = options;

  let customClasses: string[] = [];

  return {
    name: 'smsshcss',
    buildStart(): void {
      // HTMLファイルをスキャンしてカスタムクラスを抽出
      try {
        const htmlPath = path.join(process.cwd(), 'index.html');
        if (fs.existsSync(htmlPath)) {
          const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
          customClasses = extractCustomClasses(htmlContent);
        }
      } catch (error) {
        console.warn('Failed to scan HTML for custom classes:', error);
      }
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
