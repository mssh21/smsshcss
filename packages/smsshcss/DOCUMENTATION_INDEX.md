# SmsshCSS ドキュメント目次

SmsshCSSの全ドキュメントへのアクセスポイントです。

# SmsshCSS ドキュメント目次

SmsshCSSの全ドキュメントへのアクセスポイントです。

## 📚 メインドキュメント

### 🚀 [README.md](../../README.md)

- プロジェクト概要とクイックスタート
- インストール方法（npm, yarn, pnpm対応）
- Viteプラグイン設定とHTMLでの使用方法
- ユーティリティクラスとCSS関数サポート
- TypeScript統合と型安全性機能
- **更新済み**: 最新の実装に合わせた包括的なガイド 🆕

### 🎯 [ベストプラクティスガイド](../../BEST_PRACTICES.md)

- SmsshCSSの設計思想と開発哲学
- Apply設定とパージ機能のベストプラクティス
- パフォーマンス最適化と型安全性ガイド
- セキュリティ対策とチーム開発のベストプラクティス
- 品質管理とCI/CDパイプライン設定
- **新規作成**: 包括的なベストプラクティス集 🆕

### 💡 [実用例集](../../EXAMPLES.md)

- レイアウト・UIコンポーネント・フォームの具体例
- レスポンシブデザインとアニメーション例
- Apply設定による再利用可能なコンポーネント定義
- 実際のプロジェクトで使える実装パターン
- **新規作成**: 実践的な使用例集 🆕

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

### ⚙️ [Apply設定ガイド](./APPLY_CONFIGURATION.md)

- Apply設定による再利用可能なコンポーネントクラス定義
- 基本的な使い方と実践例
- カスタム値とCSS変数の使用方法
- **SmsshCSS独自機能**: コンポーネントクラスの定義 🆕

### 🔄 [マイグレーションガイド](./MIGRATION_GUIDE.md)

- 同期APIから非同期APIへの移行手順
- 移行のメリットと理由
- 具体的なコード例とベストプラクティス
- **新規作成**: v3.0.0への準備 🆕

## ⚙️ 設定とサンプル

### 🔧 [設定ファイルサンプル](./smsshcss.config.example.js)

- 完全な設定例
- パージ設定の詳細
- Apply設定（コンポーネントクラス）例
- テーマカスタマイズ例
- コメント付きの説明

### 🧹 [パージ機能ガイド](../../docs/purging.md)

- CSS最適化とパージ設定
- safelist・blocklistの使用方法
- パフォーマンス最適化のベストプラクティス

### 📝 [テストガイド](./src/__tests__/TESTING_GUIDE.md)

- テスト方針とガイドライン
- 新しいユーティリティクラスのテスト方法
- テストユーティリティの使用方法

### 💡 [ユーティリティクラス例](./src/__tests__/UTILITY_CLASS_EXAMPLES.md)

- 実装済みユーティリティクラスの例
- テスト実装のサンプル
- エラーハンドリングの例

## 🛠️ 開発ツールとコマンド

### パッケージマネージャー対応

```bash
# 📦 npm での実行
npm run <command>

# 📦 yarn での実行
yarn <command>

# 📦 pnpm での実行
pnpm <command>
```

### 利用可能なコマンド

#### 🎨 新規ユーティリティ生成

```bash
# 基本的なユーティリティクラス
npm run generate:utility color --css-property=color --prefix=text
yarn generate:utility color --css-property=color --prefix=text
pnpm generate:utility color --css-property=color --prefix=text

# 方向指定付きユーティリティクラス
npm run generate:utility border --directions --css-property=border-width
yarn generate:utility border --directions --css-property=border-width
pnpm generate:utility border --directions --css-property=border-width
```

#### 🔍 設定とデバッグ

