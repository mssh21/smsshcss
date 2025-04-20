/**
 * Export all utilities
 */
import { display } from './display';
import {
  flex,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignSelf
} from './flexbox';
import {
  gridTemplateColumns,
  gridTemplateRows
} from './grid';
import { position } from './position';
import {
  textAlign,
  fontSize,
  fontWeight
} from './typography';
import {
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
} from './helpers';

import { UtilityDefinition } from '../types';

// Export utility definitions
export const utilities: UtilityDefinition = {
  display,
  flex,
  'flex-direction': flexDirection,
  'flex-wrap': flexWrap,
  'justify-content': justifyContent,
  'align-items': alignItems,
  'align-self': alignSelf,
  'grid-template-columns': gridTemplateColumns,
  'grid-template-rows': gridTemplateRows,
  position,
  'text-align': textAlign,
  'font-size': fontSize,
  'font-weight': fontWeight
};

// Export utility helper functions
export {
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
}; 