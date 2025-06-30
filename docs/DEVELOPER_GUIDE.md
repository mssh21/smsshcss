# SmsshCSS 開発者ガイド

このガイドでは、SmsshCSSの拡張、カスタマイズ、新しいユーティリティクラスの追加方法について説明します。

## 📚 目次

- [開発環境のセットアップ](#開発環境のセットアップ)
- [新しいユーティリティクラスの追加](#新しいユーティリティクラスの追加)
- [設定ファイルのカスタマイズ](#設定ファイルのカスタマイズ)
- [開発ツールの使用方法](#開発ツールの使用方法)
- [テストとデバッグ](#テストとデバッグ)
- [パフォーマンス最適化](#パフォーマンス最適化)

## 🛠️ 開発環境のセットアップ

### 前提条件

- Node.js v20.18.0 以上
- Yarn v4.5.0 または pnpm（推奨）

### 環境構築

```bash
# リポジトリのクローン
git clone <repository-url>
cd smsshcss

# 依存関係のインストール
yarn install
# または
pnpm install

# 開発用ビルド
yarn dev
# または
pnpm dev
```

## 🎨 新しいユーティリティクラスの追加

### 自動生成ツールを使用（推奨）

新しいユーティリティクラスは自動生成ツールを使用して効率的に作成できます：

#### 基本的なユーティリティ

```bash
# サイズ系ユーティリティの生成
node scripts/generate-utility.js border \
  --css-property=border-width \
  --prefix=border \
  --config-type=SizeConfig \
  --config-file=sizeConfig

# pnpmの場合
pnpm exec node scripts/generate-utility.js border \
  --css-property=border-width \
  --prefix=border \
  --config-type=SizeConfig \
  --config-file=sizeConfig
```

#### 色系ユーティリティ（複数バリアント）

```bash
# 色系ユーティリティの生成（text, bg, border, fill）
node scripts/generate-utility.js text-color \
  --config-type=ColorConfig \
  --config-file=colorConfig \
  --variants='[{"name":"text","prefix":"text","property":"color"},{"name":"bg","prefix":"bg","property":"background-color"},{"name":"border","prefix":"border","property":"border-color"},{"name":"fill","prefix":"fill","property":"fill"}]'
```

#### 方向指定ありのユーティリティ

```bash
# スペーシング系ユーティリティの生成（上下左右対応）
node scripts/generate-utility.js margin \
  --directions \
  --css-property=margin \
  --prefix=m \
  --config-type=SizeConfig \
  --config-file=spacingConfig
```

#### 生成後の手順

1. **ファイル確認**: 生成されたファイルを確認

   ```
   packages/smsshcss/src/utils/color.ts
   packages/smsshcss/src/utils/__tests__/color.test.ts
   ```

2. **index.ts への追加**:

   ```typescript
   // packages/smsshcss/src/utils/index.ts
   export * from './border';
   ```

3. **generator.ts への統合**:

   ```typescript
   // packages/smsshcss/src/core/generator.ts
   import { generateAllBorderClasses } from '../utils/border';

   // generate() メソッド内で追加
   const utilities = [
     // ... 既存のユーティリティ
     generateAllBorderClasses(),
   ].join('\n\n');
   ```

4. **apply-plugins への追加**:

   ```typescript
   // packages/smsshcss/src/utils/apply-plugins/border-plugin.ts
   import { applyPlugin } from './index';
   import { generateAllBorderClasses } from '../border';

   applyPlugin('border', generateAllBorderClasses);
   ```

5. **型定義の追加（必要に応じて）**:

   ```typescript
   // packages/smsshcss/src/core/types.ts
   export interface BorderConfig extends SizeConfig {
     // 追加のプロパティがあれば定義
   }
   ```

### 手動での実装

自動生成ツールを使わない場合の手動実装例：

```typescript
// packages/smsshcss/src/utils/typography.ts
import { generateUtilityClasses } from './index';

export const defaultFontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
};

export function generateTypographyClasses(config = defaultFontSizes): string {
  return generateUtilityClasses(
    {
      prefix: 'text',
      property: 'font-size',
      hasDirections: false,
      supportsArbitraryValues: true,
    },
    config
  );
}
```

## ⚙️ 設定ファイルのカスタマイズ

### 設定ファイルの作成

```bash
# サンプル設定をコピー
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js

# 設定の妥当性をチェック
yarn validate:config
```

### 設定オプションの詳細

```javascript
// smsshcss.config.js
module.exports = {
  // ファイルスキャンの対象
  content: ['index.html', 'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

  // CSS パージの設定
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safelist: [
      'm-2xl',
      'p-2xl', // 常に保持するクラス
      /^hover:/,
      /^focus:/, // 正規表現パターン
    ],
    blocklist: ['m-2xs', 'p-2xs'], // 強制削除するクラス
  },

  // テーマのカスタマイズ
  // theme機能は廃止されました。
  // カスタム値は任意値記法をご利用ください。
  apply: {
    spacing: {
      custom: '2.5rem',
      72: '18rem',
    },

    colors: {
      brand: '#ff6b6b',
      accent: '#4ecdc4',
    },
  },
};
```

## 🔧 開発ツールの使用方法

### 設定の検証

```bash
# 設定ファイルの妥当性をチェック
yarn validate:config

# 詳細な検証結果を表示
NODE_ENV=development yarn validate:config
```

### CSS 分析ツール

```bash
# 生成される CSS の詳細情報
yarn debug:classes

# 重複セレクターの検出
yarn check:duplicates

# CSS サイズレポート
yarn size:report

# 利用可能な分析ツール一覧
yarn analyze:css
```

### 開発中のデバッグ

```typescript
import { CSSGenerator } from 'smsshcss';

// デバッグモードで生成
const generator = new CSSGenerator(config, {
  development: true, // 詳細ログを表示
  skipValidation: false, // バリデーションを実行
  suppressWarnings: false, // 警告を表示
});

const css = await generator.generateFullCSS();
```

## 🧪 テストとデバッグ

### テストの実行

```bash
# 全テストの実行
yarn test

# 特定のテストファイル
yarn test color

# ウォッチモード
yarn test:watch

# カバレッジレポート
yarn test:coverage
```

### デバッグのベストプラクティス

1. **段階的な実装**: 小さな機能から始める
2. **テストファースト**: テストを先に書く
3. **設定検証**: 実装後は必ず `validate:config` を実行
4. **パフォーマンス確認**: `size:report` でCSS サイズを確認

### よくある問題と解決方法

#### 1. CSSクラスが生成されない

```bash
# デバッグ情報を確認
yarn debug:classes

# ファイルパターンが正しいか確認
yarn validate:config
```

#### 2. パフォーマンスが遅い

```bash
# 重複チェック
yarn check:duplicates

# パージ設定の確認
yarn size:report
```

#### 3. 型エラー

```typescript
// 型定義の追加確認
// packages/smsshcss/src/core/types.ts
```

## ⚡ パフォーマンス最適化

### CSS パージの最適化

```javascript
// smsshcss.config.js
module.exports = {
  purge: {
    enabled: true,

    // パフォーマンス向上のため、node_modules を除外
    content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}', '!**/node_modules/**'],

    // 必要最小限のsafelistを設定
    safelist: [
      // 動的生成されるクラスのみ
    ],
  },
};
```

### ビルド時間の短縮

```bash
# 並列処理の活用（自動的に有効）
yarn build

# 開発時は必要なファイルのみスキャン
yarn dev
```

### CSS サイズの最小化

```bash
# サイズレポートの確認
yarn size:report

# 未使用クラスの特定
yarn check:duplicates
```

## 🚀 コントリビューション

新しいユーティリティクラスや機能を追加する場合：

1. Issue で提案を議論
2. 自動生成ツールを使用
3. テストを作成・実行
4. ドキュメントを更新
5. Pull Request を作成

### コミット規則

```bash
# Conventional Commits に従う
git commit -m "feat(utils): add color utility classes"
git commit -m "fix(generator): improve error handling"
git commit -m "docs(readme): update installation guide"
```

## 📞 サポート

- Issue: GitHub Issues
- Discussion: GitHub Discussions
- Email: [maintainer-email]

---

このガイドが SmsshCSS の開発に役立つことを願っています。質問や改善提案があれば、お気軽にお知らせください！
