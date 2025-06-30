import { defaultColorConfig } from '../config/colorConfig';
import { defaultFontSizeConfig } from '../config/fontSizeConfig';
import { defaultSpacingConfig } from '../config/spacingConfig';
import { defaultSizeConfig } from '../config/sizeConfig';
import { getGridValueFromConfig } from '../config/gridConfig';

/**
 * スペーシング値を取得する共通ヘルパー関数
 * @param size - サイズキー
 * @returns CSS値またはnull
 */
export function getSpacingValue(size: string): string | null {
  if (!size) return null;

  // 設定ファイルの値をチェック
  if (defaultSpacingConfig[size]) {
    return defaultSpacingConfig[size];
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * サイズ値を取得する共通ヘルパー関数
 * @param size - サイズキー
 * @returns CSS値またはnull
 */
export function getSizeValue(size: string): string | null {
  if (!size) return null;

  // 基本設定の値をチェック
  if (defaultSizeConfig[size]) {
    return defaultSizeConfig[size];
  }

  // Width/Height用の拡張値
  const widthSpecificSizes: Record<string, string> = {
    screen: '100vw',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    dvw: '100dvw',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  // Width/Height専用の値をチェック
  if (widthSpecificSizes[size]) {
    return widthSpecificSizes[size];
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * 色値を取得する共通ヘルパー関数
 * @param colorName - 色名
 * @returns CSS色値またはnull
 */
export function getColorValue(colorName: string): string | null {
  if (!colorName) return null;

  // デフォルトの色値をチェック
  if (defaultColorConfig[colorName]) {
    return defaultColorConfig[colorName];
  }

  // 基本色名の場合、デフォルトの500番を試す
  const baseColors = [
    'blue',
    'red',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'indigo',
    'sky',
    'teal',
    'emerald',
    'amber',
    'gray',
  ];

  if (baseColors.includes(colorName)) {
    const defaultColorKey = `${colorName}-500`;
    if (defaultColorConfig[defaultColorKey]) {
      return defaultColorConfig[defaultColorKey];
    }
  }

  // カスタム値（[値]形式）の場合
  if (colorName.startsWith('[') && colorName.endsWith(']')) {
    let customValue = colorName.slice(1, -1);

    // CSS関数（rgb, hsl等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * フォントサイズ値を取得する共通ヘルパー関数
 * @param fontSize - フォントサイズキー
 * @returns CSS値またはnull
 */
export function getFontSizeValue(fontSize: string): string | null {
  if (!fontSize) return null;

  // デフォルトのfont-size値をチェック
  if (defaultFontSizeConfig[fontSize]) {
    return defaultFontSizeConfig[fontSize];
  }

  // カスタム値（[値]形式）の場合
  if (fontSize.startsWith('[') && fontSize.endsWith(']')) {
    let customValue = fontSize.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * Grid値を取得する共通ヘルパー関数
 * @param size - Gridサイズキー
 * @returns CSS Grid値またはnull
 */
export function getGridValue(size: string): string | null {
  return getGridValueFromConfig(size);
}

/**
 * カスタム値を正規化（スペースの適切な挿入）
 * @param value - カスタム値
 * @returns 正規化された値
 */
export function normalizeCustomValue(value: string): string {
  if (!value) return value;

  let normalizedValue = value;

  // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
  const cssFunctions =
    /\b(calc|min|max|clamp|minmax|var|rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/gi;
  if (cssFunctions.test(normalizedValue)) {
    // カンマの後にスペースがない場合は追加
    normalizedValue = normalizedValue.replace(/,(?!\s)/g, ', ');
  }

  // calc関数内の演算子周りにスペースを追加
  if (/\bcalc\s*\(/i.test(normalizedValue)) {
    // +, -, *, / の周りにスペースを追加（既にスペースがある場合は追加しない）
    normalizedValue = normalizedValue.replace(/([+\-*/])(?!\s)/g, '$1 ');
    normalizedValue = normalizedValue.replace(/(?<!\s)([+\-*/])/g, ' $1');
    // 連続するスペースを1つにまとめる
    normalizedValue = normalizedValue.replace(/\s+/g, ' ');
  }

  return normalizedValue;
}
