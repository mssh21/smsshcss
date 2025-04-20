/**
 * smsshcss main entry point
 */
import { SmsshcssConfig, defaultConfig, mergeConfig } from './config';
import { utilities } from './utils';
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
  utilities
};

// Default export
export default {
  utilities,
  config: defaultConfig,
  mergeConfig
}; 