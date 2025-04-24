/**
 * Font Weight Token
 */
import { SmsshcssConfig } from '../config';
import { resolveTokens } from './utils';

// ベースとなるフォントウェイトのトークン
const baseFontWeight = {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
} as const;

// 設定からフォントウェイトのトークンを解決する関数
export function resolveFontWeight(config?: SmsshcssConfig) {
    return resolveTokens('fontWeight', baseFontWeight, config?.theme);
}

// デフォルトのフォントウェイトのトークン
export const fontWeight = { ...baseFontWeight } as const;