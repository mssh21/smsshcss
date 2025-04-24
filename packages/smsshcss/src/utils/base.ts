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
  // トークンローダーから設定済みのトークンを取得
  const tokenLoader = new TokenLoader(config);
  const { colors, fontSize, lineHeight, fontWeight } = tokenLoader;

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
  const css = baseStylesToCss(config);
  
  // CSSをスタイル要素として追加
  const style = document.createElement('style');
  style.id = 'smsshcss-base';
  style.textContent = css;
  document.head.appendChild(style);
} 