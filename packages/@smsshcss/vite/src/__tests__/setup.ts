import { vi } from 'vitest';

// SmsshCSSの設定の型定義
interface SmsshCSSConfig {
  content?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
    width?: Record<string, string>;
    height?: Record<string, string>;
    grid?: Record<string, string>;
    order?: Record<string, string>;
    zIndex?: Record<string, string>;
  };
  purge?: {
    enabled?: boolean;
    content?: string[];
    safelist?: (string | RegExp)[];
    blocklist?: string[];
  };
}

// 共通のCSS生成関数
const generateMockCSS = (config: SmsshCSSConfig): string => {
  let css = '';

  // Reset CSS
  if (config.includeResetCSS !== false) {
    css += '\n/* Reset CSS */\n* { margin: 0; padding: 0; }';
  }

  // Base CSS
  if (config.includeBaseCSS !== false) {
    css += '\n/* Base CSS */\nbody { font-family: sans-serif; }';
  }

  // SmsshCSS Generated Styles
  css += '\n/* SmsshCSS Generated Styles */';
  css += '\n.m-md { margin: calc(var(--space-base) * 5); }';
  css += '\n.mt-lg { margin-top: calc(var(--space-base) * 8); }';
  css +=
    '\n.mx-sm { margin-left: calc(var(--space-base) * 3); margin-right: calc(var(--space-base) * 3); }';
  css += '\n.p-md { padding: calc(var(--space-base) * 5); }';
  css += '\n.p-lg { padding: calc(var(--space-base) * 8); }';
  css += '\n.pt-lg { padding-top: calc(var(--space-base) * 8); }';
  css +=
    '\n.px-sm { padding-left: calc(var(--space-base) * 3); padding-right: calc(var(--space-base) * 3); }';
  css += '\n.gap-md { gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-x-md { column-gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-y-md { row-gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-x-lg { column-gap: calc(var(--space-base) * 8); }';
  css += '\n.gap-y-lg { row-gap: calc(var(--space-base) * 8); }';
  css += '\n.gap-xl { gap: calc(var(--space-base) * 13); }';
  css += '\n.flex { display: flex; }';
  css += '\n.grid { display: grid; }';

  // Width classes - 全サイズをCSS変数形式で生成
  css += '\n.w-2xs { width: var(--size-base); }';
  css += '\n.w-xs { width: calc(var(--size-base) * 1.5); }';
  css += '\n.w-sm { width: calc(var(--size-base) * 2); }';
  css += '\n.w-md { width: calc(var(--size-base) * 2.5); }';
  css += '\n.w-lg { width: calc(var(--size-base) * 3); }';
  css += '\n.w-xl { width: calc(var(--size-base) * 4); }';
  css += '\n.w-screen { width: 100vw; }';
  css += '\n.w-full { width: 100%; }';
  css += '\n.min-w-2xs { min-width: var(--size-base); }';
  css += '\n.min-w-lg { min-width: calc(var(--size-base) * 3); }';
  css += '\n.max-w-2xs { max-width: var(--size-base); }';
  css += '\n.max-w-lg { max-width: calc(var(--size-base) * 3); }';

  // Height classes - 全サイズをCSS変数形式で生成
  css += '\n.h-2xs { height: var(--size-base); }';
  css += '\n.h-xs { height: calc(var(--size-base) * 1.5); }';
  css += '\n.h-sm { height: calc(var(--size-base) * 2); }';
  css += '\n.h-md { height: calc(var(--size-base) * 2.5); }';
  css += '\n.h-lg { height: calc(var(--size-base) * 3); }';
  css += '\n.h-xl { height: calc(var(--size-base) * 4); }';
  css += '\n.h-screen { height: 100vh; }';
  css += '\n.h-full { height: 100%; }';
  css += '\n.min-h-2xs { min-height: var(--size-base); }';
  css += '\n.min-h-lg { min-height: calc(var(--size-base) * 3); }';
  css += '\n.max-h-2xs { max-height: var(--size-base); }';
  css += '\n.max-h-lg { max-height: calc(var(--size-base) * 3); }';

  // Modern CSS units for compatibility tests
  css += '\n.h-dvh { height: 100dvh; }';
  css += '\n.w-dvw { width: 100dvw; }';

  // SmsshCSS Generated Styles
  css += '\n.w-full { width: 100%; }';
  css += '\n.h-md { height: calc(var(--size-base) * 5); }';
  css += '\n.h-lg { height: calc(var(--size-base) * 8); }';
  css += '\n.min-h-md { min-height: calc(var(--size-base) * 5); }';
  css += '\n.min-h-lg { min-height: calc(var(--size-base) * 8); }';
  css += '\n.max-h-md { max-height: calc(var(--size-base) * 5); }';
  css += '\n.max-h-lg { max-height: calc(var(--size-base) * 8); }';

  // Grid classes
  css += '\n.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }';
  css += '\n.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }';
  css += '\n.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }';
  css += '\n.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }';
  css += '\n.col-span-3 { grid-column: span 3 / span 3; }';
  css += '\n.row-span-1 { grid-row: span 1 / span 1; }';
  css += '\n.col-start-4 { grid-column-start: 4; }';
  css += '\n.row-start-4 { grid-row-start: 4; }';
  css += '\n.col-end-4 { grid-column-end: 4; }';
  css += '\n.grid-flow-row { grid-auto-flow: row; }';

  // Flexbox classes
  css += '\n.flex-row { flex-direction: row; }';
  css += '\n.flex-col { flex-direction: column; }';
  css += '\n.flex-row-reverse { flex-direction: row-reverse; }';
  css += '\n.flex-col-reverse { flex-direction: column-reverse; }';
  css += '\n.flex-wrap { flex-wrap: wrap; }';
  css += '\n.flex-wrap-reverse { flex-wrap: wrap-reverse; }';
  css += '\n.flex-grow { flex-grow: 1; }';
  css += '\n.flex-shrink { flex-shrink: 1; }';
  css += '\n.flex-1 { flex: 1 1 0%; }';
  css += '\n.flex-auto { flex: 1 1 auto; }';
  css += '\n.flex-basis-auto { flex-basis: auto; }';
  css += '\n.flex-basis-full { flex-basis: 100%; }';
  css += '\n.flex-basis-sm { flex-basis: calc(var(--size-base) * 2); }';

  // Order classes
  css += '\n.order-1 { order: 1; }';
  css += '\n.order-2 { order: 2; }';
  css += '\n.order-3 { order: 3; }';
  css += '\n.order-4 { order: 4; }';
  css += '\n.order-5 { order: 5; }';
  css += '\n.order-first { order: -9999; }';
  css += '\n.order-last { order: 9999; }';
  css += '\n.order-none { order: 0; }';

  // Z-index classes
  css += '\n.z-0 { z-index: 0; }';
  css += '\n.z-10 { z-index: 10; }';
  css += '\n.z-20 { z-index: 20; }';
  css += '\n.z-30 { z-index: 30; }';
  css += '\n.z-40 { z-index: 40; }';
  css += '\n.z-50 { z-index: 50; }';
  css += '\n.z-auto { z-index: auto; }';

  // カスタムテーマクラス
  if (config.theme?.spacing) {
    Object.entries(config.theme.spacing).forEach(([key, value]) => {
      css += `\n.m-${key} { margin: ${value}; }`;
      css += `\n.p-${key} { padding: ${value}; }`;
      css += `\n.gap-${key} { gap: ${value}; }`;
      css += `\n.gap-x-${key} { column-gap: ${value}; }`;
      css += `\n.gap-y-${key} { row-gap: ${value}; }`;
      css += `\n.w-${key} { width: ${value}; }`;
      css += `\n.min-w-${key} { min-width: ${value}; }`;
      css += `\n.max-w-${key} { max-width: ${value}; }`;
      css += `\n.h-${key} { height: ${value}; }`;
      css += `\n.min-h-${key} { min-height: ${value}; }`;
      css += `\n.max-h-${key} { max-height: ${value}; }`;
      css += `\n.grid-cols-${key} { grid-template-columns: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.grid-rows-${key} { grid-template-rows: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.col-span-${key} { grid-column: span ${value}; }`;
      css += `\n.row-span-${key} { grid-row: span ${value}; }`;
      css += `\n.col-start-${key} { grid-column-start: ${value}; }`;
      css += `\n.row-start-${key} { grid-row-start: ${value}; }`;
      css += `\n.col-end-${key} { grid-column-end: ${value}; }`;
      css += `\n.row-end-${key} { grid-row-end: ${value}; }`;
      css += `\n.order-${key} { order: ${value}; }`;
      css += `\n.z-${key} { z-index: ${value}; }`;
    });
  }

  if (config.theme?.display) {
    Object.entries(config.theme.display).forEach(([key, value]) => {
      css += `\n.${key} { display: ${value}; }`;
    });
  }

  if (config.theme?.width) {
    Object.entries(config.theme.width).forEach(([key, value]) => {
      css += `\n.w-${key} { width: ${value}; }`;
      css += `\n.min-w-${key} { min-width: ${value}; }`;
      css += `\n.max-w-${key} { max-width: ${value}; }`;
    });
  }

  if (config.theme?.height) {
    Object.entries(config.theme.height).forEach(([key, value]) => {
      css += `\n.h-${key} { height: ${value}; }`;
      css += `\n.min-h-${key} { min-height: ${value}; }`;
      css += `\n.max-h-${key} { max-height: ${value}; }`;
    });
  }

  if (config.theme?.grid) {
    Object.entries(config.theme.grid).forEach(([key, value]) => {
      css += `\n.grid-cols-${key} { grid-template-columns: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.grid-rows-${key} { grid-template-rows: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.col-span-${key} { grid-column: span ${value}; }`;
      css += `\n.row-span-${key} { grid-row: span ${value}; }`;
      css += `\n.col-start-${key} { grid-column-start: ${value}; }`;
      css += `\n.row-start-${key} { grid-row-start: ${value}; }`;
      css += `\n.col-end-${key} { grid-column-end: ${value}; }`;
      css += `\n.row-end-${key} { grid-row-end: ${value}; }`;
    });
  }

  return css;
};

