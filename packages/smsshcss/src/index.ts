/**
 * smsshcss メインエントリーポイント
 */
import { SmsshcssConfig, defaultConfig, mergeConfig } from './config';
import { 
  utilities, 
  createUtilityClass, 
  createUtilityClasses, 
  mergeUtilityClasses 
} from './utilities';

// 型のエクスポート
import type { UtilityValue, UtilityCategory, UtilityDefinition } from './utilities';

/**
 * 全てのエクスポート
 */
// 型のエクスポート
export type { 
  SmsshcssConfig,
  UtilityValue,
  UtilityCategory,
  UtilityDefinition
};

// 値のエクスポート
export {
  // 設定関連
  defaultConfig,
  mergeConfig,
  
  // ユーティリティ関連
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
};

/**
 * デフォルトエクスポート
 */
export default {
  utilities,
  config: defaultConfig,
  mergeConfig,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
}; 