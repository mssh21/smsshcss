import { FlexboxConfig } from '../../core/types';
import { customValuePattern, normalValuePattern, escapeFlexValue } from './utils';
import { formatCSSFunctionValue } from '../../core/sizeConfig';

// 各プロパティの設定とマッピングをインポート
import {
  flexMainConfig,
  flexMainPropertyMap,
  generateCustomFlexClass,
  generateArbitraryFlex,
} from './flex';
import { flexGrowConfig, flexGrowPropertyMap, generateArbitraryGrow } from './grow';
import { flexShrinkConfig, flexShrinkPropertyMap, generateArbitraryShrink } from './shrink';
import { flexBasisConfig, flexBasisPropertyMap, generateArbitraryBasis } from './basis';
import { directionConfig, directionPropertyMap } from './direction';
import { wrapConfig, wrapPropertyMap } from './wrap';
import { justifyConfig, justifyPropertyMap } from './justify';
import { alignConfig, alignPropertyMap } from './align';

// 設定をマージ
export const flexConfig: Partial<FlexboxConfig> = {
  ...directionConfig,
  ...flexMainConfig,
  ...flexGrowConfig,
  ...flexShrinkConfig,
  ...flexBasisConfig,
  ...wrapConfig,
  ...justifyConfig,
  ...alignConfig,
};

// プロパティマッピングをマージ
export const flexPropertyMap: Record<string, string> = {
  ...directionPropertyMap,
  ...flexMainPropertyMap,
  ...flexGrowPropertyMap,
  ...flexShrinkPropertyMap,
  ...flexBasisPropertyMap,
  ...wrapPropertyMap,
  ...justifyPropertyMap,
  ...alignPropertyMap,
};

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomFlexClasses(content: string): string[] {
  const customClasses: string[] = [];

  // 角括弧付きの値を処理
  const bracketMatches = content.matchAll(customValuePattern);
  for (const match of bracketMatches) {
    const prefix = match[1];
    const value = match[2];
    const cssClass = generateCustomFlexClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  // 通常の値を処理
  const normalMatches = content.matchAll(normalValuePattern);
  for (const match of normalMatches) {
    const prefix = match[1];
    const value = match[2];
    // 通常の値も角括弧付きの値として処理
    const cssClass = generateCustomFlexClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  // 重複を除去
  return [...new Set(customClasses)];
}

// カスタムFlexboxクラスを生成
export function generateCustomFlexClass(prefix: string, value: string): string | null {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  switch (prefix) {
    case 'grow':
      return `.grow-\\[${escapeFlexValue(originalValue)}\\] { flex-grow: ${originalValue}; }`;
    case 'shrink':
      return `.shrink-\\[${escapeFlexValue(originalValue)}\\] { flex-shrink: ${originalValue}; }`;
    case 'flex':
      return `.flex-\\[${escapeFlexValue(originalValue)}\\] { flex: ${originalValue}; }`;
    case 'basis':
      return `.basis-\\[${escapeFlexValue(originalValue)}\\] { flex-basis: ${originalValue}; }`;
    default:
      return null;
  }
}

export function generateFlexboxClasses(customConfig?: FlexboxConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...flexConfig, ...customConfig } : flexConfig;

  const classes: string[] = [];

  // 基本的なFlexboxクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = flexPropertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  // 任意の値のFlexboxクラステンプレートを追加
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

// 各プロパティの生成関数をエクスポート
export {
  generateArbitraryFlex,
  generateArbitraryGrow,
  generateArbitraryShrink,
  generateArbitraryBasis,
};
