/**
 * Font Size utilities
 */
import { UtilityCategory } from '../types';
import { fontSize as fontSizeToken } from '../tokens';

export const fontSize: UtilityCategory = {
  'text-base': `font-size: ${fontSizeToken.base};`,
  'text-xs': `font-size: ${fontSizeToken.xs};`,
  'text-2xs': `font-size: ${fontSizeToken['2xs']};`,
  'text-sm': `font-size: ${fontSizeToken.sm};`,
  'text-md': `font-size: ${fontSizeToken.md};`,
  'text-lg': `font-size: ${fontSizeToken.lg};`,
  'text-xl': `font-size: ${fontSizeToken.xl};`,
  'text-2xl': `font-size: ${fontSizeToken['2xl']};`,
  'text-3xl': `font-size: ${fontSizeToken['3xl']};`,
  'text-4xl': `font-size: ${fontSizeToken['4xl']};`,
  'text-5xl': `font-size: ${fontSizeToken['5xl']};`,
  'text-6xl': `font-size: ${fontSizeToken['6xl']};`,
  'text-7xl': `font-size: ${fontSizeToken['7xl']};`,
  'text-8xl': `font-size: ${fontSizeToken['8xl']};`,
};