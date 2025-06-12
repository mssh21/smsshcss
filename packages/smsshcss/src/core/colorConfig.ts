import { ColorConfig } from '../core/types';

/**
 * Width/Height用のサイズ設定
 * より大きな値を基本とし、レイアウト要素に適している
 */
export const defaultColorConfig: ColorConfig = {
  transparent: 'transparent',
  black: 'hsla(0, 0%, 0%, 1)',
  white: 'hsla(0, 0%, 100%, 1)',

  // alpha
  'alpha-000': '0',
  'alpha-050': '0.05',
  'alpha-100': '0.1',
  'alpha-200': '0.2',
  'alpha-300': '0.3',
  'alpha-400': '0.4',
  'alpha-500': '0.5',
  'alpha-600': '0.6',
  'alpha-700': '0.7',
  'alpha-800': '0.8',
  'alpha-900': '0.9',
  'alpha-1000': '1',

  // gray
  'gray-050': 'hsl(0, 0%, 98% / 1)',
  'gray-100': 'hsl(0, 0%, 95% / 1)',
  'gray-200': 'hsl(0, 0%, 90% / 1)',
  'gray-300': 'hsl(0, 0%, 80% / 1)',
  'gray-400': 'hsl(0, 0%, 70% / 1)',
  'gray-500': 'hsl(0, 0%, 50% / 1)',
  'gray-600': 'hsl(0, 0%, 40% / 1)',
  'gray-700': 'hsl(0, 0%, 30% / 1)',
  'gray-800': 'hsl(0, 0%, 20% / 1)',
  'gray-900': 'hsl(0, 0%, 10% / 1)',

  // blue
  'blue-000': 'hsl(216, 100%, 98% / 1)',
  'blue-100': 'hsl(216, 100%, 95% / 1)',
  'blue-200': 'hsl(216, 80%, 90% / 1)',
  'blue-300': 'hsl(216, 70%, 80% / 1)',
  'blue-400': 'hsl(216, 70%, 70% / 1)',
  'blue-500': 'hsl(216, 70%, 60% / 1)',
  'blue-600': 'hsl(216, 60%, 50% / 1)',
  'blue-700': 'hsl(216, 50%, 40% / 1)',
  'blue-800': 'hsl(216, 40%, 30% / 1)',
  'blue-900': 'hsl(216, 30%, 20% / 1)',

  // red
  'red-000': 'hsl(0, 100%, 98% / 1)',
  'red-100': 'hsl(0, 100%, 95% / 1)',
  'red-200': 'hsl(0, 90%, 90% / 1)',
  'red-300': 'hsl(0, 80%, 80% / 1)',
  'red-400': 'hsl(0, 70%, 70% / 1)',
  'red-500': 'hsl(0, 70%, 60% / 1)',
  'red-600': 'hsl(0, 60%, 50% / 1)',
  'red-700': 'hsl(0, 50%, 40% / 1)',
  'red-800': 'hsl(0, 40%, 30% / 1)',
  'red-900': 'hsl(0, 30%, 20% / 1)',
};

// CSS値内の特殊文字をエスケープ（クラス名用）
export const escapeColorValue = (val: string): string => {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(rgb|rgba|hsl|hsla)\s*\(/;

  // 新しいカラー関数（hwb, lab, oklab, lch, oklch）を検出する正規表現
  const newColorFunctions = /\b(hwb|lab|oklab|lch|oklch)\s*\(/;

  // 新しいカラー関数の場合は特別処理（ハイフンをエスケープしない、カンマもエスケープする）
  if (newColorFunctions.test(val)) {
    return val.replace(/[()[\]{}+*/.\\%,]/g, '\\$&');
  }

  // 従来のCSS数学関数の場合は特別処理（カンマもエスケープする）
  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }

  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
};

// CSS関数内の値を再帰的にフォーマットする関数
export const formatColorFunctionValue = (input: string): string => {
  // CSS関数を再帰的に処理（基本的な関数のみ）
  return input.replace(
    /(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 内部の関数を再帰的に処理
      const processedInner = formatColorFunctionValue(inner);

      // 特定の関数（hwb, lab, oklab, lch, oklch）の場合はカンマをスペースに変換
      if (['hwb', 'lab', 'oklab', 'lch', 'oklch'].includes(funcName)) {
        const formattedInner = processedInner
          // まず全てのスペースを正規化
          .replace(/\s+/g, ' ')
          .trim()
          // カンマをスペースに変換
          .replace(/\s*,\s*/g, ' ')
          // スラッシュの処理（スラッシュの前にスペース、スラッシュの後にスペース）
          .replace(/\s*\/\s*/g, ' / ');

        return `${funcName}(${formattedInner})`;
      }

      // 従来の関数（rgb, rgba, hsl, hsla）の場合はカンマを保持
      const formattedInner = processedInner
        // まず全てのスペースを正規化
        .replace(/\s+/g, ' ')
        .trim()
        // カンマの処理（カンマの後にスペース、前のスペースは削除）
        .replace(/\s*,\s*/g, ', ')
        // スラッシュの処理（スラッシュの前にスペース、スラッシュの後にスペース）
        .replace(/\s*\/\s*/g, ' / ');

      return `${funcName}(${formattedInner})`;
    }
  );
};
