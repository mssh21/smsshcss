import { FlexboxConfig } from '../../core/types';
import { escapeFlexValue } from './utils';

export const flexMainConfig: Partial<FlexboxConfig> = {
  'flex-1': '1 1 0%',
  'flex-auto': '1 1 auto',
  'flex-initial': '0 1 auto',
  'flex-none': 'none',
};

export const flexMainPropertyMap: Record<string, string> = {
  'flex-1': 'flex',
  'flex-auto': 'flex',
  'flex-initial': 'flex',
  'flex-none': 'flex',
};

export function generateCustomFlexClass(value: string): string {
  return `.flex-\\[${escapeFlexValue(value)}\\] { flex: ${value}; }`;
}

export function generateArbitraryFlex(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.flex-\\[${escapedValue}\\] { flex: ${value}; }`;
}
