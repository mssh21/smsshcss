import { SizeConfig } from '../core/types';

export const defaultFontSizeConfig: FontSizeConfig = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.125rem', // 20px
  xl: '1.25rem', // 24px
  '2xl': '1.75rem', // 32px
  '3xl': '2rem', // 36px
  '4xl': '2.25rem', // 44px
};

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
};

/**
 * Spacing（margin/padding/gap）用のサイズ設定
 * フィボナッチ数列ベースで細かなスペーシング制御に適している
 * 基本単位: 4px (0.25rem)
 */
export const defaultSpacingValues: SizeConfig = {
  // フィボナッチ数列ベースのスペーシング（基本単位: 4px = 0.25rem）
  // フィボナッチ数列の値を使用しつつ、直感的な命名を採用
  none: '0',
  auto: 'auto',
  '2xs': '0.25rem', // 0.25rem (4px)  (フィボナッチ: 1)
  xs: '0.5rem', // 0.5rem (8px)  (フィボナッチ: 2)
  sm: '0.75rem', // 0.75rem (12px) (フィボナッチ: 3)
  md: '1.25rem', // 1.25rem (20px) (フィボナッチ: 5)
  lg: '2rem', // 2rem (32px) (フィボナッチ: 8)
  xl: '3.25rem', // 3.25rem (52px) (フィボナッチ: 13)
  '2xl': '5.25rem', // 5.25rem (84px) (フィボナッチ: 21)
  '3xl': '8.5rem', // 8.5rem (136px) (フィボナッチ: 34)
  '4xl': '13.75rem', // 13.75rem (220px) (フィボナッチ: 55)
  '5xl': '22.25rem', // 22.25rem (356px) (フィボナッチ: 89)
  '6xl': '36rem', // 36rem (576px) (フィボナッチ: 144)
  '7xl': '48rem', // 48rem (768px)
  '8xl': '64rem', // 64rem (1024px)
  '9xl': '80rem', // 80rem (1280px)
  '10xl': '96rem', // 96rem (1536px)
  '11xl': '112rem', // 112rem (1792px)
  '12xl': '128rem', // 128rem (2048px)

  // レスポンシブ・動的な値
  full: '100%',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
  screen: '100vw',
  dvh: '100dvh',
  dvw: '100dvw',
  cqw: '100cqw',
  cqi: '100cqi',
  cqmin: '100cqmin',
  cqmax: '100cqmax',
};

// CSS値内の特殊文字をエスケープ（クラス名用）
export const escapeValue = (val: string): string => {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

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
export const formatCSSFunctionValue = (input: string): string => {
  // CSS関数を再帰的に処理（基本的な関数のみ）
  return input.replace(
    /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 内部の関数を再帰的に処理
      const processedInner = formatCSSFunctionValue(inner);

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
