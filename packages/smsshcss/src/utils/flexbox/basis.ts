import { FlexboxConfig } from '../../core/types';
import { escapeFlexValue } from './utils';
import { defaultSizeConfig } from '../../core/sizeConfig';

export const flexBasisConfig: Partial<FlexboxConfig> = {
  ...Object.entries(defaultSizeConfig).reduce(
    (acc, [key, value]) => ({ ...acc, [`basis-${key}`]: value }),
    {}
  ),
};

export const flexBasisPropertyMap: Record<string, string> = {
  ...Object.keys(defaultSizeConfig).reduce(
    (acc, key) => ({ ...acc, [`basis-${key}`]: 'flex-basis' }),
    {}
  ),
};

export function generateCustomBasisClass(value: string): string {
  return `.basis-\\[${escapeFlexValue(value)}\\] { flex-basis: ${value}; }`;
}

export function generateArbitraryBasis(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.basis-\\[${escapedValue}\\] { flex-basis: ${value}; }`;
}
