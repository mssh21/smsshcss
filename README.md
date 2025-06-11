# SmsshCSS - 軽量ユーティリティファーストCSSフレームワーク

SmsshCSSは、軽量なユーティリティファーストCSSフレームワークです。HTMLファイル内で使用されるクラスのみを生成し、最適化されたCSSを提供します。

## 特徴

- **ユーティリティファースト**: 再利用可能なユーティリティクラスを使用してUIを素早く構築
- **パージ機能**: HTMLで使用されたクラスのみを含む最適化されたCSSを生成
- **カスタマイズ可能**: 設定ファイルを通じてトークンやスタイルをカスタマイズ可能
- **高速**: 最小限のCSSでパフォーマンスを最適化
- **多様な統合**: PostCSSプラグインとViteプラグインの両方をサポート
- **コンポーネントクラス**: よく使うユーティリティの組み合わせを設定ファイルで定義できる独自機能 🆕

## インストール

### Viteプラグイン

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite

# pnpm
pnpm add smsshcss @smsshcss/vite
```

## 利用方法

### 1. Viteプラグインを使用する場合（推奨）

`vite.config.js`にプラグインを追加：

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeReset: true,
      includeBase: true,

      content: [
        'index.html',
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        'components/**/*.{js,ts,jsx,tsx,vue}',
        '**/*.html',
      ],

      purge: {
        enabled: true,
        safelist: [
          'm-2xl',
          'p-2xl',
          'mt-2xl',
          'mb-2xl',
          'mx-2xl',
          'py-2xl',
          'gap-2xl',
          'gap-x-2xl',
          'gap-y-2xl',
          /^hover:p-/,
          /^focus:m-/,
        ],
        blocklist: ['m-2xs', 'p-2xs', 'gap-2xs', 'mt-2xs', 'mb-2xs', /^gap-x-2xs/, /^gap-y-2xs/],
        keyframes: true,
        fontFace: true,
        variables: true,
      },

      theme: {
        spacing: {
          72: '18rem',
          84: '21rem',
          96: '24rem',
          custom: '2.5rem',
        },
        display: {
          'custom-flex': 'flex',
          'custom-grid': 'grid',
        },

        // コンポーネントクラスの定義（SmsshCSS独自機能）
        components: {
          'main-layout': 'w-lg mx-auto px-lg block',
          card: 'p-md bg-white rounded-lg shadow-md',
          btn: 'inline-block px-md py-sm rounded',
          'btn-primary': 'btn bg-blue-500 text-white',
          'flex-center': 'flex justify-center items-center',
        },
      },

      showPurgeReport: false,
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

<!-- コンポーネントクラスの使用例 -->
<div class="main-layout">
  <div class="card">
    <h2>便利なコンポーネントクラス</h2>
    <p>設定ファイルで定義したクラスを使用</p>
    <button class="btn-primary">クリック</button>
  </div>
</div>
```

Viteプラグインが自動的に使用されたクラスを検出し、必要なCSSを生成します。

## 開発ツール

SmsshCSSには開発効率を向上させるための豊富なツールが付属しています：

### 設定ファイルの管理

```bash
# 設定ファイルの作成（サンプルをコピー）
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js

# 設定の妥当性をチェック
yarn validate:config
# または
pnpm validate:config
```

### 新しいユーティリティクラスの生成

```bash
# 基本的なユーティリティクラスを生成
yarn generate:utility color --css-property=color --prefix=text

# 方向指定あり（margin, paddingのような）
yarn generate:utility border --directions --default-values='{"sm":"1px","md":"2px"}'

# pnpmの場合
pnpm generate:utility color --css-property=color --prefix=text
```

### デバッグとパフォーマンス分析

```bash
# CSS生成の詳細情報を表示
yarn debug:classes
pnpm debug:classes

# 重複するCSSセレクターをチェック
yarn check:duplicates
pnpm check:duplicates

# CSSサイズレポートを生成
yarn size:report
pnpm size:report

# 利用可能な分析ツールを表示
yarn analyze:css
pnpm analyze:css
```

## ドキュメント

- [📚 ドキュメント目次](packages/smsshcss/DOCUMENTATION_INDEX.md) - 全ドキュメントへのアクセスポイント
- [🎨 ユーティリティクラス リファレンス](packages/smsshcss/UTILITY_CLASSES.md) - 全ユーティリティクラスの詳細な一覧
- [🎨 テーマカスタマイズガイド](packages/smsshcss/THEME_CUSTOMIZATION.md) - ユーティリティクラスの値のカスタマイズ方法
- [👨‍💻 開発者ガイド](packages/smsshcss/DEVELOPER_GUIDE.md) - 開発環境のセットアップと新機能の追加方法
- [📖 API リファレンス](packages/smsshcss/API_REFERENCE.md) - 全API関数の詳細説明

## 利用可能なユーティリティクラス

#### スペース

