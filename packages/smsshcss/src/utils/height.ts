import { SizeConfig } from '../core/types';
import { defaultSizeConfig, escapeValue, formatCSSFunctionValue } from '../core/sizeConfig';

export type HeightConfig = SizeConfig;
export const defaultHeight: HeightConfig = {
  ...defaultSizeConfig,
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  cqw: '100cqh',
  cqi: '100cqb',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b(h|min-h|max-h)-\[([^\]]+)\]/g;

// カスタムHeightクラスを生成
function generateCustomHeightClass(prefix: string, value: string): string | null {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  // height プロパティの処理
  if (prefix === 'h') {
    return `.h-\\[${escapeValue(value)}\\] { height: ${originalValue}; }`;
  }

  // min-height プロパティの処理
  if (prefix === 'min-h') {
    return `.min-h-\\[${escapeValue(value)}\\] { min-height: ${originalValue}; }`;
  }

  // max-height プロパティの処理
  if (prefix === 'max-h') {
    return `.max-h-\\[${escapeValue(value)}\\] { max-height: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomHeightClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomHeightClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateCustomHeightClasses(config: HeightConfig = defaultHeight): string {
  const classes: string[] = [];

  // Generate classes for each height size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., h-md, min-h-md, max-h-md)
    classes.push(`.h-${size} { height: ${value}; }`);
    classes.push(`.min-h-${size} { min-height: ${value}; }`);
    classes.push(`.max-h-${size} { max-height: ${value}; }`);
  });

  return classes.join('\n');
}

export function generateHeightClasses(config: HeightConfig = defaultHeight): string {
  const classes: string[] = [];

  // Generate height classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.h-${size} { height: ${value}; }`);
    classes.push(`.min-h-${size} { min-height: ${value}; }`);
    classes.push(`.max-h-${size} { max-height: ${value}; }`);
  });

  // 任意の値のheightクラスを追加
  classes.push(`
/* Arbitrary height values */
.h-\\[\\$\\{value\\}\\] { height: var(--value); }
.min-h-\\[\\$\\{value\\}\\] { min-height: var(--value); }
.max-h-\\[\\$\\{value\\}\\] { max-height: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllHeightClasses(): string {
  return [generateHeightClasses(defaultHeight), generateCustomHeightClasses(defaultHeight)].join(
    '\n\n'
  );
}
