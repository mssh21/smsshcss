import { SizeConfig } from '../core/types';

// CSS変数ベースの設定（width/height用）
export const defaultSizeConfig: SizeConfig = {
  // ゼロスペーシング
  none: '0',

  // 極小〜小サイズ
  '2xs': 'var(--size-base)', // 1rem (16px)
  xs: 'calc(var(--size-base) * 1.5)', // 1.5rem (24px)
  sm: 'calc(var(--size-base) * 2)', // 2rem (32px)
  md: 'calc(var(--size-base) * 2.5)', // 2.5rem (40px)
  lg: 'calc(var(--size-base) * 3)', // 3rem (48px)
  xl: 'calc(var(--size-base) * 4)', // 4rem (64px)
  '2xl': 'calc(var(--size-base) * 6)', // 6rem (96px)
  '3xl': 'calc(var(--size-base) * 8)', // 8rem (128px)
  '4xl': 'calc(var(--size-base) * 12)', // 12rem (192px)
  '5xl': 'calc(var(--size-base) * 16)', // 16rem (256px)
  '6xl': 'calc(var(--size-base) * 20)', // 20rem (320px)
  '7xl': 'calc(var(--size-base) * 24)', // 24rem (384px)
  '8xl': 'calc(var(--size-base) * 32)', // 32rem (512px)
  '9xl': 'calc(var(--size-base) * 48)', // 48rem (768px)
  '10xl': 'calc(var(--size-base) * 64)', // 64rem (1024px)
  '11xl': 'calc(var(--size-base) * 80)', // 80rem (1280px)
  '12xl': 'calc(var(--size-base) * 96)', // 96rem (1536px)
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
};

// 直接値ベースの設定（spacing用）
export const defaultSpacingValues: SizeConfig = {
  // フィボナッチ数列ベースのスペーシング（基本単位: 4px = 0.25rem）
  // フィボナッチ数列の値を使用しつつ、直感的な命名を採用
  none: '0',
  auto: 'auto',
  '2xs': 'var(--space-base)', // 0.25rem (4px)  (フィボナッチ: 1)
  xs: 'calc(var(--space-base) * 2)', // 0.5rem (8px)  (フィボナッチ: 2)
  sm: 'calc(var(--space-base) * 3)', // 0.75rem (12px) (フィボナッチ: 3)
  md: 'calc(var(--space-base) * 5)', // 20px (フィボナッチ: 5)
  lg: 'calc(var(--space-base) * 8)', // 32px (フィボナッチ: 8)
  xl: 'calc(var(--space-base) * 13)', // 52px (フィボナッチ: 13)
  '2xl': 'calc(var(--space-base) * 21)', // 84px (フィボナッチ: 21)
  '3xl': 'calc(var(--space-base) * 34)', // 136px (フィボナッチ: 34)
  '4xl': 'calc(var(--space-base) * 55)', // 220px (フィボナッチ: 55)
  '5xl': 'calc(var(--space-base) * 89)', // 356px (フィボナッチ: 89)
  '6xl': 'calc(var(--space-base) * 144)', // 576px
  '7xl': 'calc(var(--space-base) * 192)', // 768px
  '8xl': 'calc(var(--space-base) * 256)', // 1024px
  '9xl': 'calc(var(--space-base) * 320)', // 1280px
  '10xl': 'calc(var(--space-base) * 384)', // 1536px
  '11xl': 'calc(var(--space-base) * 448)', // 1792px
  '12xl': 'calc(var(--space-base) * 512)', // 2048px

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
