# SmsshCSS テストガイド

## 概要

このドキュメントは、SmsshCSSライブラリでユーティリティクラスを追加・更新する際のテスト戦略とベストプラクティスを説明します。

## 📋 目次

1. [新しいユーティリティクラスの追加](#新しいユーティリティクラスの追加)
2. [既存ユーティリティクラスの更新](#既存ユーティリティクラスの更新)
3. [テストケースの書き方](#テストケースの書き方)
4. [モックデータの管理](#モックデータの管理)
5. [回帰テストの実行](#回帰テストの実行)
6. [パフォーマンステスト](#パフォーマンステスト)
7. [トラブルシューティング](#トラブルシューティング)

## 🆕 新しいユーティリティクラスの追加

### 1. テストデータの更新

新しいユーティリティクラスを追加する際は、まず `setup.ts` のモックデータを更新します：

```typescript
// packages/smsshcss/src/__tests__/setup.ts
export const mockFileContents = {
  'test.html': '<div class="p-md m-sm block new-utility-class">Test</div>',
  'component.tsx': '<div className="flex p-lg new-utility-class">Component</div>',
  // ... 他のファイル
};
```

### 2. 基本テストケースの追加

新しいユーティリティクラスごとに基本的なテストケースを追加：

```typescript
// packages/smsshcss/src/__tests__/generator.test.ts
describe('New Utility Class Generation', () => {
  it('should generate new utility class', () => {
    const generator = new CSSGenerator(testConfigs.minimal);
    const result = generator.generateFullCSSSync();

    // 新しいクラスが生成されていることを確認
    expect(cssValidators.hasClass(result, 'new-utility-class')).toBe(true);

    // 期待されるCSSプロパティが含まれていることを確認
    expect(result).toMatch(/\.new-utility-class\s*\{[^}]*expected-property[^}]*\}/);
  });
});
```

### 3. 統合テストの更新

```typescript
// packages/smsshcss/src/__tests__/integration.test.ts
it('should include new utility classes in full generation', async () => {
  const config: SmsshCSSConfig = {
    content: ['src/**/*.{html,tsx}'],
    // 新しいユーティリティクラスに関連する設定があれば追加
  };

  const result = await generateCSS(config);

  // 新しいユーティリティクラスが含まれていることを確認
  expect(result).toContain('.new-utility-class');
  expect(cssValidators.isValidCSS(result)).toBe(true);
});
```

## 🔄 既存ユーティリティクラスの更新

### 1. 変更の影響範囲を確認

```bash
# 関連するテストファイルを検索
grep -r "existing-utility-class" src/__tests__/
```

### 2. 期待値の更新

既存のテストケースで期待される出力を更新：

```typescript
// Before
expect(result).toContain('old-css-property: old-value');

// After
expect(result).toContain('updated-css-property: new-value');
```

### 3. 後方互換性のテスト

```typescript
describe('Backward Compatibility', () => {
  it('should maintain backward compatibility for existing utility', () => {
    const generator = new CSSGenerator(testConfigs.minimal);
    const result = generator.generateFullCSSSync();

    // 既存の機能が壊れていないことを確認
    expect(cssValidators.hasClass(result, 'existing-utility')).toBe(true);

    // 新しい機能が追加されていることを確認
    expect(result).toMatch(/\.existing-utility\s*\{[^}]*new-property[^}]*\}/);
  });
});
```

## ✍️ テストケースの書き方

### 基本的なテスト構造

```typescript
describe('Utility Class Name', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Generation', () => {
    it('should generate basic utility class', () => {
      // Arrange
      const config = {
        /* テスト設定 */
      };
      const generator = new CSSGenerator(config);

      // Act
      const result = generator.generateFullCSSSync();

      // Assert
      expect(cssValidators.hasClass(result, 'utility-class')).toBe(true);
      expect(result).toMatch(/expected-css-pattern/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge case scenario', () => {
      // エッジケースのテスト
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input gracefully', () => {
      // エラーハンドリングのテスト
    });
  });
});
```

### アサーションのベストプラクティス

```typescript
// ❌ 避けるべき書き方
expect(result).toBeTruthy();

// ✅ 推奨される書き方
expect(cssValidators.hasClass(result, 'specific-class')).toBe(true);
expect(result).toMatch(/\.specific-class\s*\{\s*property:\s*value/);
expect(cssValidators.isValidCSS(result)).toBe(true);
```

## 🎭 モックデータの管理

### 新しいファイルタイプの追加

```typescript
// packages/smsshcss/src/__tests__/setup.ts
export const mockFileContents = {
  // 既存のファイル
  'test.html': '<div class="existing-classes">Test</div>',

  // 新しいファイルタイプ
  'new-component.svelte': '<div class="svelte-specific-class">Svelte</div>',
  'style.scss': '@include utility-mixin;',
};
```

### カスタムモック関数

```typescript
export function setupCustomMocks(customFiles: Record<string, string>): void {
  setupDefaultMocks();

  // カスタムファイルを追加
  mockFs.readFileSync.mockImplementation((path: string | Buffer | URL) => {
    const pathStr = path.toString();

    // カスタムファイルをチェック
    for (const [filename, content] of Object.entries(customFiles)) {
      if (pathStr.includes(filename)) {
        return content;
      }
    }

    // デフォルトのファイルをフォールバック
    return getDefaultFileContent(pathStr);
  });
}
```

## 🔄 回帰テストの実行

### 全テストの実行

```bash
# 全テストスイートの実行
npm test

# 特定のテストファイルのみ実行
npm test -- generator.test.ts

# カバレッジレポート付きで実行
npm run test:coverage
```

### 継続的インテグレーション

```typescript
// CI環境でのテスト設定例
describe('CI Tests', () => {
  it('should pass all integration tests', async () => {
    const configs = [
      testConfigs.minimal,
      testConfigs.withPurge,
      testConfigs.withTheme,
      testConfigs.full,
    ];

    for (const config of configs) {
      const result = await generateCSS(config);
      expect(cssValidators.isValidCSS(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
```

## ⚡ パフォーマンステスト

### 新しいユーティリティクラスのパフォーマンス測定

```typescript
describe('Performance Tests', () => {
  it('should generate new utility classes efficiently', () => {
    const largeConfig = {
      content: Array.from({ length: 1000 }, (_, i) => `src/file-${i}.html`),
      // 新しいユーティリティクラスを含む設定
    };

    const startTime = performance.now();
    const generator = new CSSGenerator(largeConfig);
    const result = generator.generateFullCSSSync();
    const endTime = performance.now();

    // パフォーマンス要件
    expect(endTime - startTime).toBeLessThan(2000); // 2秒以内
    expect(result.length).toBeGreaterThan(0);
    expect(cssValidators.countClasses(result)).toBeGreaterThan(0);
  });
});
```

### メモリ使用量の監視

```typescript
it('should not cause memory leaks with large datasets', () => {
  const initialMemory = process.memoryUsage().heapUsed;

  // 大量のデータでテスト実行
  for (let i = 0; i < 100; i++) {
    const generator = new CSSGenerator(testConfigs.full);
    generator.generateFullCSSSync();
  }

  // ガベージコレクションを実行
  if (global.gc) {
    global.gc();
  }

  const finalMemory = process.memoryUsage().heapUsed;
  const memoryIncrease = finalMemory - initialMemory;

  // メモリ使用量が合理的な範囲内であることを確認
  expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB未満
});
```

## 🐛 トラブルシューティング

### よくある問題と解決策

#### 1. テストが失敗する場合

```typescript
// デバッグ用のログを追加
it('should debug failing test', () => {
  const generator = new CSSGenerator(testConfigs.minimal);
  const result = generator.generateFullCSSSync();

  // デバッグ情報を出力
  console.log('Generated CSS length:', result.length);
  console.log('First 500 characters:', result.substring(0, 500));
  console.log('Class count:', cssValidators.countClasses(result));

  // 期待されるアサーション
  expect(result).toBeTruthy();
});
```

#### 2. モックが正しく動作しない場合

```typescript
beforeEach(() => {
  // モックのリセットを確認
  vi.clearAllMocks();

  // モックの設定を確認
  console.log('Mock calls:', mockFs.readFileSync.mock.calls);

  setupDefaultMocks();
});
```

#### 3. パフォーマンステストが不安定な場合

```typescript
it('should have stable performance', async () => {
  const results: number[] = [];

  // 複数回実行して平均を取る
  for (let i = 0; i < 5; i++) {
    const startTime = performance.now();
    await generateCSS(testConfigs.full);
    const endTime = performance.now();
    results.push(endTime - startTime);
  }

  const averageTime = results.reduce((a, b) => a + b, 0) / results.length;
  expect(averageTime).toBeLessThan(1000);
});
```

## 📝 チェックリスト

新しいユーティリティクラスを追加する際のチェックリスト：

- [ ] モックデータに新しいクラスを追加
- [ ] 基本的な生成テストを追加
- [ ] エッジケースのテストを追加
- [ ] エラーハンドリングのテストを追加
- [ ] 統合テストを更新
- [ ] パフォーマンステストを実行
- [ ] 既存テストが全て通ることを確認
- [ ] カバレッジレポートを確認
- [ ] ドキュメントを更新

## 🔗 関連ファイル

- `src/__tests__/setup.ts` - テストセットアップとモック設定
- `src/__tests__/api.test.ts` - メインAPIのテスト
- `src/__tests__/generator.test.ts` - CSS生成器のテスト
- `src/__tests__/purger.test.ts` - CSS purgerのテスト
- `src/__tests__/integration.test.ts` - 統合テスト
- `vitest.config.ts` - テスト設定ファイル
