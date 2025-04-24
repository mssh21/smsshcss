/**
 * Font Size Token
 * ベースサイズ16pxで、モダンなウェブに適した比率1.2のタイプスケール
 */
import { SmsshcssConfig } from '../config';
import { resolveTokens } from './utils';

const base = 16;
const ratio = 1.2;

// ベースとなるフォントサイズのトークン
const baseFontSize = {
  base: `${base}px`,                         // 16px - ベーステキスト
  xs: `${Math.round(base / ratio)}px`,       // 13px - 小さなテキスト、注釈
  '2xs': `${Math.round(base / (ratio*2))}px`, // 11px - 極小テキスト
  sm: `${Math.round(base / ratio * 1.1)}px`, // 14px - 補足テキスト
  md: `${base}px`,                           // 16px - 本文テキスト
  lg: `${Math.round(base * ratio)}px`,       // 19px - 大きな本文、小見出し
  xl: `${Math.round(base * ratio ** 2)}px`,  // 23px - 小見出し
  '2xl': `${Math.round(base * ratio ** 3)}px`, // 28px - 中見出し
  '3xl': `${Math.round(base * ratio ** 4)}px`, // 33px - 大見出し
  '4xl': `${Math.round(base * ratio ** 5)}px`, // 40px - ヘッダー
  '5xl': `${Math.round(base * ratio ** 6)}px`, // 48px - 大ヘッダー
  '6xl': `${Math.round(base * ratio ** 7)}px`, // 57px - 特大ヘッダー
  '7xl': `${Math.round(base * ratio ** 8)}px`, // 69px - ヒーローテキスト
  '8xl': `${Math.round(base * ratio ** 9)}px`, // 82px - ディスプレイテキスト
} as const;

// 設定からフォントサイズのトークンを解決する関数
export function resolveFontSize(config?: SmsshcssConfig) {
  return resolveTokens('fontSize', baseFontSize, config?.theme);
}

// デフォルトのフォントサイズのトークン
export const fontSize = { ...baseFontSize } as const;