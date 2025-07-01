import { SizeConfig } from '../core/types';

/**
 * Grid size configuration
 * Define values for Grid columns/rows
 */
export const defaultGridConfig: SizeConfig = {
  none: '0',
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  '7': 'repeat(7, minmax(0, 1fr))',
  '8': 'repeat(8, minmax(0, 1fr))',
  '9': 'repeat(9, minmax(0, 1fr))',
  '10': 'repeat(10, minmax(0, 1fr))',
  '11': 'repeat(11, minmax(0, 1fr))',
  '12': 'repeat(12, minmax(0, 1fr))',
  subgrid: 'subgrid',
};

/**
 * Helper function to process custom Grid class values
 * @param size - Grid size value
 * @returns Grid template value or null
 */
export function getGridValueFromConfig(size: string): string | null {
  if (!size) return null;

  // Check values in config file
  if (defaultGridConfig[size]) {
    return defaultGridConfig[size];
  }

  // If numeric, wrap with repeat()
  if (/^\d+$/.test(size)) {
    return `repeat(${size}, minmax(0, 1fr))`;
  }

  // For custom values ([value] format)
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // If numeric
    if (/^\d+$/.test(customValue)) {
      return `repeat(${customValue}, minmax(0, 1fr))`;
    }

    // For comma-separated template values, convert commas to spaces
    if (customValue.includes(',')) {
      customValue = customValue.replace(/,/g, ' ');
    }

    return customValue;
  }

  return null;
}
