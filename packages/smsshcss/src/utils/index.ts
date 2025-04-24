/**
 * Export all utilities
 */
import {
  getResetCssPath,
  applyResetCss
} from './reset';
import { 
  margin,
  marginBlock,
  marginBlockStart,
  marginBlockEnd,
  marginInline,
  marginInlineStart,
  marginInlineEnd } from './margin';
import { 
  padding,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd
 } from './padding';
import { 
  gap,
  rowGap,
  columnGap
 } from './gap';
import {
  display
} from './display';
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
  color
} from './color';
import {
  backgroundColor
} from './backgroundColor';
import {
  textAlign
} from './textAlign';
import {
  fontSize
} from './fontSize';
import {
  fontWeight
} from './fontWeight';
import {
  borderColor
} from './borderColor';
import {
  borderRadius
} from './borderRadius';
import {
  boxShadow
} from './boxShadow';
import {
  createUtilityClass,
  createUtilityClasses,
  mergeUtilityClasses
} from './helpers';
import {
  applyBaseCSS,
  baseStyles,
  baseStylesToCss
} from './base';

import { UtilityDefinition, UtilityCategory } from '../types';

// Import all utility modules
const utilityModules = {
  margin,
  marginBlock,
  marginBlockStart,
  marginBlockEnd,
  marginInline,
  marginInlineStart,
  marginInlineEnd,
  padding,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd,
  gap,
  rowGap,
  columnGap,
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
  color,
  backgroundColor,
  borderColor,
  borderRadius,
  boxShadow
};

// Utility name mapping (if different from import variable name)
const utilityNameMap: Record<string, string> = {
  'marginBlock': 'margin-block',
  'marginBlockStart': 'margin-block-start',
  'marginBlockEnd': 'margin-block-end',
  'marginInline': 'margin-inline',
  'marginInlineStart': 'margin-inline-start',
  'marginInlineEnd': 'margin-inline-end',
  'paddingBlock': 'padding-block',
  'paddingBlockStart': 'padding-block-start',
  'paddingBlockEnd': 'padding-block-end',
  'paddingInline': 'padding-inline',
  'paddingInlineStart': 'padding-inline-start',
  'paddingInlineEnd': 'padding-inline-end',
  'rowGap': 'row-gap',
  'columnGap': 'column-gap',
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
  'color': 'color',
  'backgroundColor': 'background-color',
  'borderColor': 'border-color',
  'borderRadius': 'border-radius',
  'boxShadow': 'box-shadow'
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
  mergeUtilityClasses,
  getResetCssPath,
  applyResetCss,
  applyBaseCSS,
  baseStyles,
  baseStylesToCss
}; 