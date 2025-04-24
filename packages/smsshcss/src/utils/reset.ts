/**
 * reset.cssの適用をサポートするユーティリティ関数
 */
import { SmsshcssConfig } from '../config';
import { RESET_CSS_PATH } from '../index';

/**
 * 現在の設定に基づいて、reset.cssのパスを取得します
 * includeResetCSSがfalseの場合はnullを返します
 */
export function getResetCssPath(config: SmsshcssConfig): string | null {
  if (config.includeResetCSS === false) {
    return null;
  }
  return RESET_CSS_PATH;
}

/**
 * reset.cssをHTMLに適用するためのスタイル要素を作成します
 * includeResetCSSがfalseの場合は何も行いません
 */
export function applyResetCss(config: SmsshcssConfig): void {
  if (typeof document === 'undefined' || config.includeResetCSS === false) {
    return;
  }

  // 既存のreset-styleタグがあれば削除
  const existingStyle = document.getElementById('smsshcss-reset');
  if (existingStyle) {
    existingStyle.remove();
  }

  // フェッチしてスタイルを適用
  fetch(RESET_CSS_PATH)
    .then(response => response.text())
    .then(css => {
      const style = document.createElement('style');
      style.id = 'smsshcss-reset';
      style.textContent = css;
      document.head.appendChild(style);
    })
    .catch(err => {
      console.error('Failed to load reset.css:', err);
    });
} 