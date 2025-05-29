import { SpacingConfig, SpacingDirection, SpacingProperty } from '../core/types';

const defaultSpacing: SpacingConfig = {
  // フィボナッチ数列ベースのスペーシング（基本単位: 4px = 0.25rem）
  // フィボナッチ数列の値を使用しつつ、直感的な命名を採用

  // ゼロスペーシング
  none: '0',

  // 極小〜小サイズ
  '2xs': '0.25rem', // 4px  (フィボナッチ: 1)
  xs: '0.5rem', // 8px  (フィボナッチ: 2)
  sm: '0.75rem', // 12px (フィボナッチ: 3)

  // 中サイズ
  md: '1.25rem', // 20px (フィボナッチ: 5)
  lg: '2rem', // 32px (フィボナッチ: 8)

  // 大サイズ
  xl: '3.25rem', // 52px (フィボナッチ: 13)
  '2xl': '5.25rem', // 84px (フィボナッチ: 21)

  // 特大サイズ
  '3xl': '8.5rem', // 136px (フィボナッチ: 34)
  '4xl': '13.75rem', // 220px (フィボナッチ: 55)

  // 超大サイズ
  '5xl': '22.25rem', // 356px (フィボナッチ: 89)
};

const directionMap: Record<SpacingDirection, string> = {
  '': '',
  t: '-top',
  r: '-right',
  b: '-bottom',
  l: '-left',
  x: '-left',
  y: '-top',
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;

// カスタムスペーシングクラスを生成
function generateCustomSpacingClass(prefix: string, value: string): string | null {
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

  // gap プロパティの処理
  if (prefix === 'gap') {
    return `.gap-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`;
  }

  // gap-x (column-gap) プロパティの処理
  if (prefix === 'gap-x') {
    return `.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`;
  }

  // gap-y (row-gap) プロパティの処理
  if (prefix === 'gap-y') {
    return `.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`;
  }

  const property = prefix.startsWith('m') ? 'margin' : 'padding';
  const direction = prefix.slice(1); // 'm' or 'p' を除いた部分

  let cssProperty = property;

  switch (direction) {
    case 't':
      cssProperty = `${property}-top`;
      break;
    case 'r':
      cssProperty = `${property}-right`;
      break;
    case 'b':
      cssProperty = `${property}-bottom`;
      break;
    case 'l':
      cssProperty = `${property}-left`;
      break;
    case 'x':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`;
    case 'y':
      return `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`;
    case '':
      // 全方向
      break;
    default:
      return null;
  }

  return `.${prefix}-\\[${escapeValue(value)}\\] { ${cssProperty}: ${originalValue}; }`;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomSpacingClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomSpacingClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateSpacingClasses(
  config: SpacingConfig = defaultSpacing,
  property: SpacingProperty = 'margin'
): string {
  const classes: string[] = [];

  // Generate classes for each spacing size
  Object.entries(config).forEach(([size, value]) => {
    // Generate base classes (e.g., m-md, p-md)
    classes.push(`.${property[0]}-${size} { ${property}: ${value}; }`);

    // Generate directional classes
    Object.entries(directionMap).forEach(([dir, suffix]) => {
      if (dir === 'x') {
        // Handle x direction (left and right)
        classes.push(
          `.${property[0]}x-${size} { ${property}-left: ${value}; ${property}-right: ${value}; }`
        );
      } else if (dir === 'y') {
        // Handle y direction (top and bottom)
        classes.push(
          `.${property[0]}y-${size} { ${property}-top: ${value}; ${property}-bottom: ${value}; }`
        );
      } else if (dir !== '') {
        // Handle individual directions
        classes.push(`.${property[0]}${dir}-${size} { ${property}${suffix}: ${value}; }`);
      }
    });
  });

  // 任意の値のクラスを生成
  const arbitraryValueTemplate = `
/* Arbitrary value classes */
.${property[0]}-\\[\\$\\{value\\}\\] { ${property}: var(--value); }
.${property[0]}t-\\[\\$\\{value\\}\\] { ${property}-top: var(--value); }
.${property[0]}r-\\[\\$\\{value\\}\\] { ${property}-right: var(--value); }
.${property[0]}b-\\[\\$\\{value\\}\\] { ${property}-bottom: var(--value); }
.${property[0]}l-\\[\\$\\{value\\}\\] { ${property}-left: var(--value); }
.${property[0]}x-\\[\\$\\{value\\}\\] { ${property}-left: var(--value); ${property}-right: var(--value); }
.${property[0]}y-\\[\\$\\{value\\}\\] { ${property}-top: var(--value); ${property}-bottom: var(--value); }
`;

  // 任意の値のクラステンプレートを追加
  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

export function generateGapClasses(config: SpacingConfig = defaultSpacing): string {
  const classes: string[] = [];

  // Generate gap classes
  Object.entries(config).forEach(([size, value]) => {
    classes.push(`.gap-${size} { gap: ${value}; }`);
    classes.push(`.gap-x-${size} { column-gap: ${value}; }`);
    classes.push(`.gap-y-${size} { row-gap: ${value}; }`);
  });

  // 任意の値のgapクラスを追加
  classes.push(`
/* Arbitrary gap values */
.gap-\\[\\$\\{value\\}\\] { gap: var(--value); }
.gap-x-\\[\\$\\{value\\}\\] { column-gap: var(--value); }
.gap-y-\\[\\$\\{value\\}\\] { row-gap: var(--value); }
`);

  return classes.join('\n');
}

export function generateAllSpacingClasses(customConfig?: SpacingConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultSpacing, ...customConfig } : defaultSpacing;

  return [
    generateSpacingClasses(config, 'margin'),
    generateSpacingClasses(config, 'padding'),
    generateGapClasses(config),
  ].join('\n\n');
}
