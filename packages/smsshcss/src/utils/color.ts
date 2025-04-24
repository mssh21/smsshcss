/**
 * Colors utilities
 */
import { UtilityCategory } from '../types';
import { colors } from '../tokens';

export const color: UtilityCategory = {
  'text-primary': `color: ${colors.textPrimary};`,
  'text-secondary': `color: ${colors.textSecondary};`,
  'text-accent': `color: ${colors.textAccent};`,
  'text-warning': `color: ${colors.textWarning};`,
  'text-error': `color: ${colors.textError};`,
  'text-info': `color: ${colors.textInfo};`,
  'text-success': `color: ${colors.textSuccess};`,
  'text-inverse': `color: ${colors.inverse};`,
};