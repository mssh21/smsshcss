import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyPluginRegistry,
  generateApplyClasses,
  createApplyPlugin,
  createMultiPatternPlugin,
} from '../apply-system';
import '../apply-plugins'; // プラグインの自動登録

describe('Apply Plugin System', () => {
  beforeEach(() => {
    // テスト間でのプラグインの状態をクリーン
    // 実際にはregistryのクリア機能があればそれを使用
  });

  describe('applyPluginRegistry', () => {
    it('プラグインの登録とプラグイン一覧の取得ができる', () => {
      const testPlugin = createApplyPlugin({
        name: 'test-plugin',
        patterns: [/^test-(.+)$/],
        extractCSS: (utilityClass, match) => `test: ${match[1]};`,
      });

      applyPluginRegistry.register(testPlugin);
      const plugins = applyPluginRegistry.getRegisteredPlugins();

      expect(plugins).toContain('test-plugin');
    });

    it('ユーティリティクラスを正しく処理できる', () => {
      const testPlugin = createApplyPlugin({
        name: 'simple-test',
        patterns: [/^simple-test-(.+)$/],
        extractCSS: (utilityClass, match) => `test-property: ${match[1]};`,
      });

      applyPluginRegistry.register(testPlugin);
      const result = applyPluginRegistry.processUtility('simple-test-value');

      expect(result).toBe('test-property: value;');
    });

    it('マッチしないユーティリティクラスに対してnullを返す', () => {
      const result = applyPluginRegistry.processUtility('unknown-class');
      expect(result).toBeNull();
    });
  });

  describe('generateApplyClasses', () => {
    it('スペーシングユーティリティを正しく処理する', () => {
      const config = {
        'my-component': 'm-md p-sm',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.my-component');
      expect(result).toContain('margin: 1.25rem;');
      expect(result).toContain('padding: 0.75rem;');
    });

    it('サイズユーティリティを正しく処理する', () => {
      const config = {
        'sized-component': 'w-full h-svh',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.sized-component');
      expect(result).toContain('width: 100%;');
      expect(result).toContain('height: 100svh;');
    });

    it('カラーユーティリティを正しく処理する', () => {
      const config = {
        'colored-component': 'text-red-500 bg-blue-200',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.colored-component');
      expect(result).toContain('color:');
      expect(result).toContain('background-color:');
    });

    it('Flexboxユーティリティを正しく処理する', () => {
      const config = {
        'flex-component': 'flex flex-col items-center justify-between',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.flex-component');
      expect(result).toContain('display: flex;');
      expect(result).toContain('flex-direction: column;');
      expect(result).toContain('align-items: center;');
      expect(result).toContain('justify-content: space-between;');
    });

    it('複数のクラスを組み合わせて正しく処理する', () => {
      const config = {
        'complex-component':
          'flex items-center justify-center p-md m-sm w-full bg-red-500 text-white',
      };

      const result = generateApplyClasses(config);

      expect(result).toContain('.complex-component');
      // 各プロパティが含まれることを確認
      expect(result).toContain('display: flex;');
      expect(result).toContain('align-items: center;');
      expect(result).toContain('justify-content: center;');
      expect(result).toContain('padding: 1.25rem;');
      expect(result).toContain('margin: 0.75rem;');
      expect(result).toContain('width: 100%;');
    });

    it('空の設定に対して空文字を返す', () => {
      const result = generateApplyClasses();
      expect(result).toBe('');
    });

    it('空のユーティリティクラスリストを無視する', () => {
      const config = {
        'empty-component': '',
        'whitespace-only': '   ',
        'valid-component': 'm-md',
      };

      const result = generateApplyClasses(config);

      expect(result).not.toContain('empty-component');
      expect(result).not.toContain('whitespace-only');
      expect(result).toContain('valid-component');
    });
  });

  describe('createMultiPatternPlugin', () => {
    it('複数のパターンを持つプラグインを正しく作成する', () => {
      const plugin = createMultiPatternPlugin(
        'multi-test',
        [
          {
            pattern: /^prefix1-(.+)$/,
            handler: (utilityClass, match): string => `prop1: ${match[1]};`,
          },
          {
            pattern: /^prefix2-(.+)$/,
            handler: (utilityClass, match): string => `prop2: ${match[1]};`,
          },
        ],
        5
      );

      expect(plugin.name).toBe('multi-test');
      expect(plugin.priority).toBe(5);
      expect(plugin.patterns).toHaveLength(2);
    });
  });

  describe('プラグインの優先度', () => {
    it('優先度の高いプラグインが先に処理される', () => {
      const lowPriorityPlugin = createApplyPlugin({
        name: 'low-priority',
        patterns: [/^test-(.+)$/],
        extractCSS: () => 'low-priority: value;',
        priority: 1,
      });

      const highPriorityPlugin = createApplyPlugin({
        name: 'high-priority',
        patterns: [/^test-(.+)$/],
        extractCSS: () => 'high-priority: value;',
        priority: 10,
      });

      applyPluginRegistry.register(lowPriorityPlugin);
      applyPluginRegistry.register(highPriorityPlugin);

      const result = applyPluginRegistry.processUtility('test-something');

      // 高優先度のプラグインの結果が返されることを確認
      expect(result).toBe('high-priority: value;');
    });
  });
});

describe('Integration Tests', () => {
  it('全体的なワークフローが正常に動作する', () => {
    const config = {
      card: 'flex flex-col p-md m-md bg-white text-gray-800 w-full max-w-md',
      button: 'inline-flex items-center justify-center px-md py-sm bg-blue-500 text-white',
    };

    const result = generateApplyClasses(config);

    // カードコンポーネントのテスト
    expect(result).toContain('.card');
    expect(result).toMatch(/\.card\s*{[\s\S]*?}/);

    // ボタンコンポーネントのテスト
    expect(result).toContain('.button');
    expect(result).toMatch(/\.button\s*{[\s\S]*?}/);

    // 結果が空でないことを確認
    expect(result.trim()).not.toBe('');
  });
});