// セキュリティチェック関数を強化
const isSafeValue = (value: string): boolean => {
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /<\/script/i,
    /on\w+\s*=/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /[@\\]/,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(value));
};

// CSS値エスケープ関数
const escapeValue = (value: string): string => {
  return value
    .replace(/\./g, '\\.')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/\*/g, '\\*')
    .replace(/\//g, '\\/')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/\^/g, '\\^')
    .replace(/\|/g, '\\|')
    .replace(/\?/g, '\\?')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
};

// CSS関数の値フォーマット関数
const formatCSSFunctionValue = (value: string): string => {
  return value
    .replace(/,/g, ', ')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*\*\s*/g, ' * ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
};

// カスタムスペーシングクラス抽出モック
const mockExtractCustomSpacingClasses = (content: string): string[] => {
  const customValuePattern =
    /\b(m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py|gap|gap-x|gap-y)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customSpacingClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // セキュリティチェック - CSS変数は許可
    if (!isSafeValue(value) && !value.includes('var(--')) {
      continue;
    }

    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix.startsWith('m')) {
      const property = 'margin';
      const direction = prefix.slice(1);

      if (direction === 'x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
        );
      }
    } else if (prefix.startsWith('p')) {
      const property = 'padding';
      const direction = prefix.slice(1);

      if (direction === 'x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
        );
      }
    } else if (prefix.startsWith('gap')) {
      if (prefix === 'gap-x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`
        );
      } else if (prefix === 'gap-y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`
        );
      }
    }
  }

  return customSpacingClasses;
};

