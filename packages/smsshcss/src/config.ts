/**
 * smsshcss 設定ファイルの型定義
 */

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
  includeResetCSS: true
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
    }
  };
} 