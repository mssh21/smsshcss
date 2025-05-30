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
  css += '\n.m-md { margin: 1.25rem; }';
  css += '\n.mt-lg { margin-top: 2rem; }';
  css += '\n.mx-sm { margin-left: 0.75rem; margin-right: 0.75rem; }';
  css += '\n.p-md { padding: 1.25rem; }';
  css += '\n.p-lg { padding: 2rem; }';
  css += '\n.pt-lg { padding-top: 2rem; }';
  css += '\n.px-sm { padding-left: 0.75rem; padding-right: 0.75rem; }';
  css += '\n.gap-md { gap: 1.25rem; }';
  css += '\n.gap-x-md { column-gap: 1.25rem; }';
  css += '\n.gap-y-md { row-gap: 1.25rem; }';
  css += '\n.gap-x-lg { column-gap: 2rem; }';
  css += '\n.gap-y-lg { row-gap: 2rem; }';
  css += '\n.gap-xl { gap: 3.25rem; }';
  css += '\n.flex { display: flex; }';
  css += '\n.grid { display: grid; }';

  // Width classes - 全サイズをCSS変数形式で生成
  css += '\n.w-2xs { width: var(--size-2xs); }';
  css += '\n.w-xs { width: var(--size-xs); }';
  css += '\n.w-sm { width: var(--size-sm); }';
  css += '\n.w-md { width: var(--size-md); }';
  css += '\n.w-lg { width: var(--size-lg); }';
  css += '\n.w-xl { width: var(--size-xl); }';
  css += '\n.w-screen { width: 100vw; }';
  css += '\n.w-full { width: 100%; }';
  css += '\n.min-w-2xs { min-width: var(--size-2xs); }';
  css += '\n.min-w-lg { min-width: var(--size-lg); }';
  css += '\n.max-w-2xs { max-width: var(--size-2xs); }';
  css += '\n.max-w-lg { max-width: var(--size-lg); }';

  // Height classes - 全サイズをCSS変数形式で生成
  css += '\n.h-2xs { height: var(--size-2xs); }';
  css += '\n.h-xs { height: var(--size-xs); }';
  css += '\n.h-sm { height: var(--size-sm); }';
  css += '\n.h-md { height: var(--size-md); }';
  css += '\n.h-lg { height: var(--size-lg); }';
  css += '\n.h-xl { height: var(--size-xl); }';
  css += '\n.h-screen { height: 100vh; }';
  css += '\n.h-full { height: 100%; }';
  css += '\n.min-h-2xs { min-height: var(--size-2xs); }';
  css += '\n.min-h-lg { min-height: var(--size-lg); }';
  css += '\n.max-h-2xs { max-height: var(--size-2xs); }';
  css += '\n.max-h-lg { max-height: var(--size-lg); }';

  // Modern CSS units for compatibility tests
  css += '\n.h-dvh { height: 100dvh; }';
  css += '\n.w-dvw { width: 100dvw; }';

  // SmsshCSS Generated Styles
  css += '\n.w-full { width: 100%; }';
  css += '\n.h-md { height: 1.25rem; }';
  css += '\n.h-lg { height: 2rem; }';
  css += '\n.min-h-md { min-height: var(--size-md); }';
  css += '\n.min-h-lg { min-height: var(--size-lg); }';
  css += '\n.max-h-md { max-height: var(--size-md); }';
  css += '\n.max-h-lg { max-height: var(--size-lg); }';

  // カスタムテーマクラス
  if (config.theme?.spacing) {
    Object.entries(config.theme.spacing).forEach(([key, value]) => {
      css += `\n.m-${key} { margin: ${value}; }`;
      css += `\n.p-${key} { padding: ${value}; }`;
      css += `\n.gap-${key} { gap: ${value}; }`;
      css += `\n.gap-x-${key} { column-gap: ${value}; }`;
      css += `\n.gap-y-${key} { row-gap: ${value}; }`;
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
}));

// モッククリア関数
export function clearAllMocks(): void {
  vi.clearAllMocks();
}
