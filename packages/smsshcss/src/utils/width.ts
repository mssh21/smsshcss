import { WidthConfig } from '../core/types';

const defaultWidth: WidthConfig = {
  // フィボナッチ数列ベースのスペーシング（基本単位: 4px = 0.25rem）
  // フィボナッチ数列の値を使用しつつ、直感的な命名を採用

  // ゼロスペーシング
  none: '0',

  // 極小〜小サイズ
  '2xs': 'var(--size-2xs)', // 16px
  xs: 'var(--size-xs)', // 24px
  sm: 'var(--size-sm)', // 32px
  md: 'var(--size-md)', // 40px
  lg: 'var(--size-lg)', // 48px
  xl: 'var(--size-xl)', // 64px
  '2xl': 'var(--size-2xl)', // 96px
  '3xl': 'var(--size-3xl)', // 128px
  '4xl': 'var(--size-4xl)', // 192px
  '5xl': 'var(--size-5xl)', // 256px
  '6xl': 'var(--size-6xl)', // 320px
  '7xl': 'var(--size-7xl)', // 384px
  '8xl': 'var(--size-8xl)', // 512px
  '9xl': 'var(--size-9xl)', // 768px
  '10xl': 'var(--size-10xl)', // 1024px
  '11xl': 'var(--size-11xl)', // 1280px
  '12xl': 'var(--size-12xl)', // 1536px
  full: '100%',
  auto: 'auto',
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

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;

// カスタムWidthクラスを生成
function generateCustomWidthClass(prefix: string, value: string): string | null {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // CSS値内の特殊文字をエスケープ（クラス名用）
  const escapeValue = (val: string): string => {
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
  const formatCSSFunctionValue = (input: string): string => {
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

  // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
  const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

  // width プロパティの処理
  if (prefix === 'w') {
    return `.w-\\[${escapeValue(value)}\\] { width: ${originalValue}; }`;
  }

  // min-width プロパティの処理
  if (prefix === 'min-w') {
    return `.min-w-\\[${escapeValue(value)}\\] { min-width: ${originalValue}; }`;
  }

  // max-width プロパティの処理
  if (prefix === 'max-w') {
    return `.max-w-\\[${escapeValue(value)}\\] { max-width: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomWidthClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomWidthClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateCustomWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate classes for each width size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., w-md, min-w-md, max-w-md)
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  return classes.join('\n');
}

export function generateWidthClasses(config: WidthConfig = defaultWidth): string {
  const classes: string[] = [];

  // Generate width classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.w-${size} { width: ${value}; }`);
    classes.push(`.min-w-${size} { min-width: ${value}; }`);
    classes.push(`.max-w-${size} { max-width: ${value}; }`);
  });

  // 任意の値のwidthクラスを追加
  classes.push(`
/* Arbitrary width values */
.w-\\[\\$\\{value\\}\\] { width: var(--value); }
.min-w-\\[\\$\\{value\\}\\] { min-width: var(--value); }
.max-w-\\[\\$\\{value\\}\\] { max-width: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllWidthClasses(customConfig?: WidthConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultWidth, ...customConfig } : defaultWidth;

  return generateWidthClasses(config);
}
