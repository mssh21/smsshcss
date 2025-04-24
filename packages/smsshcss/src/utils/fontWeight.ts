/**
 * Font Weight utilities
 */
import { UtilityCategory } from '../types';
import { fontWeight as fontWeightToken } from '../tokens';

export const fontWeight: UtilityCategory = {
  'font-thin': `font-weight: ${fontWeightToken.thin};`,
  'font-light': `font-weight: ${fontWeightToken.light};`,
  'font-normal': `font-weight: ${fontWeightToken.normal};`,
  'font-medium': `font-weight: ${fontWeightToken.medium};`,
  'font-semibold': `font-weight: ${fontWeightToken.semibold};`,
  'font-bold': `font-weight: ${fontWeightToken.bold};`,
  'font-extrabold': `font-weight: ${fontWeightToken.extrabold};`,
  'font-black': `font-weight: ${fontWeightToken.black};`,
};