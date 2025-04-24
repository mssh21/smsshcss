/**
 * smsshcss main entry point
 */
import { SmsshcssConfig, defaultConfig, mergeConfig } from './config';
import {
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS
} from './utils';
import type { UtilityValue, UtilityCategory, UtilityDefinition } from './types';

// Path to CSS files
export const RESET_CSS_PATH = './reset.css';

// Export types
export type {
  SmsshcssConfig,
  UtilityValue,
  UtilityCategory,
  UtilityDefinition
};

// Export values
export {
  defaultConfig,
  mergeConfig,
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS
};

// Default export
export default {
  utilities,
  config: defaultConfig,
  mergeConfig,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses,
  resetCssPath: RESET_CSS_PATH,
  getResetCssPath,
  applyResetCss,
  baseStyles,
  baseStylesToCss,
  applyBaseCSS
}; 