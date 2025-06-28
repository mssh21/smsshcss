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
import { generateFontSizeClasses, extractCustomFontSizeClasses } from './font-size';
import { formatCSSFunctionValue } from '../core/sizeConfig';
import { formatColorFunctionValue } from '../core/colorConfig';
import { generateApplyClasses } from './apply';

// Export debug utilities for enhanced development experience
export * from './debug';

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

// リセットCSSとベースCSSの適用機能は削除
// CSSファイルはsrc/core/generator.tsで直接読み込まれます

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
  generateFontSizeClasses,
  generateApplyClasses,
  extractCustomSpacingClasses,
  extractCustomFlexClasses,
  extractCustomZIndexClasses,
  extractCustomOrderClasses,
  extractCustomGridClasses,
  extractCustomWidthClasses,
  extractCustomHeightClasses,
  extractCustomColorClasses,
  extractCustomFontSizeClasses,
};
