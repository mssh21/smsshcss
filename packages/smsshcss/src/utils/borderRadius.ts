/**
 * Border Radius utilities
 */
import { UtilityCategory } from '../types';
import { borderRadius as borderRadiusToken } from '../tokens';

export const borderRadius: UtilityCategory = {
    'rounded-none': `border-radius: ${borderRadiusToken.none};`,
    'rounded-xs': `border-radius: ${borderRadiusToken.xs};`,
    'rounded-sm': `border-radius: ${borderRadiusToken.sm};`,
    'rounded-md': `border-radius: ${borderRadiusToken.md};`,
    'rounded-lg': `border-radius: ${borderRadiusToken.lg};`,
    'rounded-xl': `border-radius: ${borderRadiusToken.xl};`,
    'rounded-2xl': `border-radius: ${borderRadiusToken['2xl']};`,
    'rounded-3xl': `border-radius: ${borderRadiusToken['3xl']};`,
    'rounded-4xl': `border-radius: ${borderRadiusToken['4xl']};`,
    'rounded-5xl': `border-radius: ${borderRadiusToken['5xl']};`,
    'rounded-6xl': `border-radius: ${borderRadiusToken['6xl']};`,
    'rounded-7xl': `border-radius: ${borderRadiusToken['7xl']};`,
    'rounded-8xl': `border-radius: ${borderRadiusToken['8xl']};`,
    'rounded-full': `border-radius: ${borderRadiusToken.full};`,
};
