/**
 * Colors utilities
 */
import { UtilityCategory } from '../types';
import { colors } from '../tokens';

export const borderColor: UtilityCategory = {
  'border-default': `border-color: ${colors.borderDefault};`,
  'border-disabled': `border-color: ${colors.borderDisabled};`,
  'border-success': `border-color: ${colors.borderSuccess};`,
  'border-warning': `border-color: ${colors.borderWarning};`,
  'border-error': `border-color: ${colors.borderError};`,
  'border-info': `border-color: ${colors.borderInfo};`,
  'border-transparent': `border-color: ${colors.borderTransparent};`,
}
