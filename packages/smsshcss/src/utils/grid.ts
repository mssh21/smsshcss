import { GridConfig } from '../core/types';

// Grid専用のエスケープ関数
function escapeGridValue(val: string): string {
  // CSS数学関数およびGrid関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat)\s*\(/;

  // CSS関数の場合は特別処理（カンマもエスケープするが、--はエスケープしない）
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

// デフォルトのGrid設定
const defaultGrid: GridConfig = {
  // Grid Template Columns
  'grid-cols-1': 'repeat(1, minmax(0, 1fr))',
  'grid-cols-2': 'repeat(2, minmax(0, 1fr))',
  'grid-cols-3': 'repeat(3, minmax(0, 1fr))',
  'grid-cols-4': 'repeat(4, minmax(0, 1fr))',
  'grid-cols-5': 'repeat(5, minmax(0, 1fr))',
  'grid-cols-6': 'repeat(6, minmax(0, 1fr))',
  'grid-cols-7': 'repeat(7, minmax(0, 1fr))',
  'grid-cols-8': 'repeat(8, minmax(0, 1fr))',
  'grid-cols-9': 'repeat(9, minmax(0, 1fr))',
  'grid-cols-10': 'repeat(10, minmax(0, 1fr))',
  'grid-cols-11': 'repeat(11, minmax(0, 1fr))',
  'grid-cols-12': 'repeat(12, minmax(0, 1fr))',
  'grid-cols-none': 'none',
  'grid-cols-subgrid': 'subgrid',

  // Grid Template Rows
  'grid-rows-1': 'repeat(1, minmax(0, 1fr))',
  'grid-rows-2': 'repeat(2, minmax(0, 1fr))',
  'grid-rows-3': 'repeat(3, minmax(0, 1fr))',
  'grid-rows-4': 'repeat(4, minmax(0, 1fr))',
  'grid-rows-5': 'repeat(5, minmax(0, 1fr))',
  'grid-rows-6': 'repeat(6, minmax(0, 1fr))',
  'grid-rows-7': 'repeat(7, minmax(0, 1fr))',
  'grid-rows-8': 'repeat(8, minmax(0, 1fr))',
  'grid-rows-9': 'repeat(9, minmax(0, 1fr))',
  'grid-rows-10': 'repeat(10, minmax(0, 1fr))',
  'grid-rows-11': 'repeat(11, minmax(0, 1fr))',
  'grid-rows-12': 'repeat(12, minmax(0, 1fr))',
  'grid-rows-none': 'none',
  'grid-rows-subgrid': 'subgrid',

  // Grid Column Span
  'col-span-1': '1',
  'col-span-2': '2',
  'col-span-3': '3',
  'col-span-4': '4',
  'col-span-5': '5',
  'col-span-6': '6',
  'col-span-7': '7',
  'col-span-8': '8',
  'col-span-9': '9',
  'col-span-10': '10',
  'col-span-11': '11',
  'col-span-12': '12',
  'col-span-full': '1 / -1',

  // Grid Row Span
  'row-span-1': '1',
  'row-span-2': '2',
  'row-span-3': '3',
  'row-span-4': '4',
  'row-span-5': '5',
  'row-span-6': '6',
  'row-span-7': '7',
  'row-span-8': '8',
  'row-span-9': '9',
  'row-span-10': '10',
  'row-span-11': '11',
  'row-span-12': '12',
  'row-span-full': '1 / -1',

  // Grid Column Start
  'col-start-1': '1',
  'col-start-2': '2',
  'col-start-3': '3',
  'col-start-4': '4',
  'col-start-5': '5',
  'col-start-6': '6',
  'col-start-7': '7',
  'col-start-8': '8',
  'col-start-9': '9',
  'col-start-10': '10',
  'col-start-11': '11',
  'col-start-12': '12',
  'col-start-auto': 'auto',

  // Grid Column End
  'col-end-1': '1',
  'col-end-2': '2',
  'col-end-3': '3',
  'col-end-4': '4',
  'col-end-5': '5',
  'col-end-6': '6',
  'col-end-7': '7',
  'col-end-8': '8',
  'col-end-9': '9',
  'col-end-10': '10',
  'col-end-11': '11',
  'col-end-12': '12',
  'col-end-auto': 'auto',

  // Grid Row Start
  'row-start-1': '1',
  'row-start-2': '2',
  'row-start-3': '3',
  'row-start-4': '4',
  'row-start-5': '5',
  'row-start-6': '6',
  'row-start-7': '7',
  'row-start-8': '8',
  'row-start-9': '9',
  'row-start-10': '10',
  'row-start-11': '11',
  'row-start-12': '12',
  'row-start-auto': 'auto',

  // Grid Row End
  'row-end-1': '1',
  'row-end-2': '2',
  'row-end-3': '3',
  'row-end-4': '4',
  'row-end-5': '5',
  'row-end-6': '6',
  'row-end-7': '7',
  'row-end-8': '8',
  'row-end-9': '9',
  'row-end-10': '10',
  'row-end-11': '11',
  'row-end-12': '12',
  'row-end-auto': 'auto',

  // Grid Auto Flow
  'grid-flow-row': 'row',
  'grid-flow-col': 'column',
  'grid-flow-dense': 'dense',
  'grid-flow-row-dense': 'row dense',
  'grid-flow-col-dense': 'column dense',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  // Grid Template Columns
  'grid-cols-1': 'grid-template-columns',
  'grid-cols-2': 'grid-template-columns',
  'grid-cols-3': 'grid-template-columns',
  'grid-cols-4': 'grid-template-columns',
  'grid-cols-5': 'grid-template-columns',
  'grid-cols-6': 'grid-template-columns',
  'grid-cols-7': 'grid-template-columns',
  'grid-cols-8': 'grid-template-columns',
  'grid-cols-9': 'grid-template-columns',
  'grid-cols-10': 'grid-template-columns',
  'grid-cols-11': 'grid-template-columns',
  'grid-cols-12': 'grid-template-columns',
  'grid-cols-none': 'grid-template-columns',
  'grid-cols-subgrid': 'grid-template-columns',

  // Grid Template Rows
  'grid-rows-1': 'grid-template-rows',
  'grid-rows-2': 'grid-template-rows',
  'grid-rows-3': 'grid-template-rows',
  'grid-rows-4': 'grid-template-rows',
  'grid-rows-5': 'grid-template-rows',
  'grid-rows-6': 'grid-template-rows',
  'grid-rows-7': 'grid-template-rows',
  'grid-rows-8': 'grid-template-rows',
  'grid-rows-9': 'grid-template-rows',
  'grid-rows-10': 'grid-template-rows',
  'grid-rows-11': 'grid-template-rows',
  'grid-rows-12': 'grid-template-rows',
  'grid-rows-none': 'grid-template-rows',
  'grid-rows-subgrid': 'grid-template-rows',

  // Grid Column Span
  'col-span-1': 'grid-column',
  'col-span-2': 'grid-column',
  'col-span-3': 'grid-column',
  'col-span-4': 'grid-column',
  'col-span-5': 'grid-column',
  'col-span-6': 'grid-column',
  'col-span-7': 'grid-column',
  'col-span-8': 'grid-column',
  'col-span-9': 'grid-column',
  'col-span-10': 'grid-column',
  'col-span-11': 'grid-column',
  'col-span-12': 'grid-column',
  'col-span-full': 'grid-column',

  // Grid Row Span
  'row-span-1': 'grid-row',
  'row-span-2': 'grid-row',
  'row-span-3': 'grid-row',
  'row-span-4': 'grid-row',
  'row-span-5': 'grid-row',
  'row-span-6': 'grid-row',
  'row-span-7': 'grid-row',
  'row-span-8': 'grid-row',
  'row-span-9': 'grid-row',
  'row-span-10': 'grid-row',
  'row-span-11': 'grid-row',
  'row-span-12': 'grid-row',
  'row-span-full': 'grid-row',

  // Grid Column Start
  'col-start-1': 'grid-column-start',
  'col-start-2': 'grid-column-start',
  'col-start-3': 'grid-column-start',
  'col-start-4': 'grid-column-start',
  'col-start-5': 'grid-column-start',
  'col-start-6': 'grid-column-start',
  'col-start-7': 'grid-column-start',
  'col-start-8': 'grid-column-start',
  'col-start-9': 'grid-column-start',
  'col-start-10': 'grid-column-start',
  'col-start-11': 'grid-column-start',
  'col-start-12': 'grid-column-start',
  'col-start-13': 'grid-column-start',
  'col-start-auto': 'grid-column-start',

  // Grid Column End
  'col-end-1': 'grid-column-end',
  'col-end-2': 'grid-column-end',
  'col-end-3': 'grid-column-end',
  'col-end-4': 'grid-column-end',
  'col-end-5': 'grid-column-end',
  'col-end-6': 'grid-column-end',
  'col-end-7': 'grid-column-end',
  'col-end-8': 'grid-column-end',
  'col-end-9': 'grid-column-end',
  'col-end-10': 'grid-column-end',
  'col-end-11': 'grid-column-end',
  'col-end-12': 'grid-column-end',
  'col-end-13': 'grid-column-end',
  'col-end-auto': 'grid-column-end',

  // Grid Row Start
  'row-start-1': 'grid-row-start',
  'row-start-2': 'grid-row-start',
  'row-start-3': 'grid-row-start',
  'row-start-4': 'grid-row-start',
  'row-start-5': 'grid-row-start',
  'row-start-6': 'grid-row-start',
  'row-start-7': 'grid-row-start',
  'row-start-8': 'grid-row-start',
  'row-start-9': 'grid-row-start',
  'row-start-10': 'grid-row-start',
  'row-start-11': 'grid-row-start',
  'row-start-12': 'grid-row-start',
  'row-start-auto': 'grid-row-start',

  // Grid Row End
  'row-end-1': 'grid-row-end',
  'row-end-2': 'grid-row-end',
  'row-end-3': 'grid-row-end',
  'row-end-4': 'grid-row-end',
  'row-end-5': 'grid-row-end',
  'row-end-6': 'grid-row-end',
  'row-end-7': 'grid-row-end',
  'row-end-8': 'grid-row-end',
  'row-end-9': 'grid-row-end',
  'row-end-10': 'grid-row-end',
  'row-end-11': 'grid-row-end',
  'row-end-12': 'grid-row-end',
  'row-end-auto': 'grid-row-end',

  // Grid Auto Flow
  'grid-flow-row': 'grid-auto-flow',
  'grid-flow-col': 'grid-auto-flow',
  'grid-flow-dense': 'grid-auto-flow',
  'grid-flow-row-dense': 'grid-auto-flow',
  'grid-flow-col-dense': 'grid-auto-flow',
};

// カスタム値クラスを検出する正規表現
const customValuePattern =
  /\b(grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end)-\[([^\]]+)\]/g;

