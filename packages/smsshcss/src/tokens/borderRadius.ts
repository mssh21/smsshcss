/**
 * Border Radius Token
 */
import { SmsshcssConfig } from '../config';
import { resolveTokens } from './utils';

const base = 4;

// ベースとなるボーダー半径のトークン
const baseBorderRadius = {
  base,

  none: '0px',
  xs: `${base / 2}px`, // 2
  sm: `${base}px`, // 4
  md: `${base * 1.5}px`, // 6
  lg: `${base * 2}px`, // 8
  xl: `${base * 3}px`, // 12
  '2xl': `${base * 4}px`, // 16
  '3xl': `${base * 5}px`, // 20
  '4xl': `${base * 6}px`, // 24
  '5xl': `${base * 7}px`, // 28
  '6xl': `${base * 8}px`, // 32
  '7xl': `${base * 9}px`, // 36
  '8xl': `${base * 10}px`, // 40
  full: '9999px',
} as const;

// 設定からボーダー半径のトークンを解決する関数
export function resolveBorderRadius(config?: SmsshcssConfig) {
  return resolveTokens('borderRadius', baseBorderRadius, config?.theme);
}

// デフォルトのボーダー半径のトークン
export const borderRadius = { ...baseBorderRadius } as const;