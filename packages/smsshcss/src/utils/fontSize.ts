/**
 * Font Size utilities
 */
import { UtilityCategory } from '../types';
import { fontSize as fontSizeToken } from '../tokens';

export const fontSize: UtilityCategory = {
  'text-xs': fontSizeToken.xs,
  'text-sm': fontSizeToken.sm,
  'text-base': fontSizeToken.base,
  'text-lg': fontSizeToken.lg,
  'text-xl': fontSizeToken.xl,
  'text-2xl': fontSizeToken['2xl'],
  'text-3xl': fontSizeToken['3xl'],
  'text-4xl': fontSizeToken['4xl'],
  'text-5xl': fontSizeToken['5xl'],
  'text-6xl': fontSizeToken['6xl'],
  'text-7xl': fontSizeToken['7xl'],
  'text-8xl': fontSizeToken['8xl'],
};