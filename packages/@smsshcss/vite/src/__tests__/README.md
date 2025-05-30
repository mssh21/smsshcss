# SmsshCSS Vite Plugin - テスト構造

このディレクトリには、SmsshCSS Viteプラグインのテストファイルが含まれています。

## ファイル構造

```
__tests__/
├── README.md                    # このファイル
├── setup.ts                     # 共通のモック設定とセットアップ
├── plugin.test.ts              # プラグインのコア機能テスト
├── utility-classes.test.ts     # ユーティリティクラス生成テスト
├── custom-values.test.ts       # カスタム値クラス機能テスト
├── integration.test.ts         # 統合テストとE2Eシナリオ
├── performance.test.ts         # パフォーマンステスト (新規)
└── compatibility.test.ts       # 互換性テスト (新規)
```

## テストファイルの責務

### `setup.ts`

- 全テストファイルで共通のモック設定
- `smsshcss`パッケージのモック実装
- カスタム値処理のモック関数
- テスト間での重複を排除

### `plugin.test.ts`

- プラグインの基本設定とオプション
- ファイル変換の基本機能
- CSS/Reset/Base オプションの動作
- エラーハンドリング

### `utility-classes.test.ts`

- 標準ユーティリティクラスの生成
- スペーシング、ディスプレイ、幅クラス
- カスタムテーマ適用
- デフォルトクラスとカスタムクラスのマージ

### `custom-values.test.ts`

- カスタム値クラス（`[value]`記法）の処理
- margin, padding, gap, width のカスタム値
- CSS関数（calc, min, max等）の処理
- 複数ファイルでの重複排除
- エッジケースとエラーハンドリング

### `integration.test.ts`

- 実際のプロジェクト構造でのテスト
- React、Vue.js等のフレームワーク対応
- 標準クラスとカスタム値の混在
- 設定の組み合わせテスト
- ファイルシステムエラーの処理

### `performance.test.ts` ✨

- **変換処理のパフォーマンス測定**
  - 小規模、中規模、大規模プロジェクトでの処理時間
  - メモリ使用量の監視とリーク検出
  - 並行処理の効率性テスト
- **スケーラビリティテスト**
  - ファイル数増加による影響測定
  - 出力サイズの最適化確認
- **リソース管理**
  - プラグインインスタンスのクリーンアップ
  - ガベージコレクションの効果測定

### `compatibility.test.ts` ✨

- **Node.js バージョン互換性**
  - ESモジュール対応確認
  - クロスプラットフォーム動作
- **Vite プラグインAPI互換性**
  - 開発・プロダクションモード対応
  - ファイルタイプ処理
  - 仮想ファイル対応
- **ブラウザCSS互換性**
  - 基本CSS機能のサポート
  - モダンCSS単位の対応
  - ベンダープレフィックス制御
- **フレームワーク統合**
  - React、Vue、TypeScript対応
  - ビルドツール統合テスト

## テスト実行

```bash
# 全テスト実行
yarn test

# カバレッジ付きテスト実行
yarn test:coverage

# 特定のテストカテゴリ実行
yarn test:unit          # 単体テスト (plugin + utility-classes)
yarn test:integration   # 統合テスト (integration + custom-values)

# 特定のテストファイル実行
yarn test plugin.test.ts
yarn test utility-classes.test.ts
yarn test custom-values.test.ts
yarn test integration.test.ts
yarn test performance.test.ts
yarn test compatibility.test.ts

# ウォッチモード
yarn test:watch

# UI付きテスト実行
yarn test:ui

# CI用テスト実行
yarn test:ci

# デバッグモード
yarn test:debug
```

## テスト戦略

### 📊 **テストピラミッド**

```
        /\
       /  \      E2E・統合テスト
      /____\     (integration.test.ts)
     /      \
    /        \   統合・機能テスト
   /__________\  (custom-values.test.ts)
  /            \
 /              \ 単体テスト
/________________\ (plugin.test.ts, utility-classes.test.ts)
```

### 🎯 **テストカバレッジ目標**

- **行カバレッジ**: 80%以上
- **分岐カバレッジ**: 80%以上
- **関数カバレッジ**: 80%以上
- **文カバレッジ**: 80%以上

### 🚀 **パフォーマンス基準**

- **小規模プロジェクト** (10ファイル): 1秒以内
- **中規模プロジェクト** (50ファイル): 5秒以内
- **大規模プロジェクト** (100ファイル): 15秒以内
- **メモリ使用量**: 200MB以内

### 🔧 **互換性要件**

- **Node.js**: 18.x, 20.x, 21.x
- **Vite**: 4.x, 5.x
- **ブラウザ**: モダンブラウザ + IE11 (CSS互換性)
- **フレームワーク**: React, Vue, Svelte, Solid

## 新しいテストの追加

新しいテストを追加する際は以下のガイドラインに従ってください：

### 1. **適切なファイルに追加**

- **単体テスト**: `plugin.test.ts` または `utility-classes.test.ts`
- **機能テスト**: `custom-values.test.ts`
- **統合テスト**: `integration.test.ts`
- **パフォーマンステスト**: `performance.test.ts`
- **互換性テスト**: `compatibility.test.ts`

### 2. **共通セットアップの利用**

- `setup.ts`の共通モックを活用
- ヘルパー関数の再利用を推奨

### 3. **責務の分離**

- 各テストファイルの責務を越えないよう注意
- テスト間の依存関係を避ける

### 4. **説明的なテスト名**

- テストが何をテストしているか明確に
- `should` から始まる動詞形式を推奨

### 5. **パフォーマンス考慮**

- 重いテストは `performance.test.ts` に分離
- 適切なタイムアウト設定を行う

## モックの修正

共通モックを修正する場合は`setup.ts`を編集してください。個別のテストファイルでモックを上書きする必要がある場合は、そのテスト内で`vi.mock()`を使用してください。

## テスト環境

- **フレームワーク**: Vitest
- **カバレッジ**: V8 provider
- **レポート**: HTML, JSON, Text
- **モック**: `vi.mock()` を使用
- **ファイルシステム**: 一時ディレクトリを使用したファイル操作テスト
- **アサーション**: Jest互換のmatcher

## CI/CD での実行

```bash
# GitHub Actions での実行例
yarn test:ci

# カバレッジレポートの生成
yarn test:coverage

# パフォーマンス基準の確認
yarn test performance.test.ts

# 互換性テストの実行
yarn test compatibility.test.ts
```

## トラブルシューティング

### よくある問題

1. **メモリ不足エラー**

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" yarn test
   ```

2. **タイムアウトエラー**

   ```javascript
   // vitest.config.ts で testTimeout を調整
   test: {
     testTimeout: 30000;
   }
   ```

3. **ファイルシステムエラー**
   - 一時ディレクトリのクリーンアップを確認
   - 権限設定の確認

### デバッグ方法

```bash
# 詳細ログ付きテスト実行
yarn test:debug

# 特定のテストのみデバッグ
yarn test --reporter=verbose --bail=1 specific.test.ts

# Node.js デバッガーでテスト実行
node --inspect-brk ./node_modules/.bin/vitest run
```
