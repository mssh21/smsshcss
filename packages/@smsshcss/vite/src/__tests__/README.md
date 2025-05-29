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
└── integration.test.ts         # 統合テストとE2Eシナリオ
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

## テスト実行

```bash
# 全テスト実行
yarn test

# 特定のテストファイル実行
yarn test plugin.test.ts
yarn test utility-classes.test.ts
yarn test custom-values.test.ts
yarn test integration.test.ts

# ウォッチモード
yarn test --watch
```

## 新しいテストの追加

新しいテストを追加する際は以下のガイドラインに従ってください：

1. **適切なファイルに追加**: 機能に応じて適切なテストファイルに追加
2. **共通セットアップの利用**: `setup.ts`の共通モックを活用
3. **責務の分離**: 各テストファイルの責務を越えないよう注意
4. **説明的なテスト名**: テストが何をテストしているか明確に

## モックの修正

共通モックを修正する場合は`setup.ts`を編集してください。個別のテストファイルでモックを上書きする必要がある場合は、そのテスト内で`vi.mock()`を使用してください。

## パフォーマンステスト

大きなファイルや複雑なシナリオのパフォーマンステストは`integration.test.ts`に含めてください。

## テスト環境

- **フレームワーク**: Vitest
- **モック**: `vi.mock()` を使用
- **ファイルシステム**: 一時ディレクトリを使用したファイル操作テスト
- **アサーション**: Jest互換のmatcher
