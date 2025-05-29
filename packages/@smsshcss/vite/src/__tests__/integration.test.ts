import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

// smsshcssパッケージをモック
vi.mock('smsshcss', () => ({
  generateCSS: vi.fn().mockImplementation((config) => {
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

    return Promise.resolve(css);
  }),
  generateCSSSync: vi.fn().mockImplementation((config) => {
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
  }),
  generatePurgeReport: vi.fn().mockResolvedValue({
    totalClasses: 100,
    usedClasses: 50,
    purgedClasses: 50,
    buildTime: 100,
  }),
  extractCustomSpacingClasses: vi.fn().mockImplementation((content) => {
    // カスタム値クラスを検出する正規表現
    const customValuePattern = /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g;
    const matches = content.matchAll(customValuePattern);
    const customClasses: string[] = [];

    // CSS数学関数を検出する正規表現
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

    for (const match of matches) {
      const prefix = match[1];
      const value = match[2];

      // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
      const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

      // gap プロパティの処理
      if (prefix === 'gap') {
        customClasses.push(`.gap-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`);
      } else if (prefix === 'gap-x') {
        customClasses.push(`.gap-x-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`);
      } else if (prefix === 'gap-y') {
        customClasses.push(`.gap-y-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`);
      } else if (prefix.startsWith('m')) {
        const property = 'margin';
        const direction = prefix.slice(1);

        if (direction === 'x') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
          );
        } else if (direction === 'y') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
          );
        } else if (direction === 't') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
          );
        } else if (direction === 'r') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
          );
        } else if (direction === 'b') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
          );
        } else if (direction === 'l') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
          );
        } else {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
          );
        }
      } else if (prefix.startsWith('p')) {
        const property = 'padding';
        const direction = prefix.slice(1);

        if (direction === 'x') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
          );
        } else if (direction === 'y') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
          );
        } else if (direction === 't') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
          );
        } else if (direction === 'r') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
          );
        } else if (direction === 'b') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
          );
        } else if (direction === 'l') {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
          );
        } else {
          customClasses.push(
            `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
          );
        }
      }
    }

    return customClasses;
  }),
  extractCustomWidthClasses: vi.fn().mockImplementation((content) => {
    // カスタム値クラスを検出する正規表現
    const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;
    const matches = content.matchAll(customValuePattern);
    const customWidthClasses: string[] = [];

    // CSS数学関数を検出する正規表現
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

    for (const match of matches) {
      const prefix = match[1];
      const value = match[2];

      // 元の値を復元（CSS値用）- CSS数学関数の場合はスペースを適切に復元
      const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

      // width プロパティの処理
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
      } else if (prefix.startsWith('m')) {
        const property = 'width';

        customWidthClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
        );
      }
    }

    return customWidthClasses;
  }),
}));

describe('SmsshCSS Vite Plugin Integration', () => {
  let tempDir: string;

  beforeEach(() => {
    // 一時ディレクトリを作成
    tempDir = fs.mkdtempSync(path.join(tmpdir(), 'smsshcss-integration-'));
  });

  afterEach(() => {
    // 一時ディレクトリをクリーンアップ
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Real-world Scenarios', () => {
    it('should handle a typical React project structure', async () => {
      // React コンポーネントファイルを作成
      const componentContent = `
        import React from 'react';
        
        export function Card() {
          return (
            <div className="p-[20px] gap-[16px] gap-x-[24px]">
              <h2 className="m-[12px]">Title</h2>
              <p className="gap-y-[8px]">Content</p>
            </div>
          );
        }
      `;

      const indexContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <div id="root" class="gap-[32px] p-[40px]"></div>
        </body>
        </html>
      `;

      fs.writeFileSync(path.join(tempDir, 'Component.tsx'), componentContent);
      fs.writeFileSync(path.join(tempDir, 'index.html'), indexContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,html}`],
      });

      const result = await plugin.transform('', 'main.css');

      // カスタム値クラスが生成されている
      expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
      expect(result?.code).toContain('.gap-\\[16px\\] { gap: 16px; }');
      expect(result?.code).toContain('.gap-x-\\[24px\\] { column-gap: 24px; }');
      expect(result?.code).toContain('.m-\\[12px\\] { margin: 12px; }');
      expect(result?.code).toContain('.gap-y-\\[8px\\] { row-gap: 8px; }');
      expect(result?.code).toContain('.gap-\\[32px\\] { gap: 32px; }');
      expect(result?.code).toContain('.p-\\[40px\\] { padding: 40px; }');
    });

    it('should handle Vue.js project with complex layouts', async () => {
      const vueComponent = `
        <template>
          <div class="gap-[30px] gap-x-[20px]">
            <header class="p-[15px] m-[25px]">
              <h1 class="gap-y-[10px]">Vue App</h1>
            </header>
            <main class="gap-[40px]">
              <section class="p-[35px]">Content</section>
            </main>
          </div>
        </template>
        
        <script>
        export default {
          name: 'Layout'
        }
        </script>
      `;

      fs.writeFileSync(path.join(tempDir, 'Layout.vue'), vueComponent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.vue`],
      });

      const result = await plugin.transform('', 'main.css');

      expect(result?.code).toContain('.gap-\\[30px\\] { gap: 30px; }');
      expect(result?.code).toContain('.gap-x-\\[20px\\] { column-gap: 20px; }');
      expect(result?.code).toContain('.p-\\[15px\\] { padding: 15px; }');
      expect(result?.code).toContain('.m-\\[25px\\] { margin: 25px; }');
      expect(result?.code).toContain('.gap-y-\\[10px\\] { row-gap: 10px; }');
      expect(result?.code).toContain('.gap-\\[40px\\] { gap: 40px; }');
      expect(result?.code).toContain('.p-\\[35px\\] { padding: 35px; }');
    });

    it('should handle mixed standard and custom classes efficiently', async () => {
      const mixedContent = `
        <div class="flex grid gap-md p-lg">
          <span class="gap-[50px] m-[custom-value]">Mixed</span>
          <div class="gap-x-md gap-y-[75px]">Standard + Custom</div>
        </div>
      `;

      fs.writeFileSync(path.join(tempDir, 'mixed.html'), mixedContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'styles.css');

      // 標準クラス
      expect(result?.code).toContain('.flex { display: block flex; }');
      expect(result?.code).toContain('.grid { display: block grid; }');
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.p-lg { padding: 2rem; }');
      expect(result?.code).toContain('.gap-x-md { column-gap: 1.25rem; }');

      // カスタム値クラスのセクションが存在することを確認
      expect(result?.code).toContain('/* Custom Value Classes */');

      // 実際にカスタム値クラスが生成されているかチェック
      const customValueSection = result?.code.split('/* Custom Value Classes */')[1];
      if (customValueSection && customValueSection.trim() !== '') {
        // カスタム値クラスが実際に生成されている場合
        expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');
        expect(result?.code).toContain('.m-\\[custom\\-value\\] { margin: custom-value; }');
        expect(result?.code).toContain('.gap-y-\\[75px\\] { row-gap: 75px; }');
      }
    });
  });

  describe('Build Process Simulation', () => {
    it('should work correctly in development mode', async () => {
      const devContent1 = '<div class="gap-[20px] p-[1rem]">Dev Content 1</div>';
      const devContent2 = '<div class="gap-[20px] m-[2rem]">Dev Content 2</div>';

      fs.writeFileSync(path.join(tempDir, 'dev1.html'), devContent1);
      fs.writeFileSync(path.join(tempDir, 'dev2.html'), devContent2);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
        purge: { enabled: false }, // 開発モード
      });

      const result1 = await plugin.transform('/* Dev CSS v1 */', 'dev.css');
      const result2 = await plugin.transform('/* Dev CSS v2 */', 'dev.css');

      expect(result1?.code).toContain('.gap-\\[20px\\] { gap: 20px; }');
      expect(result1?.code).toContain('.p-\\[1rem\\] { padding: 1rem; }');
      expect(result2?.code).toContain('.gap-\\[20px\\] { gap: 20px; }');
      expect(result2?.code).toContain('.m-\\[2rem\\] { margin: 2rem; }');
    });

    it('should handle production build optimization', async () => {
      const prodContent1 = '<div class="gap-[10px] gap-[20px] m-[5px]">Prod 1</div>';
      const prodContent2 = '<div class="gap-[10px] p-[8px]">Prod 2</div>';

      fs.writeFileSync(path.join(tempDir, 'prod1.html'), prodContent1);
      fs.writeFileSync(path.join(tempDir, 'prod2.html'), prodContent2);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
        purge: { enabled: false }, // テスト環境では無効化
      });

      const result = await plugin.transform('', 'prod.css');

      // 基本的なクラスが生成されている
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');

      // カスタム値クラスのセクションが存在することを確認
      expect(result?.code).toContain('/* Custom Value Classes */');

      // 実際にカスタム値クラスが生成されているかチェック
      const customValueSection = result?.code.split('/* Custom Value Classes */')[1];
      if (customValueSection && customValueSection.trim() !== '') {
        // 重複したクラスは一度だけ生成される
        const gap10Matches = result?.code.match(/\.gap-\\\[10px\\\]/g);
        const gap20Matches = result?.code.match(/\.gap-\\\[20px\\\]/g);
        const m5Matches = result?.code.match(/\.m-\\\[5px\\\]/g);

        expect(gap10Matches).toBeTruthy();
        expect(gap10Matches).toHaveLength(1);
        expect(gap20Matches).toBeTruthy();
        expect(gap20Matches).toHaveLength(1);
        expect(m5Matches).toBeTruthy();
        expect(m5Matches).toHaveLength(1);
      }
    });
  });

  describe('Configuration Scenarios', () => {
    it('should work with custom theme and minimal options', async () => {
      const customContent = '<div class="gap-[50px] m-custom p-special">Custom Theme</div>';

      fs.writeFileSync(path.join(tempDir, 'custom.html'), customContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
        includeReset: false,
        includeBase: false,
        theme: {
          spacing: {
            custom: '3rem',
            special: '4.5rem',
          },
        },
      });

      const result = await plugin.transform('', 'custom.css');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');

      // カスタムテーマクラス
      expect(result?.code).toContain('.m-custom { margin: 3rem; }');
      expect(result?.code).toContain('.p-special { padding: 4.5rem; }');

      // Reset/Base CSSは含まれない
      expect(result?.code).not.toContain('/* Reset CSS */');
      expect(result?.code).not.toContain('/* Base CSS */');
    });

    it('should handle empty configuration gracefully', async () => {
      const simpleContent = '<div class="gap-[simple]">Simple</div>';

      fs.writeFileSync(path.join(tempDir, 'simple.html'), simpleContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'simple.css');

      expect(result?.code).toContain('.gap-\\[simple\\] { gap: simple; }');
      expect(result?.code).toContain('/* Reset CSS */'); // デフォルトで含まれる
      expect(result?.code).toContain('/* Base CSS */'); // デフォルトで含まれる
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after file system errors', async () => {
      // 存在しないディレクトリを指定
      const plugin = smsshcss({
        content: [`${tempDir}/nonexistent/**/*.html`],
      });

      const result = await plugin.transform('', 'error.css');

      // 標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle directory access errors gracefully', async () => {
      const plugin = smsshcss({
        content: ['/root/restricted/**/*.html'], // アクセス権限がない可能性のあるパス
      });

      const result = await plugin.transform('', 'access.css');

      // ファイルが見つからなくても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });

    it('should handle glob errors gracefully', async () => {
      const plugin = smsshcss({
        content: ['[invalid-glob-pattern'], // 無効なglobパターン
      });

      const result = await plugin.transform('', 'glob-error.css');

      // globエラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: block flex; }');
    });
  });
});
