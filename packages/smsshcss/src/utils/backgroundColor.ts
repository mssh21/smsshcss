/**
 * Colors utilities
 */
import { UtilityCategory } from '../types';
import { colors } from '../tokens';

export const backgroundColor: UtilityCategory = {
  'bg-base': `background-color: ${colors.backgroundBase};`,
  'bg-surface': `background-color: ${colors.backgroundSurface};`,
  'bg-elevation': `background-color: ${colors.backgroundElevation};`,
  'bg-transparent': `background-color: ${colors.backgroundTransparent};`,
  'bg-white': `background-color: ${colors.white};`,
  'bg-black': `background-color: ${colors.black};`,
  'bg-success': `background-color: ${colors.backgroundSuccess};`,
  'bg-warning': `background-color: ${colors.backgroundWarning};`,
  'bg-error': `background-color: ${colors.backgroundError};`,
  'bg-info': `background-color: ${colors.backgroundInfo};`,
}