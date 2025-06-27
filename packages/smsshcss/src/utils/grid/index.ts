import { GridConfig } from '../../core/types';
import { customValuePattern } from './utils';
import { defaultColumns, columnPropertyMap, generateCustomGridColsClass } from './columns';
import { defaultRows, rowPropertyMap, generateCustomGridRowsClass } from './rows';
import {
  defaultColumnSpan,
  columnSpanPropertyMap,
  generateCustomColumnSpanClass,
} from './column-span';
import { defaultRowSpan, rowSpanPropertyMap, generateCustomRowSpanClass } from './row-span';
import {
  defaultColumnPosition,
  columnPositionPropertyMap,
  generateCustomColumnStartClass,
  generateCustomColumnEndClass,
} from './column-position';
import {
  defaultRowPosition,
  rowPositionPropertyMap,
  generateCustomRowStartClass,
  generateCustomRowEndClass,
} from './row-position';
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

// function generateGridConfigFromTheme(theme: GridThemeConfig): GridConfig {
//   const config: GridConfig = {};

//   // カラム設定
//   if (theme.columns) {
//     Object.entries(theme.columns).forEach(([key, value]) => {
//       config[`grid-cols-${key}`] = value;
//     });
//   }

//   // 行設定
//   if (theme.rows) {
//     Object.entries(theme.rows).forEach(([key, value]) => {
//       config[`grid-rows-${key}`] = value;
//     });
//   }

//   // カラムスパン設定
//   if (theme.columnSpan) {
//     Object.entries(theme.columnSpan).forEach(([key, value]) => {
//       config[`col-span-${key}`] = value;
//     });
//   }

//   // 行スパン設定
//   if (theme.rowSpan) {
//     Object.entries(theme.rowSpan).forEach(([key, value]) => {
//       config[`row-span-${key}`] = value;
//     });
//   }

//   // カラム開始位置設定
//   if (theme.columnStart) {
//     Object.entries(theme.columnStart).forEach(([key, value]) => {
//       config[`col-start-${key}`] = value;
//     });
//   }

//   // カラム終了位置設定
//   if (theme.columnEnd) {
//     Object.entries(theme.columnEnd).forEach(([key, value]) => {
//       config[`col-end-${key}`] = value;
//     });
//   }

//   // 行開始位置設定
//   if (theme.rowStart) {
//     Object.entries(theme.rowStart).forEach(([key, value]) => {
//       config[`row-start-${key}`] = value;
//     });
//   }

//   // 行終了位置設定
//   if (theme.rowEnd) {
//     Object.entries(theme.rowEnd).forEach(([key, value]) => {
//       config[`row-end-${key}`] = value;
//     });
//   }

//   // 自動フロー設定
//   if (theme.autoFlow) {
//     Object.entries(theme.autoFlow).forEach(([key, value]) => {
//       config[`grid-flow-${key}`] = value;
//     });
//   }

//   return config;
// }

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

// カスタムGridクラスを生成
function generateCustomGridClass(prefix: string, value: string): string | null {
  switch (prefix) {
    case 'grid-cols':
      return generateCustomGridColsClass(value);
    case 'grid-rows':
      return generateCustomGridRowsClass(value);
    case 'col-span':
      return generateCustomColumnSpanClass(value);
    case 'row-span':
      return generateCustomRowSpanClass(value);
    case 'col-start':
      return generateCustomColumnStartClass(value);
    case 'col-end':
      return generateCustomColumnEndClass(value);
    case 'row-start':
      return generateCustomRowStartClass(value);
    case 'row-end':
      return generateCustomRowEndClass(value);
    default:
      return null;
  }
}

// Gridクラスを生成
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
.grid-cols-\\[\\$\\{value\\}\\] { grid-template-columns: repeat(var(--value), minmax(0, 1fr)); }
.grid-rows-\\[\\$\\{value\\}\\] { grid-template-rows: repeat(var(--value), minmax(0, 1fr)); }
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

// すべてのGridクラスを生成
export function generateAllGridClasses(): string {
  return generateGridClasses(defaultGrid);
}

// 各モジュールの関数をエクスポート
export * from './columns';
export * from './rows';
export * from './column-span';
export * from './row-span';
export * from './column-position';
export * from './row-position';
export * from './auto-flow';
export * from './utils';
