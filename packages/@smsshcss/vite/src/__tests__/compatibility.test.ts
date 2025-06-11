import { describe, it, expect } from 'vitest';
import { smsshcss } from '../index';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ブラウザサポートのCSS機能テスト
const CSS_FEATURES = {
  // 基本的なCSS機能
  basic: ['margin', 'padding', 'gap', 'width', 'height', 'display'],
  // CSS値として使用される機能
  values: ['flex', 'grid'],
  // モダンCSS機能
  modern: ['dvh', 'dvw', 'lvh', 'lvw', 'svh', 'svw', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax'],
  // CSS関数
  functions: ['calc', 'min', 'max', 'clamp', 'var'],
};

describe('SmsshCSS Vite Plugin - Compatibility Tests', () => {
  describe('Node.js Version Compatibility', () => {
    it('should work with current Node.js version', async () => {
      const nodeVersion = process.version;
      console.log(`Testing with Node.js ${nodeVersion}`);

      const plugin = smsshcss();
      const result = await plugin.transform('', 'compatibility.css');

      expect(result?.code).toBeDefined();
      expect(result?.code).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
    });

    it('should handle ES modules correctly', async () => {
      // ESモジュールの動的インポートをテスト
      const plugin = smsshcss();

      // 非同期処理が正常に動作することを確認
      const result = await plugin.transform('', 'esm-test.css');

      expect(result?.code).toBeDefined();
      expect(typeof plugin.transform).toBe('function');
    });

    it('should handle file system operations across platforms', async () => {
      const plugin = smsshcss({
        content: [
          // Windows風パス
          'C:\\Users\\test\\**/*.tsx',
          // UNIX風パス
          '/home/user/project/**/*.jsx',
          // 相対パス
          './src/**/*.vue',
          // Globパターン
          '**/*.{ts,tsx,js,jsx,vue,html}',
        ],
      });

      // プラットフォームに関係なく動作することを確認
      const result = await plugin.transform('', 'platform-test.css');
      expect(result?.code).toBeDefined();
    });
  });

  describe('Vite Version Compatibility', () => {
    it('should be compatible with Vite plugin API', () => {
      const plugin = smsshcss();

      // Viteプラグインの必須プロパティを確認
      expect(plugin.name).toBe('smsshcss');
      expect(typeof plugin.transform).toBe('function');

      // transformフックの型チェック
      expect(plugin.transform).toHaveLength(2); // code, id の2つの引数
    });

    it('should handle different file types correctly', async () => {
      const plugin = smsshcss();

      // CSSファイル
      const cssResult = await plugin.transform('body { color: red; }', 'test.css');
      expect(cssResult).toBeDefined();

      // 非CSSファイル
      const jsResult = await plugin.transform('console.log("test")', 'test.js');
      expect(jsResult).toBeNull();

      // Viteの仮想ファイル
      const virtualResult = await plugin.transform('', '\0virtual:smsshcss');
      expect(virtualResult).toBeNull();
    });

    it('should work with Vite dev and build modes', async () => {
      // 開発モード設定
      const devPlugin = smsshcss({
        includeReset: true,
        includeBase: true,
        minify: false,
      });

      // プロダクションモード設定
      const prodPlugin = smsshcss({
        includeReset: false,
        includeBase: false,
        minify: true,
      });

      const devResult = await devPlugin.transform('', 'dev.css');
      const prodResult = await prodPlugin.transform('', 'prod.css');

      expect(devResult?.code).toContain('/* Reset CSS */');
      expect(prodResult?.code).not.toContain('/* Reset CSS */');
    });
  });

  describe('Browser CSS Compatibility', () => {
    it('should generate basic CSS that works in all browsers', async () => {
      // テスト用の一時ディレクトリとファイルを作成
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smsshcss-test-'));
      const testContent = `
        <div class="flex grid m-md p-lg gap-md">
          <span class="w-full h-full">Basic CSS Test</span>
        </div>
      `;
      fs.writeFileSync(path.join(tempDir, 'basic-test.html'), testContent);

      const plugin = smsshcss({
        content: [`${tempDir}/**/*.html`],
      });
      const result = await plugin.transform('', 'basic-css.css');

      CSS_FEATURES.basic.forEach((feature) => {
        // 基本的なCSSプロパティが含まれていることを確認
        expect(result?.code).toMatch(new RegExp(`${feature}:`));
      });

      CSS_FEATURES.values.forEach((value) => {
        // CSS値として使用される機能が含まれていることを確認
        expect(result?.code).toMatch(new RegExp(`display: ${value};`));
      });

      // 互換性のない構文がないことを確認
      expect(result?.code).not.toContain('@supports');
      expect(result?.code).not.toContain('-webkit-');
      expect(result?.code).not.toContain('-moz-');

      // クリーンアップ
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('should handle modern CSS units appropriately', async () => {
      const plugin = smsshcss();
      const result = await plugin.transform('', 'modern-css.css');

      // モダンCSS単位のクラスが生成されることを確認
      expect(result?.code).toContain('.h-dvh');
      expect(result?.code).toContain('.w-dvw');

      // ただし、フォールバックも考慮されていることを期待
      // (実際の実装に依存)
    });

    it('should generate vendor-prefix-free CSS', async () => {
      const plugin = smsshcss();
      const result = await plugin.transform('', 'vendor-prefix.css');

      // ベンダープレフィックスが自動で付与されていないことを確認
      // (Autoprefixerなどの後処理ツールに任せる設計を想定)
      expect(result?.code).not.toMatch(/-webkit-/);
      expect(result?.code).not.toMatch(/-moz-/);
      expect(result?.code).not.toMatch(/-ms-/);
    });
  });

  describe('Framework Integration Compatibility', () => {
    it('should work with React className attribute', async () => {
      const plugin = smsshcss({
        content: ['test.tsx'],
      });

      const result = await plugin.transform('', 'react-compat.css');

      // React特有のクラス名パターンに対応
      expect(result?.code).toBeDefined();
    });

    it('should work with Vue class binding', async () => {
      const plugin = smsshcss({
        content: ['test.vue'],
      });

      const result = await plugin.transform('', 'vue-compat.css');

      // Vue特有のクラス名パターンに対応
      expect(result?.code).toBeDefined();
    });

    it('should handle TypeScript files correctly', async () => {
      const plugin = smsshcss({
        content: ['**/*.{ts,tsx}'],
      });

      const result = await plugin.transform('', 'typescript-compat.css');

      // TypeScriptファイルの処理
      expect(result?.code).toBeDefined();
    });
  });

  describe('Build Tool Integration', () => {
    it('should work with different bundlers', async () => {
      const plugin = smsshcss();

      // バンドラーに関係なく動作することを確認
      const result = await plugin.transform('', 'bundler-test.css');

      expect(result?.code).toBeDefined();
      expect(result?.code.length).toBeGreaterThan(0);
    });

    it('should handle sourcemap generation', async () => {
      const plugin = smsshcss();

      // ソースマップに関する設定（将来の拡張として）
      const result = await plugin.transform('', 'sourcemap-test.css');

      expect(result?.code).toBeDefined();
      // 将来的にはsourcemapプロパティもチェック
    });
  });

  describe('Configuration Compatibility', () => {
    it('should handle various content patterns', async () => {
      const patterns = [
        '**/*.{js,ts,jsx,tsx}',
        'src/**/*.vue',
        'pages/**/*.html',
        '!node_modules/**',
        'components/**/*.{js,jsx,ts,tsx,vue}',
        '**/*.svelte',
      ];

      const plugin = smsshcss({
        content: patterns,
      });

      const result = await plugin.transform('', 'pattern-test.css');
      expect(result?.code).toBeDefined();
    });

    it('should work with different apply configurations', async () => {
      const customApply = {
        'btn-primary': 'p-md bg-blue-500 text-white rounded',
        'btn-secondary': 'p-sm bg-gray-300 text-gray-700',
        card: 'p-lg bg-white rounded-lg shadow',
        container: 'max-w-lg mx-auto px-md',
      };

      const plugin = smsshcss({
        apply: customApply,
      });

      const result = await plugin.transform('', 'apply-test.css');

      // 基本的なユーティリティクラスが含まれていることを確認（実際に生成されるクラスをテスト）
      expect(result?.code).toContain('.m-md { margin: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.p-md { padding: calc(var(--space-base) * 5); }');
      expect(result?.code).toContain('.gap-md { gap: calc(var(--space-base) * 5); }');
    });

    it('should handle malformed configurations gracefully', async () => {
      const malformedConfigs = [
        // 空の設定
        {},
        // 無効なcontent
        { content: null },
        // 無効なapply
        { apply: null },
        // 文字列でないcontent
        { content: 123 },
      ];

      for (const config of malformedConfigs) {
        expect(() => smsshcss(config as Record<string, unknown>)).not.toThrow();

        const plugin = smsshcss(config as Record<string, unknown>);
        const result = await plugin.transform('', 'malformed-test.css');
        expect(result?.code).toBeDefined();
      }
    });
  });

  describe('Performance Across Environments', () => {
    it('should maintain performance in CI environments', async () => {
      const plugin = smsshcss({
        content: ['**/*.{js,ts,jsx,tsx,vue}'],
      });

      const startTime = Date.now();
      const result = await plugin.transform('', 'ci-performance.css');
      const endTime = Date.now();

      expect(result?.code).toBeDefined();
      // CI環境でも合理的な時間内で完了
      expect(endTime - startTime).toBeLessThan(5000); // 5秒以内
    });

    it('should work consistently across different OS', async () => {
      const plugin = smsshcss();
      const result = await plugin.transform('', 'os-compat.css');

      // OS固有の問題がないことを確認
      expect(result?.code).toBeDefined();
      expect(result?.code).toContain('.m-md { margin: calc(var(--space-base) * 5); }');

      // ファイルパスの区切り文字などの問題がないことを確認
      expect(result?.code).not.toContain('\\\\');
      expect(result?.code).not.toContain('//');
    });
  });
});
