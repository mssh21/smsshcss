import type { Plugin } from 'vite';

export interface SmsshCSSViteOptions {
  /**
   * スキャンするファイルパターン
   * @default ['index.html', 'src/(all-subdirs)/(all-files).{html,js,ts,jsx,tsx,vue,svelte,astro}']
   */
  content?: string[];
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
   * パージ設定
   */
  purge?: {
    enabled?: boolean;
    safelist?: (string | RegExp)[];
    blocklist?: (string | RegExp)[];
    keyframes?: boolean;
    fontFace?: boolean;
    variables?: boolean;
  };
  /**
   * テーマのカスタマイズ
   */
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
    width?: Record<string, string>;
    height?: Record<string, string>;
    gridCols?: Record<string, string>;
    gridRows?: Record<string, string>;
    gridColumnSpan?: Record<string, string>;
    gridRowSpan?: Record<string, string>;
    gridColumnPosition?: Record<string, string>;
    gridRowPosition?: Record<string, string>;
    gridAutoFlow?: Record<string, string>;
    zIndex?: Record<string, string>;
    order?: Record<string, string>;
  };
  /**
   * 開発時にパージレポートを表示するかどうか
   * @default false
   */
  showPurgeReport?: boolean;
  /**
   * CSS minifyを有効にするかどうか
   * @default true
   */
  minify?: boolean;
  /**
   * キャッシュを有効にするかどうか
   * @default true
   */
  cache?: boolean;
  /**
   * デバッグログを有効にするかどうか
   * @default false
   */
  debug?: boolean;
}

/**
 * SmsshCSS Vite Plugin
 * @param options Configuration options
 * @returns Vite plugin instance
 */
export function smsshcss(options?: SmsshCSSViteOptions): Plugin;

/**
 * CSS生成とパージを行うユーティリティ関数
 * @param options Configuration options
 * @returns Generated CSS string with purging applied
 */
export function generateCSSWithPurge(options?: SmsshCSSViteOptions): Promise<string>;

export default smsshcss;
