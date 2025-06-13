import { FlexboxConfig } from '../../core/types';
import { escapeFlexValue } from './utils';

export const flexGrowConfig: Partial<FlexboxConfig> = {
  grow: '1',
};

export const flexGrowPropertyMap: Record<string, string> = {
  grow: 'flex-grow',
};

export function generateCustomGrowClass(value: string): string {
  return `.grow-\\[${escapeFlexValue(value)}\\] { flex-grow: ${value}; }`;
}

export function generateArbitraryGrow(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.grow-\\[${escapedValue}\\] { flex-grow: ${value}; }`;
}
