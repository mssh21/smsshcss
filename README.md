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

<!-- CSS関数サポート -->
<div class="m-[calc(1rem+10px)]">margin: calc(1rem + 10px)</div>
<div class="p-[min(2rem,5vw)]">padding: min(2rem, 5vw)</div>
<div class="mt-[max(1rem,20px)]">margin-top: max(1rem, 20px)</div>
<div class="px-[clamp(1rem,4vw,3rem)]">padding-left/right: clamp(1rem, 4vw, 3rem)</div>

<!-- 複雑なネスト関数 -->
<div class="m-[calc(min(2rem,5vw)+10px)]">margin: calc(min(2rem, 5vw) + 10px)</div>
<div class="p-[max(calc(1rem*2),clamp(1rem,3vw,2rem))]">複雑なネスト関数</div>
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

#### 拡張CSS関数サポート

SmsshCSSは、レスポンシブデザインに最適化された豊富なCSS数学関数をサポートしています：

##### 基本的なCSS関数

```html
<!-- calc() - 数学的計算 -->
<div class="m-[calc(1rem+10px)]">margin: calc(1rem + 10px)</div>
<div class="p-[calc(100%-20px)]">padding: calc(100% - 20px)</div>
<div class="mt-[calc(100vh/4)]">margin-top: calc(100vh / 4)</div>

<!-- min() - 最小値を選択 -->
<div class="m-[min(2rem,5vw)]">margin: min(2rem, 5vw)</div>
<div class="p-[min(1rem,3%)]">padding: min(1rem, 3%)</div>
<div class="gap-[min(1rem,3vw)]">gap: min(1rem, 3vw)</div>

<!-- max() - 最大値を選択 -->
<div class="m-[max(1rem,20px)]">margin: max(1rem, 20px)</div>
<div class="p-[max(0.5rem,1vw)]">padding: max(0.5rem, 1vw)</div>
<div class="py-[max(1rem,2vh)]">padding-top/bottom: max(1rem, 2vh)</div>

<!-- clamp() - 値を範囲内に制限 -->
<div class="m-[clamp(1rem,4vw,3rem)]">margin: clamp(1rem, 4vw, 3rem)</div>
<div class="p-[clamp(0.5rem,2vw,2rem)]">padding: clamp(0.5rem, 2vw, 2rem)</div>
<div class="px-[clamp(1rem,5vw,4rem)]">padding-left/right: clamp(1rem, 5vw, 4rem)</div>
```

##### 高度な数学関数

```html
<!-- 数学演算関数 -->
<div class="m-[abs(-2rem)]">margin: abs(-2rem)</div>
<div class="p-[sign(1rem)]">padding: sign(1rem)</div>
<div class="mt-[mod(5rem,3rem)]">margin-top: mod(5rem, 3rem)</div>

<!-- 指数・対数関数 -->
<div class="px-[pow(2rem,2)]">padding-left/right: pow(2rem, 2)</div>
<div class="gap-[sqrt(4rem)]">gap: sqrt(4rem)</div>
<div class="m-[log(10rem)]">margin: log(10rem)</div>

<!-- 三角関数 -->
<div class="m-[sin(45deg)]">margin: sin(45deg)</div>
<div class="p-[cos(60deg)]">padding: cos(60deg)</div>
<div class="mt-[tan(30deg)]">margin-top: tan(30deg)</div>
```

##### 複雑なネスト関数

```html
<!-- calc()内でのmin/max/clamp使用 -->
<div class="m-[calc(min(2rem,5vw)+10px)]">margin: calc(min(2rem, 5vw) + 10px)</div>

<!-- max()内でのcalc()とclamp()の組み合わせ -->
<div class="p-[max(calc(1rem*2),clamp(1rem,3vw,2rem))]">
  padding: max(calc(1rem * 2), clamp(1rem, 3vw, 2rem))
</div>

<!-- clamp()内でのcalc()使用 -->
<div class="mt-[clamp(calc(1rem+5px),4vw,calc(3rem-10px))]">
  margin-top: clamp(calc(1rem + 5px), 4vw, calc(3rem - 10px))
</div>
```

##### CSS変数との組み合わせ

```html
<!-- CSS変数とCSS関数の組み合わせ -->
<div class="m-[var(--spacing-dynamic)]" style="--spacing-dynamic: clamp(1rem, 4vw, 3rem);">
  CSS変数とclamp関数の組み合わせ
</div>

<div class="p-[var(--responsive-padding)]" style="--responsive-padding: min(2rem, 5vw);">
  CSS変数とmin関数の組み合わせ
</div>
```

**サポートされているCSS関数一覧：**

- **calc()** - 数学的計算を実行
- **min()** - 複数の値から最小値を選択
- **max()** - 複数の値から最大値を選択
- **clamp()** - 最小値、推奨値、最大値の間で値を制限
- **abs(), sign(), mod(), rem()** - 数学演算関数
- **sin(), cos(), tan(), asin(), acos(), atan(), atan2()** - 三角関数
- **pow(), sqrt(), log(), exp(), hypot()** - 指数・対数関数

すべての関数は、margin (m-), padding (p-), gap の各ユーティリティで、全方向（t, r, b, l, x, y）に対応しています。

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
