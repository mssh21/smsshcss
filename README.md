# smsshcss

smsshcssは、軽量なユーティリティファーストCSSフレームワークです。HTMLファイル内で使用されるクラスのみを生成し、最適化されたCSSを提供します。

## 特徴

- **ユーティリティファースト**: 再利用可能なユーティリティクラスを使用してUIを素早く構築
- **パージ機能**: HTMLで使用されたクラスのみを含む最適化されたCSSを生成
- **カスタマイズ可能**: 設定を通じて独自のユーティリティを追加可能
- **高速**: 最小限のCSSでパフォーマンスを最適化

## インストール

```bash
# npm
npm install smsshcss @smsshcss/postcss postcss

# yarn
yarn add smsshcss @smsshcss/postcss postcss
```

## 使用方法

### PostCSSの設定

`postcss.config.js`ファイルを作成し、以下のように設定します:

```js
module.exports = {
  plugins: [
    require('@smsshcss/postcss')({
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
      ],
      safelist: [
        'flex', 'items-center', 'justify-between'
      ]
    }),
    // その他のプラグイン
    require('autoprefixer')
  ]
};
```

### CSSファイルでのインポート

スタイルシートで`smsshcss`をインポートします:

```css
@import "smsshcss";

```

### HTMLでの使用

```html
<div class="flex items-center justify-between">
  <h1 class="text-2xl font-bold">Hello, smsshcss!</h1>
  <button class="text-sm">Click me</button>
</div>
```

## 開発

### パッケージ構成

- `smsshcss`: コアライブラリ (ユーティリティ定義)
- `@smsshcss/postcss`: PostCSSプラグイン (クラス抽出とCSSの生成)

### 開発用コマンド

```bash
# 依存関係のインストール
yarn

# ビルド
yarn build

# プレイグラウンドでのテスト
cd playground/v1
yarn build
yarn serve
```

## ライセンス

MIT 