/**
 * smsshcss main entry point
 */
import { SmsshcssConfig, defaultConfig, mergeConfig } from './config';
import {
  utilities,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
} from './utils';
import type { UtilityValue, UtilityCategory, UtilityDefinition } from './types';

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
  mergeUtilityClasses
};

// Default export
export default {
  utilities,
  config: defaultConfig,
  mergeConfig,
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
}; 