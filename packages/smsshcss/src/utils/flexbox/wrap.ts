import { FlexboxConfig } from '../../core/types';

export const wrapConfig: Partial<FlexboxConfig> = {
  'flex-wrap': 'wrap',
  'flex-wrap-reverse': 'wrap-reverse',
  'flex-nowrap': 'nowrap',
};

export const wrapPropertyMap: Record<string, string> = {
  'flex-wrap': 'flex-wrap',
  'flex-wrap-reverse': 'flex-wrap',
  'flex-nowrap': 'flex-wrap',
};
