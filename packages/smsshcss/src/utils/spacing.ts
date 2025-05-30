import { SpacingDirection, SpacingProperty, SizeConfig } from '../core/types';
import { defaultSpacingValues, escapeValue, formatCSSFunctionValue } from '../core/sizeConfig';

// 後方互換性のためのエイリアス
export type SpacingConfig = SizeConfig;
export const defaultSpacing: SpacingConfig = defaultSpacingValues;

const directionMap: Record<SpacingDirection, string> = {
  '': '',
  t: '-top',
  r: '-right',
  b: '-bottom',
  l: '-left',
  x: '-left',
  y: '-top',
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;

// カスタムスペーシングクラスを生成
function generateCustomSpacingClass(prefix: string, value: string): string | null {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  // gap プロパティの処理
  if (prefix === 'gap') {
    return `.gap-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`;
  }

  // gap-x (column-gap) プロパティの処理
  if (prefix === 'gap-x') {
    return `.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`;
  }

  // gap-y (row-gap) プロパティの処理
  if (prefix === 'gap-y') {
    return `.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`;
  }

  const property = prefix.startsWith('m') ? 'margin' : 'padding';
  const direction = prefix.slice(1); // 'm' or 'p' を除いた部分

  let cssProperty = property;

  switch (direction) {
    case 't':
      cssProperty = `${property}-top`;
      break;
    case 'r':
      cssProperty = `${property}-right`;
      break;
    case 'b':
      cssProperty = `${property}-bottom`;
      break;
    case 'l':
      cssProperty = `${property}-left`;
      break;
    case 'x':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`;
    case 'y':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`;
    case '':
      // 全方向
      break;
    default:
      return null;
  }

  return `.${prefix}-\\[${escapeValue(value)}\\] { ${cssProperty}: ${originalValue}; }`;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomSpacingClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomSpacingClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

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
    classes.push(`.gap-x-${size} { column-gap: ${value}; }`);
    classes.push(`.gap-y-${size} { row-gap: ${value}; }`);
  });

  // 任意の値のgapクラスを追加
  classes.push(`
/* Arbitrary gap values */
.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }
.gap-x-\\[\\$\\{value\\}\\] { column-gap: var(--value); }
.gap-y-\\[\\$\\{value\\}\\] { row-gap: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllSpacingClasses(customConfig?: SpacingConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultSpacing, ...customConfig } : defaultSpacing;

  return [
    generateSpacingClasses(config, 'margin'),
    generateSpacingClasses(config, 'padding'),
    generateGapClasses(config),
  ].join('\n\n');
}
