// Flexbox専用のエスケープ関数
export function escapeFlexValue(val: string): string {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp|minmax)\s*\(/;

  // CSS数学関数の場合は特別処理（カンマもエスケープする）
  if (cssMathFunctions.test(val)) {
    // 関数内のスペースを削除してからエスケープ
    const withoutSpaces = val.replace(/\s+/g, '');
    return withoutSpaces.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
}

// カスタム値クラスを検出する正規表現（角括弧付き）
export const customValuePattern = /\b(basis|grow|shrink|flex)-\[([^\]]+)\]/g;

// 通常の値クラスを検出する正規表現
export const normalValuePattern = /\b(basis|grow|shrink|flex)-([a-zA-Z0-9-]+(?:[0-9]+)?)\b/g;

// 角括弧内の値を抽出する正規表現
export const extractBracketValue = /\[([^\]]+)\]/;
