/**
 * Font Size utilities
 */
import { UtilityCategory } from '../types';
import { fontSize as fontSizeToken } from '../tokens';

export const fontSize: UtilityCategory = {
  'text-xs': fontSizeToken.tokens.xs,
  'text-sm': fontSizeToken.tokens.sm,
  'text-base': fontSizeToken.tokens.base,
  'text-lg': fontSizeToken.tokens.lg,
  'text-xl': fontSizeToken.tokens.xl,
  'text-2xl': fontSizeToken.tokens['2xl'],
  'text-3xl': fontSizeToken.tokens['3xl'],
  'text-4xl': fontSizeToken.tokens['4xl'],
  'text-5xl': fontSizeToken.tokens['5xl'],
  'text-6xl': fontSizeToken.tokens['6xl'],
  'text-7xl': fontSizeToken.tokens['7xl'],
  'text-8xl': fontSizeToken.tokens['8xl'],
};