import { FlexboxConfig } from '../core/types';

// Flexbox専用のエスケープ関数
function escapeFlexValue(val: string): string {
  // CSS数学関数およびCSS関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|var)\s*\(/;

  // CSS関数の場合は特別処理
  if (cssFunctions.test(val)) {
    return val.replace(/[()[\]{}+*/.\\%,]/g, '\\$&').replace(/\\-\\-/g, '--');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
}

// デフォルトのFlexbox設定
const defaultFlexbox: FlexboxConfig = {
  // Flex Direction
  'flex-row': 'row',
  'flex-row-reverse': 'row-reverse',
  'flex-col': 'column',
  'flex-col-reverse': 'column-reverse',

  // Flex Wrap
  'flex-wrap': 'wrap',
  'flex-wrap-reverse': 'wrap-reverse',
  'flex-nowrap': 'nowrap',

  // Justify Content
  'justify-start': 'flex-start',
  'justify-end': 'flex-end',
  'justify-center': 'center',
  'justify-between': 'space-between',
  'justify-around': 'space-around',
  'justify-evenly': 'space-evenly',

  // Align Items
  'items-start': 'flex-start',
  'items-end': 'flex-end',
  'items-center': 'center',
  'items-baseline': 'baseline',
  'items-stretch': 'stretch',

  // Align Content
  'content-start': 'flex-start',
  'content-end': 'flex-end',
  'content-center': 'center',
  'content-between': 'space-between',
  'content-around': 'space-around',
  'content-evenly': 'space-evenly',

  // Align Self
  'self-auto': 'auto',
  'self-start': 'flex-start',
  'self-end': 'flex-end',
  'self-center': 'center',
  'self-stretch': 'stretch',

  // Flex
  'flex-1': '1 1 0%',
  'flex-auto': '1 1 auto',
  'flex-initial': '0 1 auto',
  'flex-none': 'none',

  // Flex Grow
  grow: '1',
  'grow-0': '0',

  // Flex Shrink
  shrink: '1',
  'shrink-0': '0',

  // Flex Basis
  'basis-0': '0px',
  'basis-1': '0.25rem',
  'basis-2': '0.5rem',
  'basis-3': '0.75rem',
  'basis-4': '1rem',
  'basis-5': '1.25rem',
  'basis-6': '1.5rem',
  'basis-8': '2rem',
  'basis-10': '2.5rem',
  'basis-12': '3rem',
  'basis-16': '4rem',
  'basis-20': '5rem',
  'basis-24': '6rem',
  'basis-32': '8rem',
  'basis-40': '10rem',
  'basis-48': '12rem',
  'basis-56': '14rem',
  'basis-64': '16rem',
  'basis-auto': 'auto',
  'basis-px': '1px',
  'basis-0.5': '0.125rem',
  'basis-1.5': '0.375rem',
  'basis-2.5': '0.625rem',
  'basis-3.5': '0.875rem',
  'basis-1/2': '50%',
  'basis-1/3': '33.333333%',
  'basis-2/3': '66.666667%',
  'basis-1/4': '25%',
  'basis-2/4': '50%',
  'basis-3/4': '75%',
  'basis-1/5': '20%',
  'basis-2/5': '40%',
  'basis-3/5': '60%',
  'basis-4/5': '80%',
  'basis-1/6': '16.666667%',
  'basis-2/6': '33.333333%',
  'basis-3/6': '50%',
  'basis-4/6': '66.666667%',
  'basis-5/6': '83.333333%',
  'basis-1/12': '8.333333%',
  'basis-2/12': '16.666667%',
  'basis-3/12': '25%',
  'basis-4/12': '33.333333%',
  'basis-5/12': '41.666667%',
  'basis-6/12': '50%',
  'basis-7/12': '58.333333%',
  'basis-8/12': '66.666667%',
  'basis-9/12': '75%',
  'basis-10/12': '83.333333%',
  'basis-11/12': '91.666667%',
  'basis-full': '100%',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  'flex-row': 'flex-direction',
  'flex-row-reverse': 'flex-direction',
  'flex-col': 'flex-direction',
  'flex-col-reverse': 'flex-direction',

  'flex-wrap': 'flex-wrap',
  'flex-wrap-reverse': 'flex-wrap',
  'flex-nowrap': 'flex-wrap',

  'justify-start': 'justify-content',
  'justify-end': 'justify-content',
  'justify-center': 'justify-content',
  'justify-between': 'justify-content',
  'justify-around': 'justify-content',
  'justify-evenly': 'justify-content',

  'items-start': 'align-items',
  'items-end': 'align-items',
  'items-center': 'align-items',
  'items-baseline': 'align-items',
  'items-stretch': 'align-items',

  'content-start': 'align-content',
  'content-end': 'align-content',
  'content-center': 'align-content',
  'content-between': 'align-content',
  'content-around': 'align-content',
  'content-evenly': 'align-content',

  'self-auto': 'align-self',
  'self-start': 'align-self',
  'self-end': 'align-self',
  'self-center': 'align-self',
  'self-stretch': 'align-self',

  'flex-1': 'flex',
  'flex-auto': 'flex',
  'flex-initial': 'flex',
  'flex-none': 'flex',

  // Flex grow properties
  grow: 'flex-grow',
  'grow-0': 'flex-grow',

  // Flex shrink properties
  shrink: 'flex-shrink',
  'shrink-0': 'flex-shrink',

  // Flex basis properties
  ...Object.keys(defaultFlexbox)
    .filter((key) => key.startsWith('basis-'))
    .reduce((acc, key) => ({ ...acc, [key]: 'flex-basis' }), {}),
};

// カスタム値クラスを検出する正規表現（gap・order関連を除外）
const customValuePattern = /\b(grow|shrink|basis|flex)-\[([^\]]+)\]/g;

