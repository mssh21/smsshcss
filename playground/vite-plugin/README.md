# SmsshCSS Vite Plugin Demo

SmsshCSSのViteプラグインのデモプロジェクトです。ユーティリティクラスの使用例を示しています。

## 機能

- Spacingユーティリティ（マージン、パディング）
- Displayユーティリティ（フレックスボックス、グリッド）
- カスタム値の使用例

## 開発サーバーの起動

```bash
# 依存関係のインストール
yarn install

# 開発サーバーの起動
yarn dev
```

## ビルド

```bash
yarn build
```

## プレビュー

```bash
yarn preview
```

## プロジェクト構成

```
vite-plugin/
├── index.html          # メインのHTMLファイル
├── src/
│   └── style.css      # スタイル定義
├── vite.config.ts     # Vite設定
├── tsconfig.json      # TypeScript設定
└── package.json       # プロジェクト設定
```

## 使用例

### Spacingユーティリティ

```html
<div class="m-md p-lg">マージンとパディング</div>
<div class="mt-lg mb-md">上下マージン</div>
<div class="mx-xl py-md">水平マージンと垂直パディング</div>
```

### Displayユーティリティ

```html
<div class="flex gap-md">
  <div class="p-sm">フレックスアイテム1</div>
  <div class="p-sm">フレックスアイテム2</div>
</div>

<div class="grid gap-lg">
  <div class="p-md">グリッドアイテム1</div>
  <div class="p-md">グリッドアイテム2</div>
</div>
```

### カスタム値

```html
<div class="m-[20px] p-[1.5rem]">カスタムマージンとパディング</div>
<div class="mt-[30px] mb-[15px]">カスタム上下マージン</div>
``` 