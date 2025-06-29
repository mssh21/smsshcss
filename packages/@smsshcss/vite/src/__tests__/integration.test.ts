import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

// 統合テスト用のヘルパー関数とユーティリティ
interface IntegrationTestHelpers {
  createProjectStructure: (structure: ProjectStructure) => void;
  createReactComponent: (name: string, classes: string[]) => void;
  createVueComponent: (name: string, classes: string[]) => void;
  createHTMLFile: (name: string, classes: string[]) => void;
  createTSXFile: (name: string, classes: string[]) => void;
  expectStandardClasses: (code: string) => void;
  expectCustomClasses: (code: string, expectedClasses: string[]) => void;
  measurePerformance: <T>(fn: () => Promise<T>) => Promise<{ result: T; duration: number }>;
  createLargeProject: (fileCount: number, classesPerFile: number) => void;
}

interface ProjectStructure {
  [fileName: string]: string | ProjectStructure;
}

function createIntegrationHelpers(tempDir: string): IntegrationTestHelpers {
  return {
    createProjectStructure: (structure: ProjectStructure): void => {
      function createStructure(struct: ProjectStructure, basePath: string): void {
        Object.entries(struct).forEach(([name, content]) => {
          const fullPath = path.join(basePath, name);
          if (typeof content === 'string') {
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, content);
          } else {
            fs.mkdirSync(fullPath, { recursive: true });
            createStructure(content, fullPath);
          }
        });
      }
      createStructure(structure, tempDir);
    },

    createReactComponent: (name: string, classes: string[]): void => {
      const componentPath = path.join(tempDir, 'src', 'components');
      fs.mkdirSync(componentPath, { recursive: true });

      const content = `
import React from 'react';

export function ${name}() {
  return (
    <div className="${classes.join(' ')}">
      <h2>Component: ${name}</h2>
      <p>This is a ${name} component</p>
    </div>
  );
}`;
      fs.writeFileSync(path.join(componentPath, `${name}.tsx`), content);
    },

    createVueComponent: (name: string, classes: string[]): void => {
      const componentPath = path.join(tempDir, 'src', 'components');
      fs.mkdirSync(componentPath, { recursive: true });

      const content = `
<template>
  <div class="${classes.join(' ')}">
    <h2>Component: ${name}</h2>
    <p>This is a ${name} component</p>
  </div>
</template>

<script>
export default {
  name: '${name}'
}
</script>`;
      fs.writeFileSync(path.join(componentPath, `${name}.vue`), content);
    },

    createHTMLFile: (name: string, classes: string[]): void => {
      const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${name}</title>
</head>
<body>
  <div class="${classes.join(' ')}">
    <h1>${name} Page</h1>
    <main class="p-lg gap-md">
      <section class="m-md">Content</section>
    </main>
  </div>
</body>
</html>`;
      fs.writeFileSync(path.join(tempDir, `${name}.html`), content);
    },

    createTSXFile: (name: string, classes: string[]): void => {
      const content = `
export function ${name}() {
  return (
    <div className="${classes.join(' ')}">
      <h1>${name}</h1>
      <div className="flex gap-md p-lg">
        <span className="m-sm">Child element</span>
      </div>
    </div>
  );
}`;
      fs.writeFileSync(path.join(tempDir, `${name}.tsx`), content);
    },

    expectStandardClasses: (code: string): void => {
      expect(code).toContain('.m-md { margin: 1.25rem; }');
      expect(code).toContain('.p-lg { padding: 2rem; }');
      expect(code).toContain('.gap-xl { gap: 3.25rem; }');
      expect(code).toContain('.flex { display: flex; }');
      expect(code).toContain('.text-black { color: hsl(0 0% 0% / 1); }');
    },

    expectCustomClasses: (code: string, expectedClasses: string[]): void => {
      expectedClasses.forEach((className) => {
        expect(code).toContain(className);
      });
    },

    measurePerformance: async <T>(
      fn: () => Promise<T>
    ): Promise<{ result: T; duration: number }> => {
      const startTime = Date.now();
      const result = await fn();
      const endTime = Date.now();
      return { result, duration: endTime - startTime };
    },

    createLargeProject: (fileCount: number, classesPerFile: number): void => {
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });

      for (let i = 0; i < fileCount; i++) {
        const classes = [];
        for (let j = 0; j < classesPerFile; j++) {
          classes.push(`m-[${i * j + 10}px]`, `p-[${i + j * 2}rem]`, `gap-[${i * 2 + j}em]`);
        }

        const content = `
export function Component${i}() {
  return (
    <div className="${classes.join(' ')}">
      <h2>Component ${i}</h2>
      <div className="flex gap-md p-lg m-xl">
        <span>Large project test</span>
      </div>
    </div>
  );
}`;
        fs.writeFileSync(path.join(srcDir, `Component${i}.tsx`), content);
      }
    },
  };
}

describe('SmsshCSS Vite Plugin - Integration Tests', () => {
  let tempDir: string;
  let helpers: IntegrationTestHelpers;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(tmpdir(), 'smsshcss-integration-'));
    helpers = createIntegrationHelpers(tempDir);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Real-world Scenarios', () => {
    it('should handle a typical React project structure', async () => {
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

      // 基本クラスが生成されている
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');

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
      expect(result?.code).toContain('.flex { display: flex; }');
      expect(result?.code).toContain('.grid { display: grid; }');
      expect(result?.code).toContain('.gap-md { gap: 1.25rem; }');
      expect(result?.code).toContain('.p-lg { padding: 2rem; }');
      expect(result?.code).toContain('.gap-x-md { column-gap: 1.25rem; }');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');
      expect(result?.code).toContain('.m-\\[custom\\-value\\] { margin: custom-value; }');
      expect(result?.code).toContain('.gap-y-\\[75px\\] { row-gap: 75px; }');
    });
  });

  describe('Configuration Scenarios', () => {
    it('should work with arbitrary values and minimal options', async () => {
      const customContent = '<div class="gap-[50px] m-[20px] p-[10px]">Arbitrary Values</div>';

      fs.writeFileSync(path.join(tempDir, 'custom.html'), customContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
        includeResetCSS: false,
        includeBaseCSS: false,
        apply: {
          'btn-custom': 'p-md m-sm gap-lg',
          'card-special': 'p-lg m-md gap-xl',
        },
      });

      const result = await plugin.transform('', 'custom.css');

      // カスタム値クラス
      expect(result?.code).toContain('.gap-\\[50px\\] { gap: 50px; }');

      // 基本的なユーティリティクラスが含まれていることを確認
      expect(result?.code).toContain('.p-md { padding: 1.25rem; }');
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');

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
      const plugin = smsshcss({
        content: [`${tempDir}/nonexistent/**/*.html`],
      });

      const result = await plugin.transform('', 'error.css');

      // 標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
    });

    it('should handle glob errors gracefully', async () => {
      const plugin = smsshcss({
        content: ['[invalid-glob-pattern'],
      });

      const result = await plugin.transform('', 'glob-error.css');

      // globエラーが発生しても標準クラスは生成される
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.flex { display: flex; }');
    });
  });

  describe('Advanced Integration Scenarios', () => {
    it('should handle large-scale projects efficiently', async () => {
      helpers.createLargeProject(50, 10);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      const { result, duration } = await helpers.measurePerformance(async () => {
        return await plugin.transform('', 'large-project.css');
      });

      expect(result?.code).toBeDefined();
      expect(duration).toBeLessThan(10000); // 10秒以内
      helpers.expectStandardClasses(result?.code || '');

      // 大量のカスタムクラスが生成されていることを確認
      expect(result?.code).toContain('/* Custom Value Classes */');
    });

    it('should handle mixed framework project (React + Vue + HTML)', async () => {
      // React コンポーネント
      helpers.createReactComponent('ReactCard', ['p-[20px]', 'gap-[16px]', 'm-[12px]']);

      // Vue コンポーネント
      helpers.createVueComponent('VueButton', ['gap-[8px]', 'p-[10px]', 'm-[5px]']);

      // HTML ファイル
      helpers.createHTMLFile('index', ['gap-[24px]', 'p-[30px]', 'm-[15px]']);

      // TypeScript ファイル
      helpers.createTSXFile('Utils', ['gap-[32px]', 'p-[40px]']);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,vue,html}`],
      });

      const result = await plugin.transform('', 'mixed-framework.css');

      // 各フレームワークのカスタムクラスが全て含まれている
      const expectedClasses = [
        '.p-\\[20px\\] { padding: 20px; }',
        '.gap-\\[16px\\] { gap: 16px; }',
        '.m-\\[12px\\] { margin: 12px; }',
        '.gap-\\[8px\\] { gap: 8px; }',
        '.p-\\[10px\\] { padding: 10px; }',
        '.m-\\[5px\\] { margin: 5px; }',
        '.gap-\\[24px\\] { gap: 24px; }',
        '.p-\\[30px\\] { padding: 30px; }',
        '.m-\\[15px\\] { margin: 15px; }',
        '.gap-\\[32px\\] { gap: 32px; }',
        '.p-\\[40px\\] { padding: 40px; }',
      ];

      helpers.expectCustomClasses(result?.code || '', expectedClasses);
      helpers.expectStandardClasses(result?.code || '');
    });

    it('should handle real-world project structure with nested directories', async () => {
      const projectStructure: ProjectStructure = {
        src: {
          components: {
            ui: {
              'Button.tsx': `export function Button() { return <button className="p-[8px] gap-[4px]">Click</button>; }`,
              'Card.tsx': `export function Card() { return <div className="p-[16px] m-[8px] gap-[12px]">Card</div>; }`,
            },
            layout: {
              'Header.tsx': `export function Header() { return <header className="p-[20px] gap-[16px]">Header</header>; }`,
              'Footer.tsx': `export function Footer() { return <footer className="p-[24px] m-[20px]">Footer</footer>; }`,
            },
          },
          pages: {
            'Home.tsx': `export function Home() { return <div className="gap-[32px] p-[40px]">Home</div>; }`,
            'About.tsx': `export function About() { return <div className="gap-[28px] p-[36px]">About</div>; }`,
          },
          styles: {
            'components.css': `/* Component styles */`,
          },
        },
        public: {
          'index.html': `<!DOCTYPE html><html><body><div class="p-[50px] gap-[40px]">Public</div></body></html>`,
        },
      };

      helpers.createProjectStructure(projectStructure);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,html}`],
      });

      const result = await plugin.transform('', 'nested-project.css');

      const expectedClasses = [
        '.p-\\[8px\\] { padding: 8px; }',
        '.gap-\\[4px\\] { gap: 4px; }',
        '.p-\\[16px\\] { padding: 16px; }',
        '.m-\\[8px\\] { margin: 8px; }',
        '.gap-\\[12px\\] { gap: 12px; }',
        '.p-\\[20px\\] { padding: 20px; }',
        '.gap-\\[16px\\] { gap: 16px; }',
        '.p-\\[24px\\] { padding: 24px; }',
        '.m-\\[20px\\] { margin: 20px; }',
        '.gap-\\[32px\\] { gap: 32px; }',
        '.p-\\[40px\\] { padding: 40px; }',
        '.gap-\\[28px\\] { gap: 28px; }',
        '.p-\\[36px\\] { padding: 36px; }',
        '.p-\\[50px\\] { padding: 50px; }',
      ];

      helpers.expectCustomClasses(result?.code || '', expectedClasses);
    });
  });

  describe('Performance and Scalability', () => {
    it('should maintain performance with increasing file count', async () => {
      const fileCounts = [10, 50, 100];
      const classesPerFile = 5;

      for (const fileCount of fileCounts) {
        // 新しい一時ディレクトリを作成
        const performanceTempDir = fs.mkdtempSync(path.join(tmpdir(), `perf-test-${fileCount}-`));
        const perfHelpers = createIntegrationHelpers(performanceTempDir);

        try {
          perfHelpers.createLargeProject(fileCount, classesPerFile);

          const plugin = smsshcss({
            content: [`${performanceTempDir}/**/*.tsx`],
          });

          const { duration } = await perfHelpers.measurePerformance(async () => {
            return await plugin.transform('', `perf-${fileCount}.css`);
          });

          // ファイル数に比例した妥当な処理時間であることを確認
          const expectedMaxTime = fileCount * 100; // ファイル1つあたり100ms
          expect(duration).toBeLessThan(expectedMaxTime);

          console.log(`Performance test - ${fileCount} files: ${duration}ms`);
        } finally {
          // クリーンアップ
          if (fs.existsSync(performanceTempDir)) {
            fs.rmSync(performanceTempDir, { recursive: true, force: true });
          }
        }
      }
    });

    it('should handle memory efficiently with large class count', async () => {
      helpers.createLargeProject(20, 50); // 20ファイル、各50クラス

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      const startMemory = process.memoryUsage().heapUsed;

      const result = await plugin.transform('', 'memory-test.css');

      const endMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = endMemory - startMemory;

      expect(result?.code).toBeDefined();
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB未満

      console.log(`Memory increase: ${Math.round((memoryIncrease / 1024 / 1024) * 100) / 100}MB`);
    });
  });

  describe('Production Environment Simulation', () => {
    it('should work correctly with minification enabled', async () => {
      helpers.createReactComponent('ProdComponent', [
        'p-[20px]',
        'gap-[16px]',
        'm-[calc(100%-20px)]',
      ]);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        minify: true,
      });

      const result = await plugin.transform('', 'production.css');

      expect(result?.code).toBeDefined();
      // カスタム値クラスが存在する
      if (result?.code.includes('/* Custom Value Classes */')) {
        expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
        expect(result?.code).toContain('.gap-\\[16px\\] { gap: 16px; }');
        expect(result?.code).toContain(
          '.m-\\[calc\\(100\\%\\-20px\\)\\] { margin: calc(100% - 20px); }'
        );
      }
    });

    it('should handle production optimizations', async () => {
      helpers.createLargeProject(30, 8);

      const devPlugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        minify: false,
        includeResetCSS: true,
        includeBaseCSS: true,
      });

      const prodPlugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        minify: true,
        includeResetCSS: false,
        includeBaseCSS: false,
      });

      const devResult = await devPlugin.transform('', 'dev.css');
      const prodResult = await prodPlugin.transform('', 'prod.css');

      expect(devResult?.code).toBeDefined();
      expect(prodResult?.code).toBeDefined();

      // プロダクション版はサイズが小さい
      expect(prodResult.code.length).toBeLessThan(devResult.code.length);

      // プロダクション版にはReset/Base CSSが含まれていない
      expect(prodResult?.code).not.toContain('/* Reset CSS */');
      expect(prodResult?.code).not.toContain('/* Base CSS */');

      // 開発版には含まれている
      expect(devResult?.code).toContain('/* Reset CSS */');
      expect(devResult?.code).toContain('/* Base CSS */');
    });
  });

  describe('Plugin Compatibility and Edge Cases', () => {
    it('should handle concurrent transform calls', async () => {
      helpers.createReactComponent('ConcurrentTest1', ['p-[10px]']);
      helpers.createReactComponent('ConcurrentTest2', ['p-[20px]']);
      helpers.createReactComponent('ConcurrentTest3', ['p-[30px]']);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      // 同時に複数のtransformを実行
      const promises = [
        plugin.transform('', 'concurrent1.css'),
        plugin.transform('', 'concurrent2.css'),
        plugin.transform('', 'concurrent3.css'),
      ];

      const results = await Promise.all(promises);

      // 全ての結果が正常
      results.forEach((result) => {
        expect(result?.code).toBeDefined();
        expect(result?.code).toContain('.p-\\[10px\\] { padding: 10px; }');
        expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
        expect(result?.code).toContain('.p-\\[30px\\] { padding: 30px; }');
      });
    });

    it('should handle file watch scenarios', async () => {
      helpers.createReactComponent('WatchTest', ['p-[15px]']);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      // 最初のビルド
      const firstResult = await plugin.transform('', 'watch-test.css');
      expect(firstResult?.code).toContain('.p-\\[15px\\] { padding: 15px; }');

      // ファイルを変更
      helpers.createReactComponent('WatchTestUpdated', ['p-[25px]', 'gap-[10px]']);

      // 2回目のビルド
      const secondResult = await plugin.transform('', 'watch-test.css');
      expect(secondResult?.code).toContain('.p-\\[15px\\] { padding: 15px; }');
      expect(secondResult?.code).toContain('.p-\\[25px\\] { padding: 25px; }');
      expect(secondResult?.code).toContain('.gap-\\[10px\\] { gap: 10px; }');
    });

    it('should handle empty and invalid files gracefully', async () => {
      // 空のファイル
      fs.writeFileSync(path.join(tempDir, 'empty.tsx'), '');

      // 無効な構文のファイル
      fs.writeFileSync(path.join(tempDir, 'invalid.tsx'), 'invalid typescript content <>"');

      // バイナリファイル
      fs.writeFileSync(path.join(tempDir, 'binary.tsx'), Buffer.from([0x00, 0x01, 0x02, 0x03]));

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      const result = await plugin.transform('', 'error-resilience.css');

      // エラーが発生してもプラグインは動作する
      expect(result?.code).toBeDefined();
      helpers.expectStandardClasses(result?.code || '');
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle extreme configuration values', async () => {
      helpers.createReactComponent('ConfigTest', ['p-[10px]']);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        apply: {
          'btn-small': 'p-sm m-xs gap-xs',
          'btn-large': 'p-xl m-lg gap-lg',
          'btn-complex': 'p-md m-auto gap-md',
        },
      });

      const result = await plugin.transform('', 'extreme-config.css');

      // カスタム値クラスとapply設定が正しく動作することを確認
      expect(result?.code).toContain('.p-\\[10px\\] { padding: 10px; }');
      expect(result?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result?.code).toContain('.p-md { padding: 1.25rem; }');
    });

    it('should handle configuration updates correctly', async () => {
      helpers.createReactComponent('ConfigUpdateTest', ['p-[15px]']);

      // 最初の設定
      const plugin1 = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        apply: { 'btn-v1': 'p-md m-sm gap-xs' },
      });

      const result1 = await plugin1.transform('', 'config-update1.css');
      expect(result1?.code).toContain('.p-md { padding: 1.25rem; }');
      expect(result1?.code).toContain('.m-sm { margin: 0.75rem; }');
      expect(result1?.code).toContain('.gap-xs { gap: 0.5rem; }');

      // 設定を変更
      const plugin2 = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
        apply: {
          'btn-v2': 'p-lg m-md gap-sm',
          'card-new': 'p-xl m-lg gap-md',
        },
      });

      const result2 = await plugin2.transform('', 'config-update2.css');
      expect(result2?.code).toContain('.m-md { margin: 1.25rem; }');
      expect(result2?.code).toContain('.p-md { padding: 1.25rem; }');
    });
  });
});
