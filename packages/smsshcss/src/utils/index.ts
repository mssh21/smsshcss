import { generateDisplayClasses } from './display';
import { generateAllSpacingClasses, extractCustomSpacingClasses } from './spacing';
import { generateFlexboxClasses, extractCustomFlexClasses } from './flexbox';
import { generatePositioningClasses } from './positioning';
import { generateZIndexClasses, extractCustomZIndexClasses } from './z-index';
import { generateOverflowClasses } from './overflow';
import { generateOrderClasses, extractCustomOrderClasses } from './order';
import { generateGridClasses, extractCustomGridClasses } from './grid';
import { generateAllWidthClasses, extractCustomWidthClasses } from './width';
import { generateAllHeightClasses, extractCustomHeightClasses } from './height';
import { generateAllColorClasses, extractCustomColorClasses } from './color';
import { formatCSSFunctionValue } from '../core/sizeConfig';
import { formatColorFunctionValue } from '../core/colorConfig';

// Reset CSS の内容を直接定義
const RESET_CSS = `/* Reset CSS */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}`;

// Base CSS の内容を直接定義
const BASE_CSS = `/* Base CSS */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --color-light: #f8f9fa;
  --color-dark: #343a40;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  color: var(--color-dark);
  background-color: #fff;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

button,
input,
optgroup,
select,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button {
  cursor: pointer;
}

code {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
  color: var(--color-danger);
  background-color: var(--color-light);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}`;

// CSSファイルの内容を読み込む
export function getResetCss(): string {
  return RESET_CSS;
}

export function getBaseCss(): string {
  return BASE_CSS;
}

// ユーティリティクラスの生成
export function createUtilityClass(name: string, value: string): string {
  return `.${name} { ${value} }`;
}

export function createUtilityClasses(classes: Record<string, string>): string {
  return Object.entries(classes)
    .map(([name, value]) => createUtilityClass(name, value))
    .join('\n');
}

// ユーティリティクラスのマージ
export function mergeUtilityClasses(...classes: string[]): string {
  return classes.join('\n');
}

// リセットCSSの適用
export function applyResetCss(css: string): string {
  return `${getResetCss()}\n${css}`;
}

// ベースCSSの適用
export function applyBaseCss(css: string): string {
  return `${getBaseCss()}\n${css}`;
}

/**
 * ユーティリティクラス生成のためのベーステンプレート
 */
export interface UtilityTemplate {
  /** クラス名のプレフィックス（例: 'm', 'p', 'text'） */
  prefix: string;
  /** CSSプロパティ名（例: 'margin', 'color'） */
  property: string;
  /** 方向性のあるプロパティかどうか */
  hasDirections?: boolean;
  /** カスタム値のサポート */
  supportsArbitraryValues?: boolean;
  /** 値の変換関数 */
  valueTransform?: (value: string) => string;
}

/**
 * 方向指定のマッピング
 */
export const directionMappings = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
  x: ['left', 'right'],
  y: ['top', 'bottom'],
} as const;

/**
 * 汎用的なユーティリティクラス生成関数
 */
