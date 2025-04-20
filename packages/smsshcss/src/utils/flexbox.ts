/**
 * Flexbox utilities
 */
import { UtilityCategory } from '../types';

export const flex: UtilityCategory = {
  'flex-1': 'flex: 1 1 0%',
  'flex-auto': 'flex: 1 1 auto',
  'flex-initial': 'flex: 0 1 auto',
  'flex-none': 'flex: none'
};

export const flexDirection: UtilityCategory = {
  'flex-row': 'flex-direction: row',
  'flex-row-reverse': 'flex-direction: row-reverse',
  'flex-col': 'flex-direction: column',
  'flex-col-reverse': 'flex-direction: column-reverse'
};

export const flexWrap: UtilityCategory = {
  'flex-wrap': 'flex-wrap: wrap',
  'flex-nowrap': 'flex-wrap: nowrap',
  'flex-wrap-reverse': 'flex-wrap: wrap-reverse'
};

export const justifyContent: UtilityCategory = {
  'justify-start': 'justify-content: flex-start',
  'justify-end': 'justify-content: flex-end',
  'justify-center': 'justify-content: center',
  'justify-between': 'justify-content: space-between',
  'justify-around': 'justify-content: space-around',
  'justify-evenly': 'justify-content: space-evenly'
};

export const alignItems: UtilityCategory = {
  'items-start': 'align-items: flex-start',
  'items-end': 'align-items: flex-end',
  'items-center': 'align-items: center',
  'items-baseline': 'align-items: baseline',
  'items-stretch': 'align-items: stretch'
};

export const alignSelf: UtilityCategory = {
  'self-auto': 'align-self: auto',
  'self-start': 'align-self: flex-start',
  'self-end': 'align-self: flex-end',
  'self-center': 'align-self: center',
  'self-stretch': 'align-self: stretch'
}; 