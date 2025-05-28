import type { Plugin } from 'vite';

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

export default function smsshcss(options?: SmsshCSSViteOptions): Plugin;
