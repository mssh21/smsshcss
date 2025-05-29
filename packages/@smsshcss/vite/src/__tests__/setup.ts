import { vi } from 'vitest';

// SmsshCSSの設定の型定義
interface SmsshCSSConfig {
  content?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
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
  css += '\n.flex { display: block flex; }';
  css += '\n.grid { display: block grid; }';
  css += '\n.w-md { width: 1.25rem; }';
  css += '\n.w-lg { width: 2rem; }';
  css += '\n.min-w-md { min-width: var(--size-md); }';
  css += '\n.min-w-lg { min-width: var(--size-lg); }';
  css += '\n.max-w-md { max-width: var(--size-md); }';
  css += '\n.max-w-lg { max-width: var(--size-lg); }';
  css += '\n.w-full { width: 100%; }';

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
    });
  }

  if (config.theme?.display) {
    Object.entries(config.theme.display).forEach(([key, value]) => {
      css += `\n.${key} { display: ${value}; }`;
    });
  }

  return css;
};

// カスタム値エスケープ関数
const escapeValue = (val: string): string => {
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
};

// CSS関数フォーマット関数
const formatCSSFunctionValue = (input: string): string => {
  return input.replace(
    /(calc|min|max|clamp)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (match, funcName, inner) => {
      const processedInner = formatCSSFunctionValue(inner);
      const formattedInner = processedInner
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*([+\-*/])\s*/g, (match, operator, offset, str) => {
          if (operator === '-') {
            const beforeMatch = str.substring(0, offset);
            const prevNonSpaceMatch = beforeMatch.match(/(\S)\s*$/);
            const prevChar = prevNonSpaceMatch ? prevNonSpaceMatch[1] : '';
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

// カスタムスペーシングクラス抽出モック
const mockExtractCustomSpacingClasses = (content: string): string[] => {
  const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customSpacingClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'gap') {
      customSpacingClasses.push(`.gap-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`);
    } else if (prefix === 'gap-x') {
      customSpacingClasses.push(
        `.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`
      );
    } else if (prefix === 'gap-y') {
      customSpacingClasses.push(
        `.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`
      );
    } else if (prefix.startsWith('m')) {
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
}));

// モッククリア関数
export function clearAllMocks(): void {
  vi.clearAllMocks();
}
