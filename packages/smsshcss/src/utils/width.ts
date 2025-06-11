import { SizeConfig } from '../core/types';
import { defaultSizeConfig, escapeValue, formatCSSFunctionValue } from '../core/sizeConfig';

// 後方互換性のためのエイリアス
export type WidthConfig = SizeConfig;
export const defaultWidth: WidthConfig = {
  ...defaultSizeConfig,
  screen: '100vw',
  svh: '100svw',
  lvh: '100lvw',
  dvw: '100dvw',
  cqw: '100cqw',
  cqi: '100cqi',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;

// カスタムWidthクラスを生成
function generateCustomWidthClass(prefix: string, value: string): string | null {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  // width プロパティの処理
  if (prefix === 'w') {
    return `.w-\\[${escapeValue(value)}\\] { width: ${originalValue}; }`;
  }

  // min-width プロパティの処理
  if (prefix === 'min-w') {
    return `.min-w-\\[${escapeValue(value)}\\] { min-width: ${originalValue}; }`;
  }

  // max-width プロパティの処理
  if (prefix === 'max-w') {
    return `.max-w-\\[${escapeValue(value)}\\] { max-width: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomWidthClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomWidthClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateCustomWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate classes for each width size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., w-md, min-w-md, max-w-md)
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  return classes.join('\n');
}

export function generateWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate width classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  // 任意の値のwidthクラスを追加
  classes.push(`
/* Arbitrary width values */
.w-\\[\\$\\{value\\}\\] { width: var(--value); }
.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }
.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllWidthClasses(): string {
  return [generateWidthClasses(defaultWidth), generateCustomWidthClasses(defaultWidth)].join(
    '\n\n'
  );
}