```bash
# 設定ファイルの妥当性チェック
npm run validate:config
yarn validate:config
pnpm validate:config

# CSS生成の詳細情報表示
npm run debug:classes
yarn debug:classes
pnpm debug:classes

# 重複セレクターの検出
npm run check:duplicates
yarn check:duplicates
pnpm check:duplicates

# CSSサイズレポート生成
npm run size:report
yarn size:report
pnpm size:report

# 分析ツール一覧表示
npm run analyze:css
yarn analyze:css
pnpm analyze:css
```

#### 🧪 テスト関連

```bash
# 全テスト実行
npm test
yarn test
pnpm test

# 特定テストファイル実行
npm test color
yarn test color
pnpm test color

# ウォッチモード
npm run test:watch
yarn test:watch
pnpm test:watch

# カバレッジレポート
npm run test:coverage
yarn test:coverage
pnpm test:coverage
```

#### 📦 ビルド関連

```bash
# 開発用ビルド（ウォッチモード）
npm run dev
yarn dev
pnpm dev

# 本番用ビルド
npm run build
yarn build
pnpm build

# クリーンアップ
npm run clean
yarn clean
pnpm clean
```

## 🎯 クイックスタート

### 1. プロジェクトセットアップ

```bash
# 依存関係のインストール
npm install
# または
yarn install
# または
pnpm install

# 設定ファイル作成
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js

# 設定の妥当性チェック
npm run validate:config
# または
yarn validate:config
# または
pnpm validate:config
```

### 2. 新しいユーティリティクラスの追加

```bash
# 1. 自動生成（npm例）
npm run generate:utility typography --css-property=font-size --prefix=text

# 2. ファイル確認
# - packages/smsshcss/src/utils/typography.ts
# - packages/smsshcss/src/utils/__tests__/typography.test.ts

# 3. テスト実行
npm test typography
# または
yarn test typography
# または
pnpm test typography

# 4. 生成確認
npm run debug:classes
# または
yarn debug:classes
# または
pnpm debug:classes
```

### 3. カスタマイズと最適化

```bash
# 重複チェック
npm run check:duplicates
# または
yarn check:duplicates
# または
pnpm check:duplicates

# サイズ最適化確認
npm run size:report
# または
yarn size:report
# または
pnpm size:report

# 設定の再検証
npm run validate:config
# または
yarn validate:config
# または
pnpm validate:config
```

## 📋 ドキュメント更新履歴

### 最新版での追加・更新内容

#### ✨ 新機能とドキュメント

- **[🎯 ベストプラクティスガイド](../../BEST_PRACTICES.md)** - 包括的なベストプラクティス集を新規作成
- **[💡 実用例集](../../EXAMPLES.md)** - 実践的な使用例集を新規作成
- **🚀 README.md** - 最新の実装に合わせて全面的に更新
- **📚 ドキュメント目次** - 新しいドキュメントへのリンク追加

#### � 開発効率改善

- npm/yarn/pnpm対応のコマンド例統一
- TypeScript統合と型安全性のガイド追加
- エラーハンドリングの向上説明
- パフォーマンス分析機能のドキュメント化

#### � 設計思想とアーキテクチャ

- フィボナッチスペーシングシステムの詳細説明
- Apply設定による再利用可能なコンポーネントクラス
- CSS関数サポートの包括的なガイド
- セキュリティ対策とベストプラクティス

## 🤝 コントリビューション

### ドキュメントの改善

- 誤字・脱字の修正
- 使用例の追加
- 説明の改善
- 新機能のドキュメント化

### 開発への参加

1. **[🎯 ベストプラクティスガイド](../../BEST_PRACTICES.md)** でSmsshCSSの設計思想を理解
2. **[👨‍💻 開発者ガイド](./DEVELOPER_GUIDE.md)** で開発環境をセットアップ
3. **[💡 実用例集](../../EXAMPLES.md)** で実装パターンを確認
4. Issue で提案を議論
5. 自動生成ツールを活用
6. テストを作成・実行

---

**SmsshCSS** - 高性能で型安全なユーティリティファーストCSSフレームワーク5. Pull Request を作成

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
