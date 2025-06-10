import { ZIndexConfig } from '../core/types';

// Z-Index専用のエスケープ関数
function escapeZIndexValue(val: string): string {
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

// デフォルトのZ-Index設定
const defaultZIndex: ZIndexConfig = {
  // Z-Index (レイヤリング)
  'z-0': '0',
  'z-10': '10',
  'z-20': '20',
  'z-30': '30',
  'z-40': '40',
  'z-50': '50',
  'z-auto': 'auto',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  // Z-Index properties
  ...Object.keys(defaultZIndex)
    .filter((key) => key.startsWith('z-'))
    .reduce((acc, key) => ({ ...acc, [key]: 'z-index' }), {}),
};

// カスタム値クラスを検出する正規表現
const customValuePattern = /\b(z)-\[([^\]]+)\]/g;

// カスタムZ-Indexクラスを生成
function generateCustomZIndexClass(prefix: string, value: string): string | null {
  // 元の値を復元（CSS値用）
  const originalValue = value;

  // z-index プロパティの処理
  if (prefix === 'z') {
    return `.z-\\[${escapeZIndexValue(value)}\\] { z-index: ${originalValue}; }`;
  }

  return null;
}

// HTMLファイルからカスタム値クラスを抽出
export function extractCustomZIndexClasses(content: string): string[] {
  const matches = content.matchAll(customValuePattern);
  const customClasses: string[] = [];

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // CSSクラスを生成
    const cssClass = generateCustomZIndexClass(prefix, value);
    if (cssClass) {
      customClasses.push(cssClass);
    }
  }

  return customClasses;
}

export function generateZIndexClasses(customConfig?: ZIndexConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultZIndex, ...customConfig } : defaultZIndex;

  const classes: string[] = [];

  // 基本的なZ-Indexクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  // 任意の値のZ-Indexクラステンプレートを追加
  const arbitraryValueTemplate = `
/* Arbitrary z-index values */
.z-\\[\\$\\{value\\}\\] { z-index: var(--value); }
`;

  classes.push(arbitraryValueTemplate);

  return classes.join('\n');
}

// 便利な関数群
export function generateArbitraryZIndex(value: string): string {
  const escapedValue = escapeZIndexValue(value);
  return `.z-\\[${escapedValue}\\] { z-index: ${value}; }`;
}

// テーマ設定からクラスを生成
export function generateAllZIndexClasses(themeConfig?: {
  zIndex?: Record<string, string>;
}): string {
  const classes: string[] = [];

  // デフォルトのクラスを生成
  classes.push(generateZIndexClasses());

  // テーマ設定がある場合は、カスタムクラスを生成
  if (themeConfig?.zIndex) {
    Object.entries(themeConfig.zIndex).forEach(([key, value]) => {
      classes.push(`.z-${key} { z-index: ${value}; }`);
    });
  }

  return classes.join('\n');
}
