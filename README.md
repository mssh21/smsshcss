# SmsshCSS - 軽量ユーティリティファーストCSSフレームワーク

SmsshCSSは、軽量なユーティリティファーストCSSフレームワークです。HTMLファイル内で使用されるクラスのみを生成し、最適化されたCSSを提供します。

## 特徴

- **ユーティリティファースト**: 再利用可能なユーティリティクラスを使用してUIを素早く構築
- **パージ機能**: HTMLで使用されたクラスのみを含む最適化されたCSSを生成
- **カスタマイズ可能**: 設定ファイルを通じてトークンやスタイルをカスタマイズ可能
- **高速**: 最小限のCSSでパフォーマンスを最適化
- **多様な統合**: PostCSSプラグインとViteプラグインの両方をサポート

## インストール

### Viteプラグイン

```bash
# npm
npm install smsshcss　@smsshcss/vite

# yarn
yarn add smsshcss　@smsshcss/vite
```

## 利用方法

### 1. Viteプラグインを使用する場合（推奨）

`vite.config.js`または`vite.config.ts`にプラグインを追加：

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
      includeResetCSS: true,
      includeBaseCSS: true,
    }),
  ],
});
```

HTMLでユーティリティクラスを使用：

```html
<div class="p-md m-lg flex">
  <h1 class="mb-sm">Hello SmsshCSS!</h1>
  <p class="px-md py-sm">軽量で高速なCSSフレームワーク</p>
</div>
```

Viteプラグインが自動的に使用されたクラスを検出し、必要なCSSを生成します。

### 2. プログラマティックに使用する場合

```javascript
import { generateCSS } from 'smsshcss';

const css = generateCSS({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  includeResetCSS: true,
  includeBaseCSS: true,
});

console.log(css);
```

## 利用可能なユーティリティクラス

### スペーシング（Margin/Padding）

フィボナッチ数列ベースのスペーシングシステム（直感的な命名）：

#### サイズ

フィボナッチ数列（1, 2, 3, 5, 8, 13, 21, 34, 55, 89...）を基準に、4pxを基本単位として計算：

- `2xs`: 0.25rem (4px) - フィボナッチ: 1
- `xs`: 0.5rem (8px) - フィボナッチ: 2
- `sm`: 0.75rem (12px) - フィボナッチ: 3
- `md`: 1.25rem (20px) - フィボナッチ: 5
- `lg`: 2rem (32px) - フィボナッチ: 8
- `xl`: 3.25rem (52px) - フィボナッチ: 13
- `2xl`: 5.25rem (84px) - フィボナッチ: 21
- `3xl`: 8.5rem (136px) - フィボナッチ: 34
- `4xl`: 13.75rem (220px) - フィボナッチ: 55
- `5xl`: 22.25rem (356px) - フィボナッチ: 89

#### Margin

```html
<!-- 全方向 -->
<div class="m-md">margin: 1.25rem</div>

<!-- 方向指定 -->
<div class="mt-lg">margin-top: 2rem</div>
<div class="mr-sm">margin-right: 0.75rem</div>
<div class="mb-xl">margin-bottom: 3.25rem</div>
<div class="ml-xs">margin-left: 0.5rem</div>

<!-- 軸指定 -->
<div class="mx-md">margin-left: 1.25rem; margin-right: 1.25rem</div>
<div class="my-lg">margin-top: 2rem; margin-bottom: 2rem</div>

<!-- 任意の値 -->
<div class="m-[20px]">margin: 20px</div>
<div class="mt-[1.5rem]">margin-top: 1.5rem</div>
```

#### Padding

```html
<!-- 全方向 -->
<div class="p-md">padding: 1.25rem</div>

<!-- 方向指定 -->
<div class="pt-lg">padding-top: 2rem</div>
<div class="pr-sm">padding-right: 0.75rem</div>
<div class="pb-xl">padding-bottom: 3.25rem</div>
<div class="pl-xs">padding-left: 0.5rem</div>

<!-- 軸指定 -->
<div class="px-md">padding-left: 1.25rem; padding-right: 1.25rem</div>
<div class="py-lg">padding-top: 2rem; padding-bottom: 2rem</div>

<!-- 任意の値 -->
<div class="p-[1.5rem]">padding: 1.5rem</div>
```

#### Gap（Flexbox/Grid）

```html
<div class="flex gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="grid gap-lg">
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
</div>
```

### Display

```html
<!-- 基本的なdisplay -->
<div class="block">display: block</div>
<div class="inline">display: inline</div>
<div class="inline-block">display: inline flow-root</div>
<div class="flex">display: block flex</div>
<div class="inline-flex">display: inline flex</div>
<div class="grid">display: block grid</div>
<div class="inline-grid">display: inline grid</div>
<div class="none">display: none</div>
<div class="hidden">display: none</div>

<!-- 追加のdisplay -->
<div class="contents">display: contents</div>
<div class="flow-root">display: block flow-root</div>
<div class="list-item">display: block flow list-item</div>
<div class="table">display: block table</div>
<div class="table-cell">display: table-cell</div>
<div class="table-row">display: table-row</div>
```

## 設定オプション

### Viteプラグイン設定

```javascript
smsshcss({
  // HTMLファイルのパターン（必須）
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],

  // Reset CSSを含めるか（デフォルト: true）
  includeResetCSS: true,

  // Base CSSを含めるか（デフォルト: true）
  includeBaseCSS: true,

  // カスタムテーマ設定
  theme: {
    spacing: {
      custom: '10px',
      large: '5rem',
    },
  },
});
```

## サンプルプロジェクト

完全な動作例は `playgrounds/vite-plugin` ディレクトリを参照してください：

```bash
cd playgrounds/vite-plugin

# yarn
yarn install
yarn dev

# npm
npm install
npm run dev
```

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
