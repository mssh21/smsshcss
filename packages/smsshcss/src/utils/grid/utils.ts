// Grid専用のエスケープ関数
export function escapeGridValue(val: string): string {
  // CSS数学関数およびGrid関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|minmax|repeat)\s*\(/;

  // CSS関数の場合は特別処理（カンマもエスケープするが、--はエスケープしない）
  if (cssFunctions.test(val)) {
    return val.replace(/[()[\]{}+*/.\\%,]/g, '\\$&').replace(/\\-\\-/g, '--');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
}

// Grid専用のCSS関数フォーマット処理
export function formatGridCSSValue(input: string): string {
  // CSS関数を再帰的に処理しつつ、Grid値のカンマ区切りを適切に処理
  let formatted = input;

  // CSS関数をプレースホルダーに置き換えて一時的に保護
  const functionPlaceholders: string[] = [];
  let placeholderIndex = 0;

  formatted = formatted.replace(
    /(calc|min|max|clamp|minmax|repeat)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      // 関数内の演算子を適切にフォーマット
      const formattedInner = inner
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s*,\s*/g, ', ')
        .replace(
          /\s*([+\-*/])\s*/g,
          (match: string, operator: string, offset: number, str: string) => {
            if (operator === '-') {
              const beforeMatch = str.substring(0, offset);
              const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
              const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';
              if (!prevChar || prevChar === '(' || prevChar === ',' || /[+\-*/]/.test(prevChar)) {
                return '-';
              }
            }
            return ` ${operator} `;
          }
        );

      const placeholder = `__FUNC_${placeholderIndex++}__`;
      functionPlaceholders.push(`${funcName}(${formattedInner})`);
      return placeholder;
    }
  );

  // Grid値間のカンマをスペースに変換
  formatted = formatted.replace(/,/g, ' ');

  // プレースホルダーを元の関数に戻す
  functionPlaceholders.forEach((func, index) => {
    formatted = formatted.replace(`__FUNC_${index}__`, func);
  });

  return formatted;
}

// カスタム値クラスを検出する正規表現
export const customValuePattern =
  /\b(grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end)-\[([^\]]+)\]/g;
