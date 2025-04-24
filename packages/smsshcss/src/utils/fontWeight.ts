/**
 * Font Weight utilities
 */
import { UtilityCategory } from '../types';
import { fontWeight as fontWeightToken } from '../tokens';

export const fontWeight: UtilityCategory = {
  'font-thin': fontWeightToken.tokens.thin,
  'font-light': fontWeightToken.tokens.light,
  'font-normal': fontWeightToken.tokens.normal,
  'font-medium': fontWeightToken.tokens.medium,
  'font-semibold': fontWeightToken.tokens.semibold,
  'font-bold': fontWeightToken.tokens.bold,
  'font-extrabold': fontWeightToken.tokens.extrabold,
  'font-black': fontWeightToken.tokens.black,
};