/**
 * Line Height Token (base: 12px)
 */
import { SmsshcssConfig } from '../config';
import { resolveTokens } from './utils';

// ベースとなるラインハイトのトークン
const baseLineHeight = {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.75",
    loose: "2",
    extra: "2.5",
} as const;

// 設定からラインハイトのトークンを解決する関数
export function resolveLineHeight(config?: SmsshcssConfig) {
    return resolveTokens('lineHeight', baseLineHeight, config?.theme);
}

// デフォルトのラインハイトのトークン
export const lineHeight = { ...baseLineHeight } as const;