/**
 * Grid utilities
 */
import { UtilityCategory } from '../types';

export const gridTemplateColumns: UtilityCategory = {
  'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr))',
  'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr))',
  'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr))',
  'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr))',
  'grid-cols-none': 'grid-template-columns: none'
};

export const gridTemplateRows: UtilityCategory = {
  'grid-rows-1': 'grid-template-rows: repeat(1, minmax(0, 1fr))',
  'grid-rows-2': 'grid-template-rows: repeat(2, minmax(0, 1fr))',
  'grid-rows-3': 'grid-template-rows: repeat(3, minmax(0, 1fr))',
  'grid-rows-4': 'grid-template-rows: repeat(4, minmax(0, 1fr))',
  'grid-rows-none': 'grid-template-rows: none'
};