// カスタム幅クラス抽出モック
const mockExtractCustomWidthClasses = (content: string): string[] => {
  const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customWidthClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'w') {
      customWidthClasses.push(`.w-\\[${escapeValue(value)}\\] { width: ${originalValue}; }`);
    } else if (prefix === 'min-w') {
      customWidthClasses.push(
        `.min-w-\\[${escapeValue(value)}\\] { min-width: ${originalValue}; }`
      );
    } else if (prefix === 'max-w') {
      customWidthClasses.push(
        `.max-w-\\[${escapeValue(value)}\\] { max-width: ${originalValue}; }`
      );
    }
  }

  return customWidthClasses;
};

// カスタム高さクラス抽出モック
const mockExtractCustomHeightClasses = (content: string): string[] => {
  const customValuePattern = /\b(h|min-h|max-h)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customHeightClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'h') {
      customHeightClasses.push(`.h-\\[${escapeValue(value)}\\] { height: ${originalValue}; }`);
    } else if (prefix === 'min-h') {
      customHeightClasses.push(
        `.min-h-\\[${escapeValue(value)}\\] { min-height: ${originalValue}; }`
      );
    } else if (prefix === 'max-h') {
      customHeightClasses.push(
        `.max-h-\\[${escapeValue(value)}\\] { max-height: ${originalValue}; }`
      );
    }
  }

  return customHeightClasses;
};