// Grid専用のCSS関数フォーマット処理
function formatGridCSSValue(input: string): string {
  // CSS関数を再帰的に処理しつつ、Grid値のカンマ区切りを適切に処理
  let formatted = input;

  // CSS関数をプレースホルダーに置き換えて一時的に保護
  const functionPlaceholders: string[] = [];
  let placeholderIndex = 0;

  formatted = formatted.replace(
    /(calc|min|max|clamp|minmax|repeat)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 関数内の演算子を適切にフォーマット
      const formattedInner = inner
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s*,\s*/g, ', ')
        .replace(
          /\s*([+\-*/])\s*/g,
          (match: string, operator: string, offset: number, str: string) => {
            if (operator === '-') {
              const beforeMatch = str.substring(0, offset);
              const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
              const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';
              if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/]/.test(prevChar)) {
                return '-';
              }
            }
            return ` ${operator} `;
          }
        );

      const placeholder = `__FUNC_${placeholderIndex++}__`;
      functionPlaceholders.push(`${funcName}(${formattedInner})`);
      return placeholder;
    }
  );

  // Grid値間のカンマをスペースに変換
  formatted = formatted.replace(/,/g, ' ');

  // プレースホルダーを元の関数に戻す
  functionPlaceholders.forEach((func, index) => {
    formatted = formatted.replace(`__FUNC_${index}__`, func);
  });

  return formatted;
}

