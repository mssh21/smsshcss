# SmsshCSS ドキュメント目次

SmsshCSSの全ドキュメントへのアクセスポイントです。

## 📚 メインドキュメント

### 🚀 [README.md](../../README.md)

- プロジェクト概要
- インストール方法（npm, yarn, pnpm対応）
- 基本的な使用方法
- 利用可能なユーティリティクラス
- **新機能**: 開発ツールの使用方法

### 👨‍💻 [開発者ガイド](./DEVELOPER_GUIDE.md)

- 開発環境のセットアップ
- 新しいユーティリティクラスの追加方法
- 自動生成ツールの使用方法
- テストとデバッグのベストプラクティス
- パフォーマンス最適化

### 📖 [API リファレンス](./API_REFERENCE.md)

- 全API関数の詳細説明
- 設定オプションの完全ガイド
- 型定義の詳細
- 実践的な使用例

### 🎨 [ユーティリティクラス リファレンス](./UTILITY_CLASSES.md)

- 全ユーティリティクラスの一覧
- 各クラスの詳細説明と使用方法
- カスタム値の使用方法
- 実用的なレイアウト例

### 🎨 [テーマカスタマイズガイド](./THEME_CUSTOMIZATION.md)

- ユーティリティクラスの値のカスタマイズ方法
- スペーシング、サイズ、グリッドの設定
- プロジェクト固有の設定例
- ベストプラクティス
- **コンポーネントクラスの定義（SmsshCSS独自機能）** 🆕

## ⚙️ 設定とサンプル

### 🔧 [設定ファイルサンプル](./smsshcss.config.example.js)

- 完全な設定例
- パージ設定の詳細
- テーマカスタマイズ例
- コメント付きの説明

### 📝 [テストガイド](./src/__tests__/TESTING_GUIDE.md)

- テスト方針とガイドライン
- 新しいユーティリティクラスのテスト方法
- テストユーティリティの使用方法

### 💡 [ユーティリティクラス例](./src/__tests__/UTILITY_CLASS_EXAMPLES.md)

- 実装済みユーティリティクラスの例
- テスト実装のサンプル
- エラーハンドリングの例

## 🛠️ 開発ツール

### コマンドラインツール

```bash
# 📦 パッケージマネージャー対応
# yarn での実行
yarn <command>

# pnpm での実行
pnpm <command>

# npm での実行（参考）
npm run <command>
```

### 利用可能なコマンド

#### 🎨 新規ユーティリティ生成

```bash
# 基本的なユーティリティクラス
yarn generate:utility color --css-property=color --prefix=text

# 方向指定付きユーティリティクラス
yarn generate:utility border --directions --css-property=border-width
```

#### 🔍 設定とデバッグ

```bash
# 設定ファイルの妥当性チェック
yarn validate:config

# CSS生成の詳細情報表示
yarn debug:classes

# 重複セレクターの検出
yarn check:duplicates

# CSSサイズレポート生成
yarn size:report

# 分析ツール一覧表示
yarn analyze:css
```

#### 🧪 テスト関連

```bash
# 全テスト実行
yarn test

# 特定テストファイル実行
yarn test color

# ウォッチモード
yarn test:watch

# カバレッジレポート
yarn test:coverage
```

#### 📦 ビルド関連

```bash
# 開発用ビルド（ウォッチモード）
yarn dev

# 本番用ビルド
yarn build

# クリーンアップ
yarn clean
```

## 🎯 クイックスタート

### 1. プロジェクトセットアップ

```bash
# 依存関係のインストール
yarn install
# または
pnpm install

# 設定ファイル作成
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js

# 設定の妥当性チェック
yarn validate:config
```

### 2. 新しいユーティリティクラスの追加

```bash
# 1. 自動生成
yarn generate:utility typography --css-property=font-size --prefix=text

# 2. ファイル確認
# - packages/smsshcss/src/utils/typography.ts
# - packages/smsshcss/src/utils/__tests__/typography.test.ts

# 3. テスト実行
yarn test typography

# 4. 生成確認
yarn debug:classes
```

### 3. カスタマイズと最適化

```bash
# 重複チェック
yarn check:duplicates

# サイズ最適化確認
yarn size:report

# 設定の再検証
yarn validate:config
```

## 📋 ドキュメント更新履歴

### v2.2.0 での追加・更新内容

#### ✨ 新機能

- 自動ユーティリティクラス生成スクリプト
- 設定バリデーション機能
- 開発者向けデバッグツール
- パフォーマンス分析機能

#### 📝 ドキュメント更新

- yarn/pnpm対応のコマンド例
- 開発者ガイドの新規作成
- APIリファレンスの詳細化
- 設定ファイルのコメント充実

#### 🔧 開発効率改善

- エラーハンドリングの向上
- 並列ファイル処理の実装
- キャッシュ機能の追加
- 型安全性の向上

## 🤝 コントリビューション

### ドキュメントの改善

- 誤字・脱字の修正
- 使用例の追加
- 説明の改善
- 新機能のドキュメント化

### 開発への参加

1. [開発者ガイド](./DEVELOPER_GUIDE.md)を確認
2. Issue で提案を議論
3. 自動生成ツールを活用
4. テストを作成・実行
5. Pull Request を作成

## 📞 サポート

- **GitHub Issues**: バグレポート・機能要求
- **GitHub Discussions**: 質問・議論
- **Developer Guide**: 開発に関する詳細情報
- **API Reference**: 技術的な詳細

---

**注意**: このプロジェクトは yarn v4.5.0 と pnpm を推奨しています。npmでも動作しますが、パフォーマンスと機能の面でyarn/pnpmの使用を強く推奨します。

## 🚀 新機能

### コンポーネントクラス（v2.0.0〜）

SmsshCSSの独自機能として、よく使うユーティリティクラスの組み合わせを設定ファイルで定義できます：

```javascript
theme: {
  components: {
    'main-layout': 'w-lg mx-auto px-lg block',
    'card': 'p-md bg-white rounded-lg shadow-md',
    'btn-primary': 'inline-block px-md py-sm bg-blue-500 text-white rounded',
  }
}
```

```html
<!-- 1つのクラスで複数のユーティリティが適用される -->
<div class="main-layout">
  <div class="card">
    <button class="btn-primary">クリック</button>
  </div>
</div>
```

これにより、HTMLをよりクリーンに保ちながら、一貫性のあるコンポーネントスタイルを維持できます。