// カスタムグリッドクラス抽出モック

const mockExtractCustomGridClasses = (content: string): string[] => {
  const customValuePattern =
    /\b(grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customGridClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'grid-cols') {
      customGridClasses.push(
        `.grid-cols-\\[${escapeValue(value)}\\] { grid-template-columns: ${originalValue}; }`
      );
    } else if (prefix === 'grid-rows') {
      customGridClasses.push(
        `.grid-rows-\\[${escapeValue(value)}\\] { grid-template-rows: ${originalValue}; }`
      );
    } else if (prefix === 'col-span') {
      customGridClasses.push(
        `.col-span-\\[${escapeValue(value)}\\] { grid-column: span ${originalValue}; }`
      );
    } else if (prefix === 'row-span') {
      customGridClasses.push(
        `.row-span-\\[${escapeValue(value)}\\] { grid-row: span ${originalValue}; }`
      );
    } else if (prefix === 'col-start') {
      customGridClasses.push(
        `.col-start-\\[${escapeValue(value)}\\] { grid-column-start: ${originalValue}; }`
      );
    } else if (prefix === 'col-end') {
      customGridClasses.push(
        `.col-end-\\[${escapeValue(value)}\\] { grid-column-end: ${originalValue}; }`
      );
    } else if (prefix === 'row-start') {
      customGridClasses.push(
        `.row-start-\\[${escapeValue(value)}\\] { grid-row-start: ${originalValue}; }`
      );
    } else if (prefix === 'row-end') {
      customGridClasses.push(
        `.row-end-\\[${escapeValue(value)}\\] { grid-row-end: ${originalValue}; }`
      );
    } else if (prefix === 'grid-flow') {
      customGridClasses.push(
        `.grid-flow-\\[${escapeValue(value)}\\] { grid-auto-flow: ${originalValue}; }`
      );
    }
  }
  return customGridClasses;
};

// smsshcssパッケージをモック
vi.mock('smsshcss', () => ({
  generateCSS: vi.fn().mockImplementation((config) => Promise.resolve(generateMockCSS(config))),
  generateCSSSync: vi.fn().mockImplementation((config) => generateMockCSS(config)),
  generatePurgeReport: vi.fn().mockResolvedValue({
    totalClasses: 100,
    usedClasses: 50,
    purgedClasses: 50,
    buildTime: 100,
  }),
  extractCustomSpacingClasses: vi.fn().mockImplementation(mockExtractCustomSpacingClasses),
  extractCustomWidthClasses: vi.fn().mockImplementation(mockExtractCustomWidthClasses),
  extractCustomHeightClasses: vi.fn().mockImplementation(mockExtractCustomHeightClasses),
  extractCustomGridClasses: vi.fn().mockImplementation(mockExtractCustomGridClasses),
}));

// モッククリア関数
export function clearAllMocks(): void {
  vi.clearAllMocks();
}
