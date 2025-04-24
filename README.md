# SmsshCSS PostCSSプラグイン

SmsshCSSは、軽量なユーティリティファーストCSSフレームワークです。HTMLファイル内で使用されるクラスのみを生成し、最適化されたCSSを提供します。

## 特徴

- **ユーティリティファースト**: 再利用可能なユーティリティクラスを使用してUIを素早く構築
- **パージ機能**: HTMLで使用されたクラスのみを含む最適化されたCSSを生成
- **カスタマイズ可能**: 設定ファイルを通じてトークンやスタイルをカスタマイズ可能
- **高速**: 最小限のCSSでパフォーマンスを最適化

## インストール

```bash
# npm
npm install smsshcss @smsshcss/postcss postcss

# yarn
yarn add smsshcss @smsshcss/postcss postcss
```

## 使用方法

### 1. PostCSSの設定

`postcss.config.js`ファイルを作成し、以下のように設定します:

```js
module.exports = {
  plugins: [
    require('@smsshcss/postcss')(),
    // その他のプラグイン
    require('autoprefixer')
  ]
};
```

### 2. SmsshCSS設定ファイルの作成

プロジェクトのルートに`smsshcss.config.js`ファイルを作成して、スタイルとトークンをカスタマイズできます:

```js
module.exports = {
  // スキャン対象のファイル
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 常に含めるクラス
  safelist: [
    'flex', 'items-center', 'justify-between'
  ],
  // reset.cssを含めるかどうか (デフォルトはtrue)
  includeResetCSS: true,
  // base.cssを含めるかどうか (デフォルトはtrue)
  includeBaseCSS: true,
  // レガシーモードを無効化（@importが不要になります）
  legacyMode: false,
  // デバッグモード (オプション)
  debug: false,
  
  // テーマ設定 - トークンのカスタマイズ
  theme: {
    // カラーのカスタマイズ
    colors: {
      primary: '#3366FF',
      textPrimary: '#333333',
      backgroundBase: '#FFFFFF'
    },
    // フォントウェイトのカスタマイズ
    fontWeight: {
      normal: '400',
      bold: '700'
    },
    // フォントサイズのカスタマイズ
    fontSize: {
      base: '16px',
      xl: '24px',
      '2xl': '30px'
    },
    // 行の高さのカスタマイズ
    lineHeight: {
      normal: '1.5',
      relaxed: '1.75'
    },
    // スペーシングのカスタマイズ
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px'
    },
    // ボーダー半径のカスタマイズ
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    },
    // シャドウのカスタマイズ
    shadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  }
};
```

### 3. HTMLでの使用

設定したユーティリティクラスをHTMLで使用します:

```html
<div class="flex items-center justify-between">
  <h1 class="text-2xl font-bold text-primary">Hello, SmsshCSS!</h1>
  <button class="bg-primary text-white p-md rounded-sm">Click me</button>
</div>
```

### 4. CSSファイルの作成（オプション）

`styles.css`などのメインCSSファイルを作成し、必要に応じて追加のスタイルを記述します:

```css
/* メインスタイルシート */

/* カスタムCSSをここに追加 */
.custom-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

レガシーモードを使用する場合は、以下のようにインポートを追加します:

```css
/* メインスタイルシート */
@import "smsshcss";

/* カスタムCSSをここに追加 */
.custom-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

## 設定オプション

### 主要なオプション

| オプション | 説明 | デフォルト値 |
|------------|------|------------|
| `content` | クラス名を抽出するファイルのパターン | `[]` |
| `safelist` | 常に含めるクラス名 | `[]` |
| `includeResetCSS` | reset.cssを含めるかどうか | `true` |
| `includeBaseCSS` | base.cssを含めるかどうか | `true` |
| `legacyMode` | @import "smsshcss"を使うレガシーモード | `false` |
| `debug` | デバッグ情報を出力 | `false` |

### カスタマイズ可能なトークン

| カテゴリ | 説明 | 例 |
|---------|------|-----|
| `colors` | カラートークン | `primary`, `textPrimary`, `backgroundBase` |
| `fontSize` | フォントサイズトークン | `base`, `xl`, `2xl` |
| `fontWeight` | フォントウェイトトークン | `normal`, `bold` |
| `lineHeight` | 行の高さトークン | `normal`, `relaxed` |
| `spacing` | スペーシングトークン | `xs`, `sm`, `md` |
| `borderRadius` | 角丸トークン | `sm`, `md`, `lg` |
| `shadow` | シャドウトークン | `sm`, `md` |

## 応用例

### ダークモード対応

```js
// smsshcss.config.js
module.exports = {
  // 基本設定...
  theme: {
    colors: {
      // ライトモード
      primary: '#3366FF',
      textPrimary: '#333333',
      backgroundBase: '#FFFFFF',
      
      // ダークモード用（カスタムCSSと併用）
      primaryDark: '#668CFF',
      textPrimaryDark: '#EEEEEE',
      backgroundBaseDark: '#121212'
    }
  }
};
```

```css
/* styles.css */
@media (prefers-color-scheme: dark) {
  body {
    color: var(--text-primary-dark);
    background-color: var(--background-base-dark);
  }
  
  .text-primary {
    color: var(--primary-dark);
  }
}
```

## 開発

### パッケージ構成

- `smsshcss`: コアライブラリ (ユーティリティ定義とトークン)
- `@smsshcss/postcss`: PostCSSプラグイン (クラス抽出とCSSの生成)

### 開発用コマンド

```bash
# 依存関係のインストール
yarn

# ビルド
yarn build

# プレイグラウンドでのテスト
cd playground/postcss
yarn build
yarn serve
```

## ライセンス

MIT 