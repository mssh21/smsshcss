/**
 * Font Weight utilities
 */
import { UtilityCategory } from '../types';
import { fontWeight as fontWeightToken } from '../tokens';

export const fontWeight: UtilityCategory = {
  'font-thin': fontWeightToken.thin,
  'font-light': fontWeightToken.light,
  'font-normal': fontWeightToken.normal,
  'font-medium': fontWeightToken.medium,
  'font-semibold': fontWeightToken.semibold,
  'font-bold': fontWeightToken.bold,
  'font-extrabold': fontWeightToken.extrabold,
  'font-black': fontWeightToken.black,
};