export function generateUtilityClasses(
  template: UtilityTemplate,
  config: Record<string, string> = {},
  options: {
    includeArbitraryValues?: boolean;
    customDirections?: typeof directionMappings;
  } = {}
): string {
  const classes: string[] = [];
  const { prefix, property, hasDirections = false, supportsArbitraryValues = true } = template;
  const { includeArbitraryValues = true, customDirections = directionMappings } = options;

  // 基本クラスの生成
  Object.entries(config).forEach(([size, value]) => {
    const processedValue = template.valueTransform ? template.valueTransform(value) : value;

    // ベースクラス (例: m-md, text-lg)
    classes.push(`.${prefix}-${size} { ${property}: ${processedValue}; }`);

    // 方向指定クラスの生成
    if (hasDirections) {
      Object.entries(customDirections).forEach(([dir, suffix]) => {
        if (Array.isArray(suffix)) {
          // x, y方向の場合
          const properties = suffix.map((s) => `${property}-${s}: ${processedValue}`).join('; ');
          classes.push(`.${prefix}${dir}-${size} { ${properties}; }`);
        } else {
          // 単一方向の場合
          classes.push(`.${prefix}${dir}-${size} { ${property}-${suffix}: ${processedValue}; }`);
        }
      });
    }
  });

  // 任意値サポートの追加
  if (includeArbitraryValues && supportsArbitraryValues) {
    classes.push('');
    classes.push('/* Arbitrary value support */');
    classes.push(`.${prefix}-\\[\\$\\{value\\}\\] { ${property}: var(--value); }`);

    if (hasDirections) {
      Object.entries(customDirections).forEach(([dir, suffix]) => {
        if (Array.isArray(suffix)) {
          const properties = suffix.map((s) => `${property}-${s}: var(--value)`).join('; ');
          classes.push(`.${prefix}${dir}-\\[\\$\\{value\\}\\] { ${properties}; }`);
        } else {
          classes.push(
            `.${prefix}${dir}-\\[\\$\\{value\\}\\] { ${property}-${suffix}: var(--value); }`
          );
        }
      });
    }
  }

  return classes.join('\n');
}

/**
 * カスタム値クラスの抽出と生成を行う汎用関数
 */
export function extractAndGenerateCustomClasses(
  content: string,
  patterns: RegExp[],
  generators: Array<(prefix: string, value: string) => string | null>
): string[] {
  const customClasses: string[] = [];
  const seenClasses = new Set<string>();

  patterns.forEach((pattern, index) => {
    const matches = content.matchAll(pattern);
    const generator = generators[index];

    for (const match of matches) {
      const prefix = match[1];
      const value = match[2];

      const cssClass = generator(prefix, value);
      if (cssClass && !seenClasses.has(cssClass)) {
        seenClasses.add(cssClass);
        customClasses.push(cssClass);
      }
    }
  });

  return customClasses;
}

/**
 * CSS関数値の処理ヘルパー
 */
export function processCSSValue(value: string): string {
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;
  return cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;
}

export function processCSSColorValue(value: string): string {
  const cssColorFunctions = /\b(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/;
  return cssColorFunctions.test(value) ? formatColorFunctionValue(value) : value;
}

/**
 * 開発用デバッグヘルパー
 */
export const devHelpers = {
  /**
   * 生成されるCSSクラスの数を計算
   */
  calculateClassCount(config: Record<string, string>, hasDirections: boolean = false): number {
    const baseCount = Object.keys(config).length;
    const directionMultiplier = hasDirections ? Object.keys(directionMappings).length + 1 : 1;
    return baseCount * directionMultiplier;
  },

  /**
   * 設定の妥当性をチェック
   */
  validateConfig(config: Record<string, string>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    Object.entries(config).forEach(([key, value]) => {
      if (!key || typeof key !== 'string') {
        errors.push(`Invalid key: ${key}`);
      }
      if (!value || typeof value !== 'string') {
        errors.push(`Invalid value for key "${key}": ${value}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * CSSの重複をチェック
   */
  findDuplicateSelectors(css: string): string[] {
    const selectors = css.match(/\.[^{]+/g) || [];
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    selectors.forEach((selector) => {
      const clean = selector.trim();
      if (seen.has(clean)) {
        duplicates.add(clean);
      }
      seen.add(clean);
    });

    return Array.from(duplicates);
  },
};

// 全ユーティリティクラス生成関数をエクスポート
export {
  generateDisplayClasses,
  generateAllSpacingClasses,
  generateFlexboxClasses,
  generatePositioningClasses,
  generateZIndexClasses,
  generateOverflowClasses,
  generateOrderClasses,
  generateGridClasses,
  generateAllWidthClasses,
  generateAllHeightClasses,
  generateAllColorClasses,
  extractCustomSpacingClasses,
  extractCustomFlexClasses,
  extractCustomZIndexClasses,
  extractCustomOrderClasses,
  extractCustomGridClasses,
  extractCustomWidthClasses,
  extractCustomHeightClasses,
  extractCustomColorClasses,
};
