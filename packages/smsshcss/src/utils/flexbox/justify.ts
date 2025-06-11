import { FlexboxConfig } from '../../core/types';

export const justifyConfig: Partial<FlexboxConfig> = {
  'justify-start': 'flex-start',
  'justify-end': 'flex-end',
  'justify-center': 'center',
  'justify-between': 'space-between',
  'justify-around': 'space-around',
  'justify-evenly': 'space-evenly',
};

export const justifyPropertyMap: Record<string, string> = {
  'justify-start': 'justify-content',
  'justify-end': 'justify-content',
  'justify-center': 'justify-content',
  'justify-between': 'justify-content',
  'justify-around': 'justify-content',
  'justify-evenly': 'justify-content',
};
