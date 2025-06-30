import { GridConfig } from '../../core/types';
import { defaultColumns, columnPropertyMap } from './columns';
import { defaultRows, rowPropertyMap } from './rows';
import { defaultColumnSpan, columnSpanPropertyMap } from './column-span';
import { defaultRowSpan, rowSpanPropertyMap } from './row-span';
import { defaultColumnPosition, columnPositionPropertyMap } from './column-position';
import { defaultRowPosition, rowPositionPropertyMap } from './row-position';
import { defaultAutoFlow, autoFlowPropertyMap } from './auto-flow';

// デフォルトのGrid設定をマージ
const defaultGrid: GridConfig = {
  ...defaultColumns,
  ...defaultRows,
  ...defaultColumnSpan,
  ...defaultRowSpan,
  ...defaultColumnPosition,
  ...defaultRowPosition,
  ...defaultAutoFlow,
};

// プロパティマッピングをマージ
const propertyMap: Record<string, string> = {
  ...columnPropertyMap,
  ...rowPropertyMap,
  ...columnSpanPropertyMap,
  ...rowSpanPropertyMap,
  ...columnPositionPropertyMap,
  ...rowPositionPropertyMap,
  ...autoFlowPropertyMap,
};

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomGridClasses(content: string): string[] {
  // グリッド関連のカスタム値パターン
  const gridPatterns = [
    /\bgrid-cols-\[([^\]]+)\]/g,
    /\bgrid-rows-\[([^\]]+)\]/g,
    /\bcol-span-\[([^\]]+)\]/g,
    /\brow-span-\[([^\]]+)\]/g,
    /\bcol-start-\[([^\]]+)\]/g,
    /\bcol-end-\[([^\]]+)\]/g,
    /\brow-start-\[([^\]]+)\]/g,
    /\brow-end-\[([^\]]+)\]/g,
  ];

  const customClasses: string[] = [];

  for (const pattern of gridPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const fullClass = match[0]; // 完全なクラス名 (例: grid-cols-[80])
      const prefix = fullClass.split('-[')[0]; // プレフィックス (例: grid-cols)
      const value = match[1]; // カスタム値 (例: 80)

      // CSSクラスを生成
      const cssClass = generateCustomGridClass(prefix, value);
      if (cssClass) {
        customClasses.push(cssClass);
      }
    }
  }

  return customClasses;
}

// カスタムグリッドクラスを生成
function generateCustomGridClass(prefix: string, value: string): string | null {
  let cssProperty: string;
  let processedValue = value;

  // プレフィックスに基づいてCSSプロパティを決定
  switch (prefix) {
    case 'grid-cols':
      cssProperty = 'grid-template-columns';
      if (!isNaN(Number(value))) {
        processedValue = `repeat(${value}, minmax(0, 1fr))`;
      } else if (value.includes(',')) {
        processedValue = value.replace(/,/g, ' ');
      } else if (value.includes('var(')) {
        processedValue = `repeat(${value}, minmax(0, 1fr))`;
      }
      break;
    case 'grid-rows':
      cssProperty = 'grid-template-rows';
      if (!isNaN(Number(value))) {
        processedValue = `repeat(${value}, minmax(0, 1fr))`;
      } else if (value.includes(',')) {
        processedValue = value.replace(/,/g, ' ');
      } else if (value.includes('var(')) {
        processedValue = `repeat(${value}, minmax(0, 1fr))`;
      }
      break;
    case 'col-span':
      cssProperty = 'grid-column';
      if (!isNaN(Number(value))) {
        processedValue = `span ${value} / span ${value}`;
      } else if (value.includes('var(')) {
        processedValue = `span ${value} / span ${value}`;
      }
      break;
    case 'row-span':
      cssProperty = 'grid-row';
      if (!isNaN(Number(value))) {
        processedValue = `span ${value} / span ${value}`;
      } else if (value.includes('var(')) {
        processedValue = `span ${value} / span ${value}`;
      }
      break;
    case 'col-start':
      cssProperty = 'grid-column-start';
      break;
    case 'col-end':
      cssProperty = 'grid-column-end';
      break;
    case 'row-start':
      cssProperty = 'grid-row-start';
      break;
    case 'row-end':
      cssProperty = 'grid-row-end';
      break;
    default:
      return null;
  }

  // CSS値をエスケープ
  const escapedValue = value.replace(/[()[\]{}.*+?^$|\\]/g, '\\$&');

  return `.${prefix}-\\[${escapedValue}\\] { ${cssProperty}: ${processedValue}; }`;
}

// すべてのグリッドクラスを生成
export function generateAllGridClasses(): string {
  let css = '';

  // デフォルトのグリッドクラスを生成
  Object.entries(defaultGrid).forEach(([className, value]) => {
    if (value) {
      css += `.${className} { ${propertyMap[className] || 'display'}: ${value}; }\n`;
    }
  });

  // 任意値テンプレートクラスを追加
  css += generateArbitraryValueTemplates();

  return css;
}

// 任意値テンプレートクラスを生成
function generateArbitraryValueTemplates(): string {
  return `
.grid-cols-\\[\\$\\{value\\}\\] { grid-template-columns: repeat(var(--value), minmax(0, 1fr)); }
.grid-rows-\\[\\$\\{value\\}\\] { grid-template-rows: repeat(var(--value), minmax(0, 1fr)); }
.col-span-\\[\\$\\{value\\}\\] { grid-column: span var(--value) / span var(--value); }
.row-span-\\[\\$\\{value\\}\\] { grid-row: span var(--value) / span var(--value); }
.col-start-\\[\\$\\{value\\}\\] { grid-column-start: var(--value); }
.col-end-\\[\\$\\{value\\}\\] { grid-column-end: var(--value); }
.row-start-\\[\\$\\{value\\}\\] { grid-row-start: var(--value); }
.row-end-\\[\\$\\{value\\}\\] { grid-row-end: var(--value); }
`;
}

// テストで期待される関数名でエイリアス
export function generateGridClasses(_customConfig?: Record<string, string>): string {
  return generateAllGridClasses();
}

// Subgridクラスを生成
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

// グリッド関連のデフォルト設定とユーティリティをエクスポート
export { defaultGrid, propertyMap };
export * from './columns';
export * from './rows';
export * from './column-span';
export * from './row-span';
export * from './column-position';
export * from './row-position';
export * from './auto-flow';
export * from './utils';
