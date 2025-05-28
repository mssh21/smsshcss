import { SpacingConfig, SpacingDirection, SpacingProperty } from '../core/types';

const defaultSpacing: SpacingConfig = {
  // フィボナッチ数列ベースのスペーシング（基本単位: 4px = 0.25rem）
  // フィボナッチ数列の値を使用しつつ、直感的な命名を採用

  // 極小〜小サイズ
  '2xs': '0.25rem', // 4px  (フィボナッチ: 1)
  xs: '0.5rem', // 8px  (フィボナッチ: 2)
  sm: '0.75rem', // 12px (フィボナッチ: 3)

  // 中サイズ
  md: '1.25rem', // 20px (フィボナッチ: 5)
  lg: '2rem', // 32px (フィボナッチ: 8)

  // 大サイズ
  xl: '3.25rem', // 52px (フィボナッチ: 13)
  '2xl': '5.25rem', // 84px (フィボナッチ: 21)

  // 特大サイズ
  '3xl': '8.5rem', // 136px (フィボナッチ: 34)
  '4xl': '13.75rem', // 220px (フィボナッチ: 55)

  // 超大サイズ
  '5xl': '22.25rem', // 356px (フィボナッチ: 89)
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

// arbitraryValuePatternを削除または使用する
// const arbitraryValuePattern = /\[([^\]]+)\]/g;

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
        classes.push(`.${property[0]}${dir}-${size} { ${property}${suffix}: ${value}; }`);
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
