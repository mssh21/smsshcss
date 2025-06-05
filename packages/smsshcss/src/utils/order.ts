import { OrderConfig } from '../core/types';

// Order専用のエスケープ関数
function escapeOrderValue(val: string): string {
  // CSS数学関数およびCSS関数を検出する正規表現
  const cssFunctions = /\b(calc|min|max|clamp|var)\s*\(/;

  // CSS関数の場合は特別処理
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

// デフォルトのOrder設定
const defaultOrder: OrderConfig = {
  // Order (Flexbox & Grid共通)
  'order-1': '1',
  'order-2': '2',
  'order-3': '3',
  'order-4': '4',
  'order-5': '5',
  'order-6': '6',
  'order-7': '7',
  'order-8': '8',
  'order-9': '9',
  'order-10': '10',
  'order-11': '11',
  'order-12': '12',
  'order-first': '-9999',
  'order-last': '9999',
  'order-none': '0',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  // Order properties
  ...Object.keys(defaultOrder)
    .filter(
      (key) =>
        key.startsWith('order-') ||
        key === 'order-first' ||
        key === 'order-last' ||
        key === 'order-none'
    )
    .reduce((acc, key) => ({ ...acc, [key]: 'order' }), {}),
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b(order)-\[([^\]]+)\]/g;

// カスタムOrderクラスを生成
function generateCustomOrderClass(prefix: string, value: string): string | null {
  // 元の値を復元（CSS値用）
  const originalValue = value;

  // order プロパティの処理
  if (prefix === 'order') {
    return `.order-\\[${escapeOrderValue(value)}\\] { order: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomOrderClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomOrderClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateOrderClasses(customConfig?: OrderConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultOrder, ...customConfig } : defaultOrder;

  const classes: string[] = [];

  // 基本的なOrderクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  // 任意の値のOrderクラステンプレートを追加
  const arbitraryValueTemplate = `
/* Arbitrary order values */
.order-\\[\\$\\{value\\}\\] { order: var(--value); }
`;

  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

// 便利な関数群
export function generateArbitraryOrder(value: string): string {
  const escapedValue = escapeOrderValue(value);
  return `.order-\\[${escapedValue}\\] { order: ${value}; }`;
}
