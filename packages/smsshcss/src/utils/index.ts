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
  fontWeight,
} from './typography';
import {
  textColor
} from './color';
import {
  backgroundColor
} from './backgroundColor';
import {
  borderColor
} from './borderColor';
import {
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
} from './helpers';

import { UtilityDefinition, UtilityCategory } from '../types';

// Import all utility modules
const utilityModules = {
  display,
  flex,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignSelf,
  gridTemplateColumns,
  gridTemplateRows,
  position,
  textAlign,
  fontSize,
  fontWeight,
  textColor,
  backgroundColor,
  borderColor,
};

// Utility name mapping (if different from import variable name)
const utilityNameMap: Record<string, string> = {
  'flexDirection': 'flex-direction',
  'flexWrap': 'flex-wrap',
  'justifyContent': 'justify-content',
  'alignItems': 'align-items',
  'alignSelf': 'align-self',
  'gridTemplateColumns': 'grid-template-columns',
  'gridTemplateRows': 'grid-template-rows',
  'textAlign': 'text-align',
  'fontSize': 'font-size',
  'fontWeight': 'font-weight',
  'textColor': 'color',
  'backgroundColor': 'background-color',
  'borderColor': 'border-color',
};

// Export utility definitions - dynamically built
export const utilities: UtilityDefinition = Object.entries(utilityModules).reduce(
  (acc, [key, value]) => {
    const cssPropertyName = utilityNameMap[key] || key;
    acc[cssPropertyName] = value as UtilityCategory;
    return acc;
  },
  {} as UtilityDefinition
);

// Export utility helper functions
export {
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
}; 