// カスタムGridクラスを生成
function generateCustomGridClass(prefix: string, value: string): string | null {
  // CSS数学関数およびグリッド固有関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat|var)\s*\(/;

  // 元の値を復元（CSS値用）- CSS関数が含まれている場合は専用フォーマット処理
  const originalValue = cssFunctions.test(value) ? formatGridCSSValue(value) : value;

  // grid-template-columns プロパティの処理
  if (prefix === 'grid-cols') {
    // 数値の場合はrepeat関数を使用、それ以外はカンマをスペースに変換
    const isNumeric = /^\d+$/.test(value);
    const isCSSVariable = /^var\(--/.test(value);
    let cssValue;
    if (isNumeric || isCSSVariable) {
      cssValue = `repeat(${originalValue}, minmax(0, 1fr))`;
    } else if (cssFunctions.test(value)) {
      // CSS関数が含まれている場合は、既にフォーマット済みのoriginalValueを使用
      cssValue = originalValue;
    } else {
      // 通常の値の場合のみカンマをスペースに変換
      cssValue = originalValue.replace(/,/g, ' ');
    }
    return `.grid-cols-\\[${escapeGridValue(value)}\\] { grid-template-columns: ${cssValue}; }`;
  }

  // grid-template-rows プロパティの処理
  if (prefix === 'grid-rows') {
    // 数値の場合はrepeat関数を使用、それ以外はカンマをスペースに変換
    const isNumeric = /^\d+$/.test(value);
    const isCSSVariable = /^var\(--/.test(value);
    let cssValue;
    if (isNumeric || isCSSVariable) {
      cssValue = `repeat(${originalValue}, minmax(0, 1fr))`;
    } else if (cssFunctions.test(value)) {
      // CSS関数が含まれている場合は、既にフォーマット済みのoriginalValueを使用
      cssValue = originalValue;
    } else {
      // 通常の値の場合のみカンマをスペースに変換
      cssValue = originalValue.replace(/,/g, ' ');
    }
    return `.grid-rows-\\[${escapeGridValue(value)}\\] { grid-template-rows: ${cssValue}; }`;
  }

  // grid-column プロパティの処理（col-span）
  if (prefix === 'col-span') {
    return `.col-span-\\[${escapeGridValue(value)}\\] { grid-column: span ${originalValue} / span ${originalValue}; }`;
  }

  // grid-row プロパティの処理（row-span）
  if (prefix === 'row-span') {
    return `.row-span-\\[${escapeGridValue(value)}\\] { grid-row: span ${originalValue} / span ${originalValue}; }`;
  }

  // grid-column-start プロパティの処理
  if (prefix === 'col-start') {
    return `.col-start-\\[${escapeGridValue(value)}\\] { grid-column-start: ${originalValue}; }`;
  }

  // grid-column-end プロパティの処理
  if (prefix === 'col-end') {
    return `.col-end-\\[${escapeGridValue(value)}\\] { grid-column-end: ${originalValue}; }`;
  }

  // grid-row-start プロパティの処理
  if (prefix === 'row-start') {
    return `.row-start-\\[${escapeGridValue(value)}\\] { grid-row-start: ${originalValue}; }`;
  }

  // grid-row-end プロパティの処理
  if (prefix === 'row-end') {
    return `.row-end-\\[${escapeGridValue(value)}\\] { grid-row-end: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomGridClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomGridClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateGridClasses(customConfig?: GridConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultGrid, ...customConfig } : defaultGrid;

  const classes: string[] = [];

  // 基本的なGridクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  // 任意の値のGridクラステンプレートを追加
  const arbitraryValueTemplate = `
/* Arbitrary grid values */
.grid-cols-\\[\\$\\{value\\}\\] { grid-template-columns: var(--value); }
.grid-rows-\\[\\$\\{value\\}\\] { grid-template-rows: var(--value); }
.col-span-\\[\\$\\{value\\}\\] { grid-column: span var(--value) / span var(--value); }
.row-span-\\[\\$\\{value\\}\\] { grid-row: span var(--value) / span var(--value); }
.col-start-\\[\\$\\{value\\}\\] { grid-column-start: var(--value); }
.col-end-\\[\\$\\{value\\}\\] { grid-column-end: var(--value); }
.row-start-\\[\\$\\{value\\}\\] { grid-row-start: var(--value); }
.row-end-\\[\\$\\{value\\}\\] { grid-row-end: var(--value); }
`;

  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

// Subgrid サポート関数
export function generateSubgridClasses(): string {
  return `
.subgrid-cols {
  display: subgrid;
  grid-template-columns: subgrid;
}

.subgrid-rows {
  display: subgrid;
  grid-template-rows: subgrid;
}

.subgrid-both {
  display: subgrid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
`;
}

// 便利な関数群
export function generateArbitraryGridCols(value: string): string {
  const isNumeric = /^\d+$/.test(value);
  const isCSSVariable = /^var\(--/.test(value);
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat|var)\s*\(/;

  let cssValue;
  if (isNumeric || isCSSVariable) {
    cssValue = `repeat(${value}, minmax(0, 1fr))`;
  } else if (cssFunctions.test(value)) {
    // CSS関数が含まれている場合は、formatGridCSSValueで処理
    cssValue = formatGridCSSValue(value);
  } else {
    // 通常の値の場合のみカンマをスペースに変換
    cssValue = value.replace(/,/g, ' ');
  }

  const escapedValue = escapeGridValue(value);
  return `.grid-cols-\\[${escapedValue}\\] { grid-template-columns: ${cssValue}; }`;
}

export function generateArbitraryGridRows(value: string): string {
  const isNumeric = /^\d+$/.test(value);
  const isCSSVariable = /^var\(--/.test(value);
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat|var)\s*\(/;

  let cssValue;
  if (isNumeric || isCSSVariable) {
    cssValue = `repeat(${value}, minmax(0, 1fr))`;
  } else if (cssFunctions.test(value)) {
    // CSS関数が含まれている場合は、formatGridCSSValueで処理
    cssValue = formatGridCSSValue(value);
  } else {
    // 通常の値の場合のみカンマをスペースに変換
    cssValue = value.replace(/,/g, ' ');
  }

  const escapedValue = escapeGridValue(value);
  return `.grid-rows-\\[${escapedValue}\\] { grid-template-rows: ${cssValue}; }`;
}

export function generateArbitraryColSpan(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.col-span-\\[${escapedValue}\\] { grid-column: span ${value} / span ${value}; }`;
}

export function generateArbitraryRowSpan(value: string): string {
  const escapedValue = escapeGridValue(value);
  return `.row-span-\\[${escapedValue}\\] { grid-row: span ${value} / span ${value}; }`;
}
