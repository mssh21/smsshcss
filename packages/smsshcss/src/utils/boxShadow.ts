/**
 * Box Shadow utilities
 */
import { UtilityCategory } from '../types';
import { shadow } from '../tokens';

export const boxShadow: UtilityCategory = {
  'shadow-none': `box-shadow: none;`,
  'shadow-xs': `box-shadow: ${shadow.xs};`,
  'shadow-sm': `box-shadow: ${shadow.sm};`,
  'shadow-md': `box-shadow: ${shadow.md};`,
  'shadow-lg': `box-shadow: ${shadow.lg};`,
  'shadow-xl': `box-shadow: ${shadow.xl};`,
  'shadow-2xl': `box-shadow: ${shadow['2xl']};`,
}
