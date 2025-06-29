import { FlexboxConfig } from '../../core/types';

export const alignConfig: Partial<FlexboxConfig> = {
  // Align Items
  'items-start': 'flex-start',
  'items-end': 'flex-end',
  'items-center': 'center',
  'items-baseline': 'baseline',
  'items-stretch': 'stretch',

  // Align Content
  'content-start': 'flex-start',
  'content-end': 'flex-end',
  'content-center': 'center',
  'content-between': 'space-between',
  'content-around': 'space-around',
  'content-evenly': 'space-evenly',

  // Align Self
  'self-auto': 'auto',
  'self-start': 'flex-start',
  'self-end': 'flex-end',
  'self-center': 'center',
  'self-stretch': 'stretch',
  'self-baseline': 'baseline',
};

export const alignPropertyMap: Record<string, string> = {
  // Align Items
  'items-start': 'align-items',
  'items-end': 'align-items',
  'items-center': 'align-items',
  'items-baseline': 'align-items',
  'items-stretch': 'align-items',

  // Align Content
  'content-start': 'align-content',
  'content-end': 'align-content',
  'content-center': 'align-content',
  'content-between': 'align-content',
  'content-around': 'align-content',
  'content-evenly': 'align-content',

  // Align Self
  'self-auto': 'align-self',
  'self-start': 'align-self',
  'self-end': 'align-self',
  'self-center': 'align-self',
  'self-stretch': 'align-self',
  'self-baseline': 'align-self',
};
