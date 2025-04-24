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
  'text-inverse': `color: ${colors.textInverse};`,
  'text-link': `color: ${colors.textLink};`,
  'text-link-hover': `color: ${colors.textLinkHover};`,
  'text-link-pressed': `color: ${colors.textLinkPressed};`,
  'text-link-visited': `color: ${colors.textLinkVisited};`,
  'text-link-focus': `color: ${colors.textLinkFocus};`,
  'text-link-disabled': `color: ${colors.textLinkDisabled};`,
  'text-placeholder': `color: ${colors.textPlaceholder};`,
};