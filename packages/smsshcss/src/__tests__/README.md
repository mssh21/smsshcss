# SmsshCSS Core Package - テスト構造

このディレクトリには、SmsshCSSコアパッケージのテストファイルが含まれています。

## ファイル構造

```
__tests__/
├── README.md                    # このファイル
├── setup.ts                     # 共通のモック設定とテストヘルパー
├── api.test.ts                  # メインAPIのテスト
├── generator.test.ts            # CSS生成エンジンのテスト
├── integration.test.ts          # 統合テストとE2Eシナリオ
└── purger.test.ts              # CSS Purger機能のテスト

utils/__tests__/
├── spacing.test.ts              # スペーシングユーティリティテスト
├── width.test.ts               # 幅ユーティリティテスト
├── display.test.ts             # ディスプレイユーティリティテスト
├── flexbox.test.ts             # Flexboxユーティリティテスト
├── css-functions.test.ts       # CSS関数サポートテスト
└── custom-values.test.ts       # カスタム値抽出機能テスト
```

## テストファイルの責務

### メインレベルテスト

#### `setup.ts`

- 全テストファイルで共通のモック設定
- ファイルシステム操作のモック
- fast-globのモック
- テスト用のサンプル設定とコンテンツ
- 共通のヘルパー関数

#### `api.test.ts`

- メインAPI関数のテスト
- `generateCSS`, `generateCSSSync`, `generatePurgeReport`
- `init`, `initSync` の便利関数
- APIの一貫性と互換性
- エラーハンドリング

#### `generator.test.ts`

- `CSSGenerator`クラスの機能テスト
- CSS生成の基本機能
- テーマ設定の適用
- 同期・非同期生成の動作
- パフォーマンステスト

#### `integration.test.ts`

- 実際のプロジェクト構造でのテスト
- ファイルシステム統合
- Purge機能との連携
- 複雑な設定の組み合わせ
- エラー復旧のテスト

#### `purger.test.ts`

- `CSSPurger`クラスの詳細テスト
- クラス名抽出ロジック
- セーフリスト・ブロックリスト機能
- パフォーマンス最適化
- エッジケースの処理

### ユーティリティレベルテスト

#### `spacing.test.ts`

- スペーシングクラス生成のテスト
- margin, padding, gap クラス
- 方向指定（top, right, bottom, left, x, y）
- フィボナッチベーススペーシング
- 任意の値サポート

#### `width.test.ts`

- 幅関連クラス生成のテスト
- width, min-width, max-width
- レスポンシブ対応
- パーセンテージ・ビューポート単位

#### `display.test.ts`

- ディスプレイユーティリティのテスト
- block, flex, grid, inline 等
- カスタムディスプレイ値

#### `flexbox.test.ts`

- Flexboxユーティリティのテスト
- justify-content, align-items, flex-direction
- flex-wrap, flex-grow, flex-shrink

#### `css-functions.test.ts`

- CSS関数のサポートテスト
- calc(), min(), max(), clamp()
- 複雑な計算式の処理
- ネストした関数

#### `custom-values.test.ts`

- カスタム値抽出機能のテスト
- `extractCustomSpacingClasses`
- `extractCustomWidthClasses`
- CSS関数とCSS変数の処理

## テスト実行

```bash
# 全テスト実行
yarn test

# 特定のテストファイル実行
yarn test api.test.ts
yarn test generator.test.ts
yarn test integration.test.ts
yarn test purger.test.ts

# ユーティリティテスト実行
yarn test utils/spacing.test.ts
yarn test utils/css-functions.test.ts

# ウォッチモード
yarn test --watch

# カバレッジ付きテスト
yarn test:coverage
```

## 新しいテストの追加

新しいテストを追加する際は以下のガイドラインに従ってください：

### 1. 適切なファイルの選択

- **API機能**: `api.test.ts`
- **CSS生成機能**: `generator.test.ts`
- **Purge機能**: `purger.test.ts`
- **ユーティリティ関数**: 対応する`utils/__tests__/*.test.ts`
- **統合・E2E**: `integration.test.ts`

### 2. 共通セットアップの利用

```typescript
import { setupDefaultMocks, testConfigs } from './setup';

beforeEach(() => {
  setupDefaultMocks();
});
```

### 3. テスト設定の利用

```typescript
// 定義済みの設定を使用
const result = await generateCSS(testConfigs.minimal);
const result2 = await generateCSS(testConfigs.withPurge);
```

### 4. モックの管理

- ファイルシステム操作は`setup.ts`の共通モックを使用
- 特別なモックが必要な場合は、テスト内で個別に設定
- テスト間でのモック状態をクリアするため`setupDefaultMocks()`を使用

## パフォーマンステスト

パフォーマンステストは以下の基準で評価します：

- **CSS生成速度**: 1秒以内（同期）、2秒以内（非同期）
- **メモリ使用量**: 大量のコンテンツでもメモリリークしない
- **ファイル処理**: 100個のファイルを効率的に処理

## モックの詳細

### ファイルシステムモック

- `fs.readFileSync`: ファイル内容を返すモック
- `fs.statSync`: ファイル統計を返すモック
- `fs.existsSync`: ファイル存在チェックのモック

### fast-globモック

- glob パターンに対してファイルリストを返すモック
- エラーケースのシミュレーション

### サンプルコンテンツ

- HTML, JSX, Vue 等のサンプルコンテンツ
- カスタム値を含む複雑なケース
- エラーを引き起こすケース

## テスト環境

- **フレームワーク**: Vitest
- **モック**: `vi.mock()` を使用
- **カバレッジ**: v8 provider
- **環境**: Node.js
- **TypeScript**: 完全サポート

## トラブルシューティング

### テストが失敗する場合

1. `setupDefaultMocks()` が呼ばれているか確認
2. モックの状態がテスト間でクリアされているか確認
3. TypeScriptの型エラーがないか確認

### パフォーマンステストが失敗する場合

1. CI環境では実行時間が長くなる可能性があります
2. テスト実行前にシステムリソースを確認してください
3. 必要に応じてタイムアウト値を調整してください
