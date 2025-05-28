import { SpacingConfig, SpacingDirection, SpacingProperty } from '../core/types';

const defaultSpacing: SpacingConfig = {
  // 超小さいサイズ
  '2xs': '0.125rem',  // 2px
  xs: '0.25rem',      // 4px

  // 小さいサイズ（白銀比 1:1.414）
  sm: '0.5rem',       // 8px
  'sm+': '0.707rem',  // 11.3px (8px * 1.414)

  // 中間サイズ（黄金比 1:1.618）
  md: '1rem',         // 16px
  'md+': '1.618rem',  // 25.9px (16px * 1.618)

  // 大きいサイズ（白銀比）
  lg: '1.5rem',       // 24px
  'lg+': '2.121rem',  // 33.9px (24px * 1.414)

  // 特大サイズ（黄金比）
  xl: '2rem',         // 32px
  'xl+': '3.236rem',  // 51.8px (32px * 1.618)

  // 超大サイズ
  '2xl': '3rem',      // 48px
  '3xl': '4rem',      // 64px
  '4xl': '6rem',      // 96px
};

const directionMap: Record<SpacingDirection, string> = {
  '': '',
  t: '-top',
  r: '-right',
  b: '-bottom',
  l: '-left',
  x: '-left',
  y: '-top',
};

// 任意の値のパターンを検出する正規表現
const arbitraryValuePattern = /^\[(.*?)\]$/;

export function generateSpacingClasses(
  config: SpacingConfig = defaultSpacing,
  property: SpacingProperty = 'margin'
): string {
  const classes: string[] = [];

  // Generate classes for each spacing size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., m-md, p-md)
    classes.push(`.${property[0]}-${size} { ${property}: ${value}; }`);

    // Generate directional classes
    Object.entries(directionMap).forEach(([dir, suffix]) => {
      if (dir === 'x') {
        // Handle x direction (left and right)
        classes.push(
          `.${property[0]}x-${size} { ${property}-left: ${value}; ${property}-right: ${value}; }`
        );
      } else if (dir === 'y') {
        // Handle y direction (top and bottom)
        classes.push(
          `.${property[0]}y-${size} { ${property}-top: ${value}; ${property}-bottom: ${value}; }`
        );
      } else if (dir !== '') {
        // Handle individual directions
        classes.push(
          `.${property[0]}${dir}-${size} { ${property}${suffix}: ${value}; }`
        );
      }
    });
  });

  // 任意の値のクラスを生成
  const arbitraryValueTemplate = `
/* Arbitrary value classes */
.${property[0]}-\\[\\$\\{value\\}\\] { ${property}: var(--value); }
.${property[0]}t-\\[\\$\\{value\\}\\] { ${property}-top: var(--value); }
.${property[0]}r-\\[\\$\\{value\\}\\] { ${property}-right: var(--value); }
.${property[0]}b-\\[\\$\\{value\\}\\] { ${property}-bottom: var(--value); }
.${property[0]}l-\\[\\$\\{value\\}\\] { ${property}-left: var(--value); }
.${property[0]}x-\\[\\$\\{value\\}\\] { ${property}-left: var(--value); ${property}-right: var(--value); }
.${property[0]}y-\\[\\$\\{value\\}\\] { ${property}-top: var(--value); ${property}-bottom: var(--value); }
`;

  // 任意の値のクラステンプレートを追加
  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

export function generateGapClasses(config: SpacingConfig = defaultSpacing): string {
  const classes: string[] = [];

  // Generate gap classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.gap-${size} { gap: ${value}; }`);
  });

  // 任意の値のgapクラスを追加
  classes.push(`
/* Arbitrary gap value */
.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllSpacingClasses(config: SpacingConfig = defaultSpacing): string {
  return [
    generateSpacingClasses(config, 'margin'),
    generateSpacingClasses(config, 'padding'),
    generateGapClasses(config),
  ].join('\n\n');
} 