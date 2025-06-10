import { FlexboxConfig } from '../../core/types';
import { escapeFlexValue } from './utils';

export const flexShrinkConfig: Partial<FlexboxConfig> = {
  shrink: '1',
  'shrink-0': '0',
};

export const flexShrinkPropertyMap: Record<string, string> = {
  shrink: 'flex-shrink',
  'shrink-0': 'flex-shrink',
};

export function generateCustomShrinkClass(value: string): string {
  return `.shrink-\\[${escapeFlexValue(value)}\\] { flex-shrink: ${value}; }`;
}

export function generateArbitraryShrink(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.shrink-\\[${escapedValue}\\] { flex-shrink: ${value}; }`;
}
