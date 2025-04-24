/**
 * base.cssの適用をサポートするユーティリティ関数
 */
import { SmsshcssConfig } from '../config';
import { colors } from '../tokens/colors';
import { fontSize } from '../tokens/fontSize';
import { lineHeight } from '../tokens/lineHeight';
import { fontWeight } from '../tokens/fontWeight';

/**
 * 基本スタイルの定義
 * トークンを直接参照してCSSを生成
 */
export const baseStyles = {
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

/**
 * baseスタイルをCSSに変換する関数
 */
export function baseStylesToCss(): string {
  let css = '';
  
  for (const [selector, rules] of Object.entries(baseStyles)) {
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
 */
export function applyBaseCSS(config: SmsshcssConfig): void {
  if (typeof document === 'undefined' || config.includeBaseCSS === false) {
    return;
  }

  // 既存のbase-styleタグがあれば削除
  const existingStyle = document.getElementById('smsshcss-base');
  if (existingStyle) {
    existingStyle.remove();
  }

  // baseスタイルをCSSに変換
  const css = baseStylesToCss();
  
  // CSSをスタイル要素として追加
  const style = document.createElement('style');
  style.id = 'smsshcss-base';
  style.textContent = css;
  document.head.appendChild(style);
} 