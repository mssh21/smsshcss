/**
 * base.cssの適用をサポートするユーティリティ関数
 */
import { SmsshcssConfig } from '../config';
import { TokenLoader } from '../tokens/loader';

/**
 * 基本スタイルの定義を生成する関数
 * トークンを設定から解決してCSSを生成
 */
export function generateBaseStyles(config: SmsshcssConfig) {
  // デバッグモードのチェックと設定情報のログ出力
  if (config.debug) {
    console.log('generateBaseStyles - received config:', {
      theme: config.theme,
      includeBaseCSS: config.includeBaseCSS,
      includeResetCSS: config.includeResetCSS,
      debug: config.debug
    });
  }

  // トークンローダーから設定済みのトークンを取得
  const tokenLoader = new TokenLoader(config);
  const { colors, fontSize, lineHeight, fontWeight } = tokenLoader;

  // デバッグ情報を出力
  if (config.debug) {
    console.log('Resolved tokens:', {
      colors: {
        primary: colors.primary,
        textPrimary: colors.textPrimary,
        textLink: colors.textLink,
        backgroundBase: colors.backgroundBase,
      },
      fontSize: {
        base: fontSize.base,
        xl: fontSize.xl,
        '2xl': fontSize['2xl'],
        '3xl': fontSize['3xl'],
      },
      lineHeight: {
        normal: lineHeight.normal,
        tight: lineHeight.tight,
        relaxed: lineHeight.relaxed,
      },
      fontWeight: {
        normal: fontWeight.normal,
        bold: fontWeight.bold,
      }
    });
  }

  return {
    // HTMLルート要素のスタイル
    'html': {
      'box-sizing': 'border-box',
      'font-size': fontSize.base
    },

    // ボックスサイジングの継承
    '*, *::before, *::after': {
      'box-sizing': 'inherit'
    },

    // ボディのスタイル
    'body': {
      'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      'font-size': fontSize.base,
      'line-height': lineHeight.normal,
      'color': colors.textPrimary,
      'font-weight': fontWeight.normal,
      'background-color': colors.backgroundBase,
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    },

    // リンクのスタイル
    'a': {
      'color': colors.textLink,
      'text-decoration': 'underline'
    },

    'a:hover': {
      'text-decoration': 'none'
    },

    // 見出しのスタイル
    'h1, h2, h3, h4, h5, h6': {
      'margin-top': '0',
      'line-height': lineHeight.tight,
      'color': colors.textPrimary,
      'font-weight': fontWeight.bold
    },

    'h1': {
      'font-size': fontSize['3xl']
    },

    'h2': {
      'font-size': fontSize['2xl']
    },

    'h3': {
      'font-size': fontSize.xl
    },

    // 段落のスタイル
    'p': {
      'margin-top': '0',
      'margin-bottom': '1.25em',
      'line-height': lineHeight.relaxed,
      'hyphens': 'auto',
      'word-break': 'break-word',
      'overflow-wrap': 'break-word'
    },

    // 画像のスタイル
    'img': {
      'max-width': '100%',
      'height': 'auto'
    },

    // フォーム要素のスタイル
    'input, textarea, select, button': {
      'font-family': 'inherit',
      'font-size': 'inherit',
      'line-height': 'inherit'
    },

    'button': {
      'cursor': 'pointer'
    }
  };
}

// 現在の設定に基づいたデフォルトのベーススタイル
export const baseStyles = generateBaseStyles({});

/**
 * baseスタイルをCSSに変換する関数
 */
export function baseStylesToCss(config?: SmsshcssConfig): string {
  const styles = config ? generateBaseStyles(config) : baseStyles;
  let css = '';

  for (const [selector, rules] of Object.entries(styles)) {
    css += `${selector} {\n`;
    for (const [property, value] of Object.entries(rules)) {
      css += `  ${property}: ${value};\n`;
    }
    css += '}\n\n';
  }

  return css;
}

/**
 * base.cssをHTMLに適用するためのスタイル要素を作成します
 * includeBaseCSSがfalseの場合は何も行いません
 * 修正: CSS文字列を返すように変更
 */
export function applyBaseCSS(config?: SmsshcssConfig): string {
  if (config?.includeBaseCSS === false) {
    return '';
  }

  // baseスタイルをCSSに変換して返す
  return baseStylesToCss(config);
}