フィボナッチ数列（1, 2, 3, 5, 8, 13, 21, 34, 55, 89...）を基準に、4pxを基本単位として計算：

- `2xs`: 0.25rem (4px) - フィボナッチ: 1
- `xs`: 0.5rem (8px) - フィボナッチ: 2
- `sm`: 0.75rem (12px) - フィボナッチ: 3
- `md`: calc(var(--space-base) \* 5) = 1.25rem (20px) - フィボナッチ: 5
- `lg`: calc(var(--space-base) \* 8) = 2rem (32px) - フィボナッチ: 8
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

#### 基本的なCSS関数

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

#### 高度な数学関数

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

#### 複雑なネスト関数

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

#### CSS変数との組み合わせ

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

すべての関数は、margin (m-), padding (p-), gap の各ユーティリティで、全方向（t, r, b, l, x, y）に対応しています。

### Display

```html
<!-- 基本的なdisplay -->
<div class="block">display: block</div>
<div class="inline">display: inline</div>
<div class="inline-block">display: inline-block</div>
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

## 🚀 最新の改善機能

### 型安全性の向上

SmsshCSSは任意値の型安全性を大幅に改善しました：

```typescript
import { validateArbitraryValue, isSafeArbitraryValue } from 'smsshcss';

// 任意値の検証
const result = validateArbitraryValue('calc(100% - 20px)', 'margin');
if (result.isValid) {
  console.log('✅ 有効な値:', result.sanitizedValue);
} else {
  console.error('❌ エラー:', result.errors);
}

// 安全性チェック
if (isSafeArbitraryValue('1rem')) {
  console.log('✅ 安全な値です');
}
```

### エラーハンドリングの強化

詳細なエラーメッセージとセキュリティチェック：

```typescript
import { ArbitraryValueValidator } from 'smsshcss';

const validator = new ArbitraryValueValidator({
  enableSecurityCheck: true,
  maxLength: 200,
  allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var'],
  allowedUnits: ['px', 'rem', 'em', '%', 'vh', 'vw'],
});

const result = validator.validate('javascript:alert("xss")');
// { isValid: false, errors: ['JavaScript URLs are not allowed'] }
```

### パフォーマンス最適化

高速なキャッシュシステムとメモ化：

```typescript
import { memoize, PerformanceCache, logCacheStats } from 'smsshcss';

// 関数のメモ化
const memoizedValidator = memoize(validateArbitraryValue);

// キャッシュ統計の確認
logCacheStats();
// 📊 Performance Cache Statistics:
//   Cache Hits: 150
//   Cache Misses: 50
//   Hit Rate: 75%
```

### バッチ処理

大量の任意値を効率的に処理：

```typescript
import { BatchProcessor } from 'smsshcss';

const processor = new BatchProcessor(
  async (values) => values.map((v) => validateArbitraryValue(v)),
  50, // バッチサイズ
  10 // タイムアウト（ms）
);

// 大量の値を効率的に処理
const results = await Promise.all([
  processor.add('1rem'),
  processor.add('calc(100% - 20px)'),
  processor.add('clamp(1rem, 4vw, 3rem)'),
  // ... 数百の値
]);
```

### 設定バリデーション

設定エラーの詳細な診断：

```typescript
import { validateConfig, formatValidationResult } from 'smsshcss';

const config = {
  content: ['src/**/*.html'],
  // 不正な設定...
};

const validation = validateConfig(config);
if (!validation.isValid) {
  console.error(formatValidationResult(validation));
  // ❌ Configuration has errors:
  // 🚨 Errors:
  //   • content field is required and must be an array
  //   Path: content
  //   Fix: Add content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"]
}
```

### Display

```html
<!-- 基本的なdisplay -->
<div class="block">display: block</div>
<div class="inline">display: inline</div>
<div class="inline-block">display: inline-block</div>
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

## 🧪 デバッグとパフォーマンス分析

### キャッシュ統計の監視

```typescript
import { logValidatorStats, logCacheStats } from 'smsshcss';

// バリデーターの統計
logValidatorStats();

// 全体のキャッシュ統計
logCacheStats();
```

### カスタムバリデーション設定

```typescript
import { ArbitraryValueValidator } from 'smsshcss';

// プロダクション環境用（厳密）
const productionValidator = new ArbitraryValueValidator({
  enableSecurityCheck: true,
  maxLength: 100,
  allowedFunctions: ['calc', 'min', 'max', 'clamp'],
  allowedUnits: ['px', 'rem', '%', 'vh', 'vw'],
  debug: false,
});

// 開発環境用（緩やか）
const developmentValidator = new ArbitraryValueValidator({
  enableSecurityCheck: false,
  maxLength: 500,
  allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var', 'env'],
  allowedUnits: ['px', 'rem', 'em', '%', 'vh', 'vw', 'ch', 'ex'],
  debug: true,
});
```

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
