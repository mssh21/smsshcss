import { FlexboxConfig } from '../../core/types';

export const directionConfig: Partial<FlexboxConfig> = {
  'flex-row': 'row',
  'flex-row-reverse': 'row-reverse',
  'flex-col': 'column',
  'flex-col-reverse': 'column-reverse',
};

export const directionPropertyMap: Record<string, string> = {
  'flex-row': 'flex-direction',
  'flex-row-reverse': 'flex-direction',
  'flex-col': 'flex-direction',
  'flex-col-reverse': 'flex-direction',
};