// カスタムFlexboxクラスを生成
function generateCustomFlexClass(prefix: string, value: string): string | null {
  // 元の値を復元（CSS値用）
  const originalValue = value;

  // flex-grow プロパティの処理
  if (prefix === 'grow') {
    return `.grow-\\[${escapeFlexValue(value)}\\] { flex-grow: ${originalValue}; }`;
  }

  // flex-shrink プロパティの処理
  if (prefix === 'shrink') {
    return `.shrink-\\[${escapeFlexValue(value)}\\] { flex-shrink: ${originalValue}; }`;
  }

  // flex-basis プロパティの処理
  if (prefix === 'basis') {
    return `.basis-\\[${escapeFlexValue(value)}\\] { flex-basis: ${originalValue}; }`;
  }

  // flex プロパティの処理
  if (prefix === 'flex') {
    return `.flex-\\[${escapeFlexValue(value)}\\] { flex: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomFlexClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomFlexClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateFlexboxClasses(customConfig?: FlexboxConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultFlexbox, ...customConfig } : defaultFlexbox;

  const classes: string[] = [];

  // 基本的なFlexboxクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  // 任意の値のFlexboxクラステンプレートを追加（gap・order関連を除外）
  const arbitraryValueTemplate = `
/* Arbitrary flex values */
.grow-\\[\\$\\{value\\}\\] { flex-grow: var(--value); }
.shrink-\\[\\$\\{value\\}\\] { flex-shrink: var(--value); }
.basis-\\[\\$\\{value\\}\\] { flex-basis: var(--value); }
.flex-\\[\\$\\{value\\}\\] { flex: var(--value); }
`;

  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

// 便利な関数群（gap・order関連を除外）

export function generateArbitraryFlex(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.flex-\\[${escapedValue}\\] { flex: ${value}; }`;
}

export function generateArbitraryGrow(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.grow-\\[${escapedValue}\\] { flex-grow: ${value}; }`;
}

export function generateArbitraryShrink(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.shrink-\\[${escapedValue}\\] { flex-shrink: ${value}; }`;
}

export function generateArbitraryBasis(value: string): string {
  const escapedValue = escapeFlexValue(value);
  return `.basis-\\[${escapedValue}\\] { flex-basis: ${value}; }`;
}
