import { FontSizeConfig } from '../core/types';

export const defaultFontSizeConfig: FontSizeConfig = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.25rem', // 20px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.25rem', // 36px
  '4xl': '2.75rem', // 44px
};

// CSS値内の特殊文字をエスケープ（クラス名用）
export const escapeFontSizeValue = (val: string): string => {
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
export const formatFontSizeCSSFunctionValue = (input: string): string => {
  // CSS関数を再帰的に処理（基本的な関数のみ）
  return input.replace(
    /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 内部の関数を再帰的に処理
      const processedInner = formatFontSizeCSSFunctionValue(inner);

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
