/**
 * Border Radius utilities
 */
import { UtilityCategory } from '../types';
import { borderRadius as borderRadiusToken } from '../tokens';

export const borderRadius: UtilityCategory = {
    'rounded-none': `border-radius: ${borderRadiusToken.tokens.none};`,
    'rounded-xs': `border-radius: ${borderRadiusToken.tokens.xs};`,
    'rounded-sm': `border-radius: ${borderRadiusToken.tokens.sm};`,
    'rounded-md': `border-radius: ${borderRadiusToken.tokens.md};`,
    'rounded-lg': `border-radius: ${borderRadiusToken.tokens.lg};`,
    'rounded-xl': `border-radius: ${borderRadiusToken.tokens.xl};`,
    'rounded-2xl': `border-radius: ${borderRadiusToken.tokens['2xl']};`,
    'rounded-3xl': `border-radius: ${borderRadiusToken.tokens['3xl']};`,
    'rounded-4xl': `border-radius: ${borderRadiusToken.tokens['4xl']};`,
    'rounded-5xl': `border-radius: ${borderRadiusToken.tokens['5xl']};`,
    'rounded-6xl': `border-radius: ${borderRadiusToken.tokens['6xl']};`,
    'rounded-7xl': `border-radius: ${borderRadiusToken.tokens['7xl']};`,
    'rounded-8xl': `border-radius: ${borderRadiusToken.tokens['8xl']};`,
    'rounded-full': `border-radius: ${borderRadiusToken.tokens.full};`,
};
