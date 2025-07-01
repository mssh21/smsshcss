import type { Plugin } from 'vite';

export interface SmsshCSSViteOptions {
  /**
   * File patterns to scan
   * @default ['index.html', 'src/(all-subdirs)/(all-files).{html,js,ts,jsx,tsx,vue,svelte,astro}']
   */
  content?: string[];
  /**
   * Whether to include reset CSS
   * @default true
   */
  includeResetCSS?: boolean;
  /**
   * Whether to include base CSS
   * @default true
   */
  includeBaseCSS?: boolean;
  /**
   * Purge settings
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
   * Apply settings (define frequently used utility class combinations)
   */
  apply?: Record<string, string>;
  /**
   * Whether to show purge report during development
   * @default false
   */
  showPurgeReport?: boolean;
  /**
   * Whether to enable CSS minify
   * @default true
   */
  minify?: boolean;
  /**
   * Whether to enable cache
   * @default true
   */
  cache?: boolean;
  /**
   * Whether to enable debug log
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
 * Utility function for CSS generation and purging
 * @param options Configuration options
 * @returns Generated CSS string with purging applied
 */
export function generateCSSWithPurge(options?: SmsshCSSViteOptions): Promise<string>;

export default smsshcss;
