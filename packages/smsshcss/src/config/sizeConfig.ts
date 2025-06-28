import { SizeConfig } from '../core/types';

/**
 * Width/Height用のサイズ設定
 * より大きな値を基本とし、レイアウト要素に適している
 */
export const defaultSizeConfig: SizeConfig = {
  none: '0',
  '2xs': '1rem', // 1rem (16px)
  xs: '1.5rem', // 1.5rem (24px)
  sm: '2rem', // 2rem (32px)
  md: '2.5rem', // 2.5rem (40px)
  lg: '3rem', // 3rem (48px)
  xl: '4rem', // 4rem (64px)
  '2xl': '6rem', // 6rem (96px)
  '3xl': '8rem', // 8rem (128px)
  '4xl': '12rem', // 12rem (192px)
  '5xl': '16rem', // 16rem (256px)
  '6xl': '20rem', // 20rem (320px)
  '7xl': '24rem', // 24rem (384px)
  '8xl': '32rem', // 32rem (512px)
  '9xl': '48rem', // 48rem (768px)
  '10xl': '64rem', // 64rem (1024px)
  '11xl': '80rem', // 80rem (1280px)
  '12xl': '96rem', // 96rem (1536px)
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
  screen: '100vw',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  cqw: '100cqw',
  cqi: '100cqi',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// CSS値内の特殊文字をエスケープ（クラス名用）
export const escapeSizeValue = (val: string): string => {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp|minmax)\s*\(/;

  // CSS数学関数の場合は特別処理（カンマもエスケープする）
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
export const formatSizeCSSFunctionValue = (input: string): string => {
  // CSS関数を再帰的に処理（基本的な関数のみ）
  return input.replace(
    /(calc|min|max|clamp|minmax)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 内部の関数を再帰的に処理
      const processedInner = formatSizeCSSFunctionValue(inner);

      // 演算子とカンマの周りにスペースを適切に配置
      const formattedInner = processedInner
        // まず全てのスペースを正規化
        .replace(/\s+/g, ' ')
        .trim()
        // カンマの処理（カンマの後にスペース、前のスペースは削除）
        .replace(/\s*,\s*/g, ', ')
        // 演算子の処理（前後にスペース）
        .replace(/\s*([+\-*/])\s*/g, (match, operator, offset, str) => {
          // マイナス記号が負の値かどうかを判定
          if (operator === '-') {
            // 現在の位置より前の文字を取得
            const beforeMatch = str.substring(0, offset);
            // 直前の非空白文字を取得
            const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
            const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';

            // 負の値の場合（文字列の開始、括弧の後、カンマの後、他の演算子の後）
            if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/]/.test(prevChar)) {
              return '-';
            }
          }
          return ` ${operator} `;
        });

      return `${funcName}(${formattedInner})`;
    }
  );
};
