import { DisplayConfig } from '../core/types';

// Default display configuration
const defaultDisplay: DisplayConfig = {
  // Basic layout
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline flow-root', // More explicit form
  flex: 'block flex',
  'inline-flex': 'inline flex',
  grid: 'block grid',
  'inline-grid': 'inline grid',
  none: 'none',
  contents: 'contents',
  hidden: 'none', // Tailwind compatible hidden

  // Additional layout
  'flow-root': 'block flow-root', // Creates new block formatting context
  'list-item': 'block flow list-item', // Display as list item
  'inline-table': 'inline table', // Display as inline table
  table: 'block table', // Display as table
  'table-cell': 'table-cell', // Display as table cell
  'table-row': 'table-row', // Display as table row
  'table-caption': 'table-caption', // Display as table caption
};

export function generateDisplayClasses(): string {
  const classes: string[] = [];

  // Generate basic display classes
  Object.entries(defaultDisplay).forEach(([key, value]) => {
    classes.push(`.${key} { display: ${value}; }`);
  });

  return classes.join('\n');
}

/**
 * Extract custom display classes from HTML content
 * Display mainly uses predefined classes, so custom values are not currently supported
 */
export function extractCustomDisplayClasses(_content: string): string[] {
  // Display currently doesn't support custom values, so return empty array
  // If support for display-[custom-value] is needed in the future, implement here
  return [];
}
