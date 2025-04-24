/**
 * smsshcss 設定ファイルの型定義
 */

/**
 * トークンのカスタマイズを定義するテーマの型
 */
export interface ThemeConfig {
  /**
   * カラートークンのカスタマイズ
   */
  colors?: Record<string, string>;
  
  /**
   * フォントサイズトークンのカスタマイズ
   */
  fontSize?: Record<string, string>;
  
  /**
   * 行の高さトークンのカスタマイズ
   */
  lineHeight?: Record<string, string>;
  
  /**
   * フォントの太さトークンのカスタマイズ
   */
  fontWeight?: Record<string, string>;
  
  /**
   * スペーシングトークンのカスタマイズ
   */
  spacing?: Record<string, string>;
  
  /**
   * ボーダー半径トークンのカスタマイズ
   */
  borderRadius?: Record<string, string>;
  
  /**
   * シャドウトークンのカスタマイズ
   */
  shadow?: Record<string, string>;
}

export interface SmsshcssConfig {
  /**
   * パージ処理を有効にするかどうか
   * @default true
   */
  purge?: boolean;
  
  /**
   * HTMLファイルなど、クラス名を抽出する対象ファイルのパターン
   * @default []
   */
  content?: string[];
  
  /**
   * 常に含めるクラス名のリスト
   * @default []
   */
  safelist?: string[];
  
  /**
   * 除外するクラス名のパターン
   * @default []
   */
  exclude?: string[];
  
  /**
   * カスタムユーティリティクラスの追加
   * @default {}
   */
  utilities?: Record<string, Record<string, string>>;

  /**
   * reset.cssを含めるかどうか
   * @default true
   */
  includeResetCSS?: boolean;

  /**
   * base.cssを含めるかどうか
   * @default true
   */
  includeBaseCSS?: boolean;

  /**
   * トークンをカスタマイズするためのテーマ設定
   * @example
   * theme: {
   *   colors: {
   *     primary: '#3490dc',
   *     secondary: '#ffed4a'
   *   },
   *   fontSize: {
   *     base: '16px',
   *     xl: '1.5rem'
   *   }
   * }
   * @default {}
   */
  theme?: ThemeConfig;
}

/**
 * デフォルト設定
 */
export const defaultConfig: SmsshcssConfig = {
  purge: true,
  content: [],
  safelist: [],
  exclude: [],
  utilities: {},
  includeResetCSS: true,
  includeBaseCSS: true,
  theme: {}
};

/**
 * 設定をマージする関数
 */
export function mergeConfig(userConfig: SmsshcssConfig = {}): SmsshcssConfig {
  return {
    ...defaultConfig,
    ...userConfig,
    utilities: {
      ...defaultConfig.utilities,
      ...(userConfig.utilities || {})
    },
    theme: {
      ...defaultConfig.theme,
      ...(userConfig.theme || {})
    }
  };
} 