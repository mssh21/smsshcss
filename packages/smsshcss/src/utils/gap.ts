/**
 * Gap utilities
 */
import { UtilityCategory } from '../types';
import { spacing } from '../tokens';

export const gap: UtilityCategory = {
  'gap-none': `gap: ${spacing.none};`,
  'gap-xs': `gap: ${spacing.xs};`,
  'gap-sm': `gap: ${spacing.sm};`,
  'gap-md': `gap: ${spacing.md};`,
  'gap-lg': `gap: ${spacing.lg};`,
  'gap-xl': `gap: ${spacing.xl};`,
  'gap-2xl': `gap: ${spacing['2xl']};`,
  'gap-3xl': `gap: ${spacing['3xl']};`,
  'gap-4xl': `gap: ${spacing['4xl']};`,
  'gap-5xl': `gap: ${spacing['5xl']};`,
  'gap-6xl': `gap: ${spacing['6xl']};`,
  'gap-7xl': `gap: ${spacing['7xl']};`,
  'gap-8xl': `gap: ${spacing['8xl']};`,
};

export const rowGap: UtilityCategory = {
  'row-gap-none': `row-gap: ${spacing.none};`,
  'row-gap-xs': `row-gap: ${spacing.xs};`,
  'row-gap-sm': `row-gap: ${spacing.sm};`,
  'row-gap-md': `row-gap: ${spacing.md};`,
  'row-gap-lg': `row-gap: ${spacing.lg};`,
  'row-gap-xl': `row-gap: ${spacing.xl};`,
  'row-gap-2xl': `row-gap: ${spacing['2xl']};`,
  'row-gap-3xl': `row-gap: ${spacing['3xl']};`,
  'row-gap-4xl': `row-gap: ${spacing['4xl']};`,
  'row-gap-5xl': `row-gap: ${spacing['5xl']};`,
  'row-gap-6xl': `row-gap: ${spacing['6xl']};`,
  'row-gap-7xl': `row-gap: ${spacing['7xl']};`,
  'row-gap-8xl': `row-gap: ${spacing['8xl']};`,
};

export const columnGap: UtilityCategory = {
  'column-gap-none': `column-gap: ${spacing.none};`,
  'column-gap-xs': `column-gap: ${spacing.xs};`,
  'column-gap-sm': `column-gap: ${spacing.sm};`,
  'column-gap-md': `column-gap: ${spacing.md};`,
  'column-gap-lg': `column-gap: ${spacing.lg};`,
  'column-gap-xl': `column-gap: ${spacing.xl};`,
  'column-gap-2xl': `column-gap: ${spacing['2xl']};`,
  'column-gap-3xl': `column-gap: ${spacing['3xl']};`,
  'column-gap-4xl': `column-gap: ${spacing['4xl']};`,
  'column-gap-5xl': `column-gap: ${spacing['5xl']};`,
  'column-gap-6xl': `column-gap: ${spacing['6xl']};`,
  'column-gap-7xl': `column-gap: ${spacing['7xl']};`,
  'column-gap-8xl': `column-gap: ${spacing['8xl']};`,
};

export const arbitraryGap: UtilityCategory = {
  'gap-\\[(\\d+(?:\\.\\d+)?(?:px|rem|em|vh|vw|%|ch|ex|vmin|vmax)?)\\]': 'gap: $1;',
  'row-gap-\\[(\\d+(?:\\.\\d+)?(?:px|rem|em|vh|vw|%|ch|ex|vmin|vmax)?)\\]': 'row-gap: $1;',
  'column-gap-\\[(\\d+(?:\\.\\d+)?(?:px|rem|em|vh|vw|%|ch|ex|vmin|vmax)?)\\]': 'column-gap: $1;',
};
