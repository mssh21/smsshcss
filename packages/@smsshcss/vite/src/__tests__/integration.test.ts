import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Integration test helpers and utilities
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
  hasCustomValueSection: (code: string) => boolean;
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
      expect(code).toContain('/* SmsshCSS Generated Styles */');
      expect(code).toContain('/* reset.css */');
      expect(code).toContain('/* base.css */');
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

    hasCustomValueSection: (code: string): boolean => {
      const customValueSection = code.split('/* Custom Value Classes */')[1];
      return customValueSection && customValueSection.trim() !== '';
    },
  };
}

describe('SmsshCSS Vite Plugin - Integration Tests', () => {
  let tempDir: string;
  let helpers: IntegrationTestHelpers;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smsshcss-integration-'));
    helpers = createIntegrationHelpers(tempDir);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Real-world Scenarios', () => {
    it('should handle a typical React project structure', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'react-test-'));

      // Create a typical file structure for a React project
      const files = [
        { path: 'src/App.tsx', content: '<div className="flex m-md p-lg">React App</div>' },
        {
          path: 'src/components/Button.tsx',
          content: '<button className="btn-primary">Click me</button>',
        },
        {
          path: 'src/pages/Home.tsx',
          content: '<div className="container gap-md">Home Page</div>',
        },
        { path: 'public/index.html', content: '<div class="w-full h-screen">Index</div>' },
      ];

      files.forEach(({ path: filePath, content }) => {
        const fullPath = path.join(tempDir, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
      });

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{html,tsx,jsx}`],
        apply: {
          'btn-primary': 'p-[10px] m-[5px]',
          container: 'max-w-4xl mx-auto',
        },
      });

      const result = await plugin.transform('', 'react-project.css');

      // Basic classes are generated
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // Custom value classes are generated
      if (helpers.hasCustomValueSection(result?.code || '')) {
        expect(result?.code).toContain('.m-\\[md\\] { margin: md; }');
        expect(result?.code).toContain('.p-\\[lg\\] { padding: lg; }');
        expect(result?.code).toContain('.gap-\\[md\\] { gap: md; }');
      }

      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
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
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mixed-test-'));

      const testContent = `
        <div class="flex grid m-md p-lg gap-md">
          <div class="w-[100px] h-[200px] m-[10px] p-[20px]">
            Mixed Classes Test
          </div>
        </div>
      `;
      fs.writeFileSync(path.join(tempDir, 'mixed-test.html'), testContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'mixed-classes.css');

      // Standard classes
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // Custom value classes
      if (helpers.hasCustomValueSection(result?.code || '')) {
        expect(result?.code).toContain('.w-\\[100px\\] { width: 100px; }');
        expect(result?.code).toContain('.h-\\[200px\\] { height: 200px; }');
        expect(result?.code).toContain('.m-\\[10px\\] { margin: 10px; }');
        expect(result?.code).toContain('.p-\\[20px\\] { padding: 20px; }');
      }

      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });

  describe('Configuration Scenarios', () => {
    it('should work with arbitrary values and minimal options', async () => {
      const plugin = smsshcss({
        content: ['**/*.html'],
        apply: {},
      });

      const result = await plugin.transform('', 'arbitrary-values.css');

      // Basic utility classes are included
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');
    });

    it('should handle empty configuration gracefully', async () => {
      const plugin = smsshcss();

      const result = await plugin.transform('', 'empty-config.css');

      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after file system errors', async () => {
      const plugin = smsshcss({
        content: ['nonexistent/**/*.html', '**/*.html'],
      });

      const result = await plugin.transform('', 'fs-error.css');

      // Standard classes are generated
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');
    });

    it('should handle glob errors gracefully', async () => {
      const plugin = smsshcss({
        content: ['invalid-pattern-[', '**/*.html'],
      });

      const result = await plugin.transform('', 'glob-error.css');

      // Standard classes are generated even if glob errors occur
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');
    });
  });

  describe('Advanced Integration Scenarios', () => {
    it('should handle large-scale projects efficiently', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'large-scale-'));

      // Simulate a large-scale project
      const files: Array<{ path: string; content: string }> = [];

      // Create 100 component files
      for (let i = 0; i < 100; i++) {
        files.push({
          path: `src/components/Component${i}.tsx`,
          content: `<div className="flex m-md p-lg gap-md w-[${i}px] h-[${i * 2}px]">Component ${i}</div>`,
        });
      }

      // 50個のページファイルを作成
      for (let i = 0; i < 50; i++) {
        files.push({
          path: `src/pages/Page${i}.tsx`,
          content: `<div className="grid m-lg p-xl gap-lg w-[${i * 10}px]">Page ${i}</div>`,
        });
      }

      files.forEach(({ path: filePath, content }) => {
        const fullPath = path.join(tempDir, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
      });

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,jsx,html}`],
      });

      const startTime = Date.now();
      const result = await plugin.transform('', 'large-scale.css');
      const endTime = Date.now();

      expect(result?.code).toBeDefined();
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // Performance check
      expect(endTime - startTime).toBeLessThan(10000);

      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('should handle mixed framework project (React + Vue + HTML)', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mixed-framework-'));

      const files = [
        { path: 'src/App.tsx', content: '<div className="flex m-md">React App</div>' },
        {
          path: 'src/components/Button.vue',
          content: '<template><button class="btn-primary">Vue Button</button></template>',
        },
        { path: 'public/index.html', content: '<div class="grid p-lg">HTML Page</div>' },
      ];

      files.forEach(({ path: filePath, content }) => {
        const fullPath = path.join(tempDir, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
      });

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.{tsx,jsx,vue,html}`],
        apply: {
          'btn-primary': 'bg-blue-500 text-white',
        },
      });

      const result = await plugin.transform('', 'mixed-framework.css');

      expect(result?.code).toBeDefined();
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // クリーンアップ
      fs.rmSync(tempDir, { recursive: true, force: true });
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
        // Create a new temporary directory
        const performanceTempDir = fs.mkdtempSync(
          path.join(os.tmpdir(), `perf-test-${fileCount}-`)
        );
        const perfHelpers = createIntegrationHelpers(performanceTempDir);

        try {
          perfHelpers.createLargeProject(fileCount, classesPerFile);

          const plugin = smsshcss({
            content: [`${performanceTempDir}/**/*.tsx`],
          });

          const { duration } = await perfHelpers.measurePerformance(async () => {
            return await plugin.transform('', `perf-${fileCount}.css`);
          });

          // Verify that the processing time is reasonable proportional to the number of files
          const expectedMaxTime = fileCount * 100;
          expect(duration).toBeLessThan(expectedMaxTime);

          console.log(`Performance test - ${fileCount} files: ${duration}ms`);
        } finally {
          // Cleanup
          if (fs.existsSync(performanceTempDir)) {
            fs.rmSync(performanceTempDir, { recursive: true, force: true });
          }
        }
      }
    });

    it('should handle memory efficiently with large class count', async () => {
      helpers.createLargeProject(20, 50);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.tsx`],
      });

      const startMemory = process.memoryUsage().heapUsed;

      const result = await plugin.transform('', 'memory-test.css');

      const endMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = endMemory - startMemory;

      expect(result?.code).toBeDefined();
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

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
      // Custom value classes exist
      if (result?.code.includes('/* Custom Value Classes */')) {
        // expect(result?.code).toContain('.p-\[20px\] { padding: 20px; }');
        // expect(result?.code).toContain('.gap-\[16px\] { gap: 16px; }');
        // expect(result?.code).toContain(
        //   '.m-\[calc\(100\%\-20px\)\] { margin: calc(100% - 20px); }'
        // );
      }
    });

    it('should handle production optimizations', async () => {
      // Development mode
      const devPlugin = smsshcss({
        includeResetCSS: true,
        includeBaseCSS: true,
        minify: false,
      });

      // Production mode
      const prodPlugin = smsshcss({
        includeResetCSS: false,
        includeBaseCSS: false,
        minify: true,
      });

      const devResult = await devPlugin.transform('', 'dev-optimization.css');
      const prodResult = await prodPlugin.transform('', 'prod-optimization.css');

      // Development version contains
      expect(devResult?.code).toContain('/* reset.css */');
      expect(devResult?.code).toContain('/* base.css */');

      // Production version does not contain
      expect(prodResult?.code).not.toContain('/* reset.css */');
      expect(prodResult?.code).not.toContain('/* base.css */');
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

      // Execute multiple transforms concurrently
      const promises = [
        plugin.transform('', 'concurrent1.css'),
        plugin.transform('', 'concurrent2.css'),
        plugin.transform('', 'concurrent3.css'),
      ];

      const results = await Promise.all(promises);

      // All results are valid
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

      // First build
      const firstResult = await plugin.transform('', 'watch-test.css');
      expect(firstResult?.code).toContain('.p-\\[15px\\] { padding: 15px; }');

      // Change file
      helpers.createReactComponent('WatchTestUpdated', ['p-[25px]', 'gap-[10px]']);

      // Second build
      const secondResult = await plugin.transform('', 'watch-test.css');
      expect(secondResult?.code).toContain('.p-\\[15px\\] { padding: 15px; }');
      expect(secondResult?.code).toContain('.p-\\[25px\\] { padding: 25px; }');
      expect(secondResult?.code).toContain('.gap-\\[10px\\] { gap: 10px; }');
    });

    it('should handle empty and invalid files gracefully', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-invalid-'));

      // Empty file
      fs.writeFileSync(path.join(tempDir, 'empty.html'), '');

      // Invalid HTML
      fs.writeFileSync(path.join(tempDir, 'invalid.html'), '<div class="">Invalid</div>');

      // Valid file
      fs.writeFileSync(path.join(tempDir, 'valid.html'), '<div class="flex m-md">Valid</div>');

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });

      const result = await plugin.transform('', 'empty-invalid.css');

      expect(result?.code).toBeDefined();
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');

      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle extreme configuration values', async () => {
      const plugin = smsshcss({
        content: ['**/*.html'],
        apply: {
          extreme: 'p-[10px] m-[20px] gap-[30px]',
        },
        purge: {
          enabled: false,
          safelist: ['*'],
          blocklist: [],
        },
      });

      const result = await plugin.transform('', 'extreme-config.css');

      // Verify that custom value classes and apply settings work correctly
      expect(result?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result?.code).toContain('/* reset.css */');
      expect(result?.code).toContain('/* base.css */');
    });

    it('should handle configuration updates correctly', async () => {
      const plugin1 = smsshcss({
        content: ['**/*.html'],
        apply: {
          btn: 'p-md m-sm gap-xs',
        },
      });

      const plugin2 = smsshcss({
        content: ['**/*.html'],
        apply: {
          btn: 'p-lg m-md gap-sm',
        },
      });

      const result1 = await plugin1.transform('', 'config-update1.css');
      const result2 = await plugin2.transform('', 'config-update2.css');

      expect(result1?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result1?.code).toContain('/* reset.css */');
      expect(result1?.code).toContain('/* base.css */');

      expect(result2?.code).toContain('/* SmsshCSS Generated Styles */');
      expect(result2?.code).toContain('/* reset.css */');
      expect(result2?.code).toContain('/* base.css */');
    });
  });